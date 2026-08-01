import 'dotenv/config';
import { supabase } from './src/lib/supabase';
async function run() {
  const { data, error } = await supabase.from('oauth_states').select('*');
  console.log('States:', data);
}
run();
