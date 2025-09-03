import { getSupabaseAdmin } from './_lib/supabase.js';
import { chatCompletion } from './_lib/openai.js';
import { getCompany } from './_lib/cnpja.js';
import fs from 'node:fs';
import path from 'node:path';

const promptPath = path.join(process.cwd(), 'docs', 'super_prompt_agentes_de_ged_fiscal_contabil_python_vscode.md');
const systemPrompt = fs.existsSync(promptPath)
  ? fs.readFileSync(promptPath, 'utf8')
  : 'Você é um agente de GED Fiscal/Contábil. Responda apenas JSON.';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  const { path: filePath, origem, empresa_contexto, hints } = req.body || {};
  if (!empresa_contexto?.cnpj) return res.status(400).json({ error: 'missing_cnpj' });

  try {
    // Enriquecimento CNPJa
    let company = null;
    try { company = await getCompany(empresa_contexto.cnpj); } catch {}

    const input = { path: filePath, origem, empresa_contexto: { ...empresa_contexto, cnpja: company }, hints };
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: JSON.stringify(input) }
    ];
    const content = await chatCompletion(messages, { response_format: { type: 'json_object' } });
    const result = JSON.parse(content);

    // Persistência mínima (opcional): salvar no Supabase se tabelas existirem
    try {
      const sb = getSupabaseAdmin();
      await sb.from('documentos_avancados').insert({
        doc_id: result.doc_id || null,
        cnpj: result?.empresa?.cnpj || empresa_contexto.cnpj,
        doc_type: result.doc_type || null,
        analise_ia: result,
      });
    } catch {}

    return res.status(200).json({ ok: true, result });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
}
