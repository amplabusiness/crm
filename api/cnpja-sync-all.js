import { getSupabaseAdmin } from './_lib/supabase.js';

function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
function onlyDigits(s){return (s||'').replace(/\D+/g,'');}

export default async function handler(req,res){
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  const { offset=0, limit=25, depth=1 } = req.body||{};
  const sb = getSupabaseAdmin();
  const { data: list, error } = await sb.from('empresas').select('cnpj').order('cnpj').range(offset, offset+limit-1);
  if (error) return res.status(500).json({ ok:false, error: error.message });
  let ok=0, fails=0;
  for (const row of list||[]) {
    try{
      const r = await fetch(`${process.env.VERCEL_URL? 'https://'+process.env.VERCEL_URL : ''}/api/cnpja-sync-one`, {
        method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ cnpj: onlyDigits(row.cnpj), depth })
      });
      if (!r.ok) { fails++; continue; }
      ok++;
      await sleep(200);
    }catch{ fails++; }
  }
  return res.status(200).json({ ok:true, processed: ok, failed: fails, nextOffset: offset + (list?.length||0) });
}
