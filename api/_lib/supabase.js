import { createClient } from '@supabase/supabase-js';
import { getEnv, requireEnv } from './env.js';

let admin = null;
export function getSupabaseAdmin() {
  if (admin) return admin;
  const url = getEnv('SUPABASE_URL') || getEnv('VITE_SUPABASE_URL');
  const serviceRole = requireEnv('SUPABASE_SERVICE_ROLE');
  admin = createClient(url, serviceRole, { auth: { persistSession: false } });
  return admin;
}
