import { createClient } from '@supabase/supabase-js';
import { getEnv, requireEnv } from './env.js';

let admin = null;
export function getSupabaseAdmin() {
  if (admin) return admin;
  const url = getEnv('SUPABASE_URL') || getEnv('VITE_SUPABASE_URL');
  if (!url) throw new Error('Missing env: SUPABASE_URL or VITE_SUPABASE_URL');
  const serviceRole = getEnv('SUPABASE_SERVICE_ROLE') || getEnv('SERVICE_ROLE');
  if (!serviceRole) throw new Error('Missing env: SUPABASE_SERVICE_ROLE or SERVICE_ROLE');
  admin = createClient(url, serviceRole, { auth: { persistSession: false } });
  return admin;
}
