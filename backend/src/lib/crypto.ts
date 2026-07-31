import { decrypt } from './supabase';

/**
 * Decrypts an encrypted token string.
 * Wrapper around the main decrypt function for backward compatibility
 * with recommendation connectors.
 */
export function decryptToken(encrypted: string): string {
  return decrypt(encrypted);
}
