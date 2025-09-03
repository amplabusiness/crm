import { createClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

function readRuntimeConfig() {
  const lsUrl = typeof localStorage !== 'undefined' ? localStorage.getItem('sb_url') : null;
  const lsAnon = typeof localStorage !== 'undefined' ? localStorage.getItem('sb_anon') : null;
  const url = lsUrl || (import.meta.env.VITE_SUPABASE_URL as string | undefined);
  const anon = lsAnon || (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined);
  return { url, anon };
}

export function getSupabase(): SupabaseClient {
  if (client) return client;
  const { url, anon } = readRuntimeConfig();
  if (!url || !anon) {
    throw new Error('Configure o Supabase: informe URL e anon key nas variáveis ou em Settings.');
  }
  client = createClient(url, anon);
  return client;
}
