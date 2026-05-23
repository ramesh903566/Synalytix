import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

export class StorageService {
  static async getSignedUploadUrl(bucket: string, path: string) {
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .createSignedUploadUrl(path);

    if (error) throw error;
    return data;
  }
}
