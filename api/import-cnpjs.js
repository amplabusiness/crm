import { getSupabaseAdmin } from './_lib/supabase.js';

function onlyDigits(s){return (s||'').replace(/\D+/g,'');}
function isCNPJ(d){return d.length===14;}

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'method_not_allowed'});
  const { text } = req.body||{};
  if(!text) return res.status(400).json({error:'missing_text'});
  const raw = text.split(/\r?\n|,|;|\s+/).filter(Boolean);
  const cleaned = Array.from(new Set(raw.map(onlyDigits).filter(isCNPJ)));
  if(cleaned.length===0) return res.status(400).json({error:'no_cnpjs_found'});
  try{
    const sb = getSupabaseAdmin();
    // Ensure table exists (best-effort, ignore error if exists)
    try{
      await sb.rpc('exec_sql', { sql: `create table if not exists public.empresas (id bigserial primary key, cnpj text unique not null, created_at timestamptz default now());` });
    }catch{}
    // Upsert
    const rows = cleaned.map(c=>({ cnpj: c }));
    const { error } = await sb.from('empresas').upsert(rows, { onConflict: 'cnpj' });
    if(error) return res.status(500).json({ ok:false, error: error.message });
    return res.status(200).json({ ok:true, inserted: rows.length });
  }catch(e){
    return res.status(500).json({ ok:false, error: String(e) });
  }
}
