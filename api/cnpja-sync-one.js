import { getSupabaseAdmin } from './_lib/supabase.js';
import { getCompany, mapCompanyToRows } from './_lib/cnpja.js';

function onlyDigits(s){return (s||'').replace(/\D+/g,'');}

export default async function handler(req, res){
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  const { cnpj, depth = 1 } = req.body || {};
  if (!cnpj) return res.status(400).json({ error: 'missing_cnpj' });
  const root = onlyDigits(cnpj);
  const visited = new Set();
  const queue = [{ cnpj: root, grau: 0 }];
  const sb = getSupabaseAdmin();
  const upsertCounts = { empresas: 0, info:0, end:0, simples:0, cnaes:0, socios:0, rel:0 };

  async function upsertAll(cnpj, data){
    // ensure base empresas row
    await sb.from('empresas').upsert([{ cnpj }], { onConflict: 'cnpj' });
    upsertCounts.empresas++;

    const mapped = mapCompanyToRows(data);
    await sb.from('empresas_info').upsert([mapped.info], { onConflict: 'cnpj' }); upsertCounts.info++;
    await sb.from('empresas_endereco').upsert([mapped.end], { onConflict: 'cnpj' }); upsertCounts.end++;
    await sb.from('empresas_simples').upsert([mapped.simples], { onConflict: 'cnpj' }); upsertCounts.simples++;
    if (mapped.cnaes.length) {
      // delete + insert to avoid duplicates
      await sb.from('empresas_cnaes_sec').delete().eq('cnpj', cnpj);
      const { error: cErr } = await sb.from('empresas_cnaes_sec').insert(mapped.cnaes);
      if (!cErr) upsertCounts.cnaes += mapped.cnaes.length;
    }
    if (mapped.socios.length) {
      await sb.from('empresas_socios').delete().eq('cnpj', cnpj);
      const { error: sErr } = await sb.from('empresas_socios').insert(mapped.socios);
      if (!sErr) upsertCounts.socios += mapped.socios.length;
    }
    await sb.from('empresas_raw').upsert([{ cnpj, payload: data }], { onConflict: 'cnpj' });
  }

  const edges = [];
  while (queue.length) {
    const { cnpj: cur, grau } = queue.shift();
    if (visited.has(cur) || (grau > depth)) continue;
    visited.add(cur);
    try{
      const data = await getCompany(cur);
      await upsertAll(cur, data);
      const next = (data?.partners||[]).map(p => onlyDigits(p?.taxId)).filter(v => v && v.length===14);
      for (const c of next) {
        edges.push({ from_cnpj: cur, to_cnpj: c, relacao: 'socio_empresa', grau: grau+1 });
        if (grau+1 <= depth) queue.push({ cnpj: c, grau: grau+1 });
      }
    }catch(e){ /* ignore individual errors */ }
  }

  if (edges.length) {
    await sb.from('empresas_relacoes').insert(edges).select();
    upsertCounts.rel += edges.length;
  }

  return res.status(200).json({ ok:true, root, depth, visited: visited.size, ...upsertCounts });
}
