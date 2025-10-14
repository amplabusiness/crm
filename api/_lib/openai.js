import { requireEnv, getEnv } from './env.js';

const OPENAI_BASE = getEnv('OPENAI_BASE_URL', 'https://api.openai.com/v1');

export async function chatCompletion(messages, opts = {}) {
  const apiKey = requireEnv('OPENAI_API_KEY');
  const model = getEnv('OPENAI_MODEL', 'gpt-4o-mini');
  const body = { model, messages, temperature: 0, ...opts };
  const res = await fetch(`${OPENAI_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${text}`);
  }
  const json = await res.json();
  return json.choices?.[0]?.message?.content ?? '';
}
