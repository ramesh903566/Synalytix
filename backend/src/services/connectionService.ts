import { supabase, encrypt, decrypt } from '../lib/supabase';
import { Platform, PlatformConnection } from '../types';

/**
 * ConnectionService
 *
 * All database operations for platform_connections table.
 * This is the single source of truth for storing and retrieving OAuth tokens.
 */
export const ConnectionService = {

  /**
   * Save or update a platform connection for a user.
   * Uses upsert so reconnecting an already-connected platform just updates the token.
   */
  async upsert(params: {
    user_id: string;
    platform: Platform;
    access_token?: string | null;
    refresh_token?: string | null;
    expires_at?: string | null;
    platform_user_id: string;
    platform_username: string;
    scope?: string | null;
  }): Promise<PlatformConnection> {
    const { data, error } = await supabase
      .from('platform_connections')
      .upsert(
        {
          user_id: params.user_id,
          platform: params.platform,
          access_token: params.access_token ? encrypt(params.access_token) : null,
          refresh_token: params.refresh_token ? encrypt(params.refresh_token) : null,
          expires_at: params.expires_at ?? null,
          platform_user_id: params.platform_user_id,
          platform_username: params.platform_username,
          scope: params.scope ?? null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,platform',   // update if this user+platform already exists
          ignoreDuplicates: false,
        }
      )
      .select()
      .single();

    if (error) throw new Error(`Failed to save connection: ${error.message}`);
    return data;
  },

  /**
   * Get a connection by user + platform.
   * Returns the connection with decrypted tokens ready to use.
   */
  async getByUserAndPlatform(
    user_id: string,
    platform: Platform
  ): Promise<(PlatformConnection & { decrypted_access_token: string | null; decrypted_refresh_token: string | null }) | null> {
    const { data, error } = await supabase
      .from('platform_connections')
      .select('*')
      .eq('user_id', user_id)
      .eq('platform', platform)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // no rows found
      throw new Error(`Failed to get connection: ${error.message}`);
    }

    if (!data) return null;

    return {
      ...data,
      decrypted_access_token: data.access_token ? decrypt(data.access_token) : null,
      decrypted_refresh_token: data.refresh_token ? decrypt(data.refresh_token) : null,
    };
  },

  /**
   * Get all connections for a user (for the "Apps" page).
   * Does NOT return decrypted tokens — just metadata.
   */
  async getAllForUser(user_id: string): Promise<
    Pick<PlatformConnection, 'id' | 'platform' | 'platform_username' | 'platform_user_id' | 'created_at' | 'updated_at' | 'expires_at'>[]
  > {
    const { data, error } = await supabase
      .from('platform_connections')
      .select('id, platform, platform_username, platform_user_id, created_at, updated_at, expires_at')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to get connections: ${error.message}`);
    return (data ?? []) as PlatformConnection[];
  },

  /**
   * Remove a connection (user disconnects a platform).
   */
  async delete(user_id: string, platform: Platform): Promise<void> {
    const { error } = await supabase
      .from('platform_connections')
      .delete()
      .eq('user_id', user_id)
      .eq('platform', platform);

    if (error) throw new Error(`Failed to delete connection: ${error.message}`);
  },

  /**
   * Check if a user has connected a specific platform.
   */
  async isConnected(user_id: string, platform: Platform): Promise<boolean> {
    const { count, error } = await supabase
      .from('platform_connections')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user_id)
      .eq('platform', platform);

    if (error) return false;
    return (count ?? 0) > 0;
  },

  /**
   * Update just the access token (used during token refresh).
   */
  async updateToken(
    user_id: string,
    platform: Platform,
    newAccessToken: string,
    newExpiresAt?: string | null
  ): Promise<void> {
    const { error } = await supabase
      .from('platform_connections')
      .update({
        access_token: encrypt(newAccessToken),
        expires_at: newExpiresAt ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user_id)
      .eq('platform', platform);

    if (error) throw new Error(`Failed to update token: ${error.message}`);
  },

  /**
   * Get all connections expiring within the next N hours.
   * Used by the token refresh cron job.
   */
  async getExpiringSoon(hoursAhead: number = 24): Promise<PlatformConnection[]> {
    const threshold = new Date(Date.now() + hoursAhead * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('platform_connections')
      .select('*')
      .not('expires_at', 'is', null)
      .lt('expires_at', threshold);

    if (error) throw new Error(`Failed to get expiring connections: ${error.message}`);
    return (data ?? []) as PlatformConnection[];
  },
};

// ─── OAuth State Service ──────────────────────────────────────────────────────
// OAuth states are temporary (expire in 10 minutes). Used for CSRF protection.

export const OAuthStateService = {
  async save(params: {
    user_id: string;
    platform: Platform;
    state_token: string;
    code_verifier?: string;
  }): Promise<void> {
    const { error } = await supabase.from('oauth_states').insert({
      user_id: params.user_id,
      platform: params.platform,
      state_token: params.state_token,
      code_verifier: params.code_verifier ?? null,
      created_at: new Date().toISOString(),
    });

    if (error) throw new Error(`Failed to save OAuth state: ${error.message}`);
  },

  async getAndDelete(state_token: string): Promise<{
    user_id: string;
    platform: Platform;
    code_verifier: string | null;
  } | null> {
    // Get the state
    const { data, error } = await supabase
      .from('oauth_states')
      .select('*')
      .eq('state_token', state_token)
      .single();

    if (error || !data) return null;

    // Delete it immediately — states are one-time use
    await supabase.from('oauth_states').delete().eq('state_token', state_token);

    // Check it's not expired (10 minute window)
    const createdAt = new Date(data.created_at).getTime();
    const tenMinutes = 10 * 60 * 1000;
    if (Date.now() - createdAt > tenMinutes) {
      return null; // expired
    }

    return {
      user_id: data.user_id,
      platform: data.platform as Platform,
      code_verifier: data.code_verifier,
    };
  },
};
