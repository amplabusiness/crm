import { requireEnv, getEnv } from './env.js';

const BASE = getEnv('CNPJA_BASE_URL', 'https://api.cnpja.com.br');

export async function getCompany(cnpj) {
  const key = requireEnv('CNPJA_API_KEY');
  const url = `${BASE}/companies/${cnpj}`;
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${key}` }
  });
  if (!res.ok) throw new Error(`CNPJa ${res.status}`);
  return res.json();
}
