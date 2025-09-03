import fs from 'node:fs';
import path from 'node:path';
import { chatCompletion } from './_lib/openai.js';

const promptPath = path.join(process.cwd(), 'docs', 'super_prompt_agentes_de_ged_fiscal_contabil_python_vscode.md');
const systemPrompt = fs.existsSync(promptPath)
  ? fs.readFileSync(promptPath, 'utf8')
  : 'Você é um agente de GED Fiscal/Contábil. Responda apenas JSON.';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  const { input } = req.body || {};
  if (!input) return res.status(400).json({ error: 'missing_input' });

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: JSON.stringify(input) }
  ];
  try {
    const content = await chatCompletion(messages, { response_format: { type: 'json_object' } });
    const json = JSON.parse(content);
    return res.status(200).json({ ok: true, result: json });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
}
