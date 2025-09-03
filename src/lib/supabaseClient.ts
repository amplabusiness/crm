import { createClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (!url || !anon) {
    throw new Error('Supabase env not set: define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  }
  client = createClient(url, anon);
  return client;
}
