import { useState } from 'react';

export default function Experts() {
  const [cnpj, setCnpj] = useState('');
  const [path, setPath] = useState('/uploads/pending/sample.pdf');
  const [resp, setResp] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true); setError(null); setResp(null);
    try {
      const r = await fetch('/api/orchestrate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, origem: 'upload_manual', empresa_contexto: { cnpj }, hints: {} })
      });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || 'Erro');
      setResp(j.result);
    } catch (e:any) { setError(String(e.message || e)); }
    finally { setLoading(false); }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-800">Especialistas (A1–A9)</h1>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3">
          <label className="text-sm text-slate-600">CNPJ</label>
          <input className="rounded border border-slate-300 px-3 py-2 text-sm" value={cnpj} onChange={e=>setCnpj(e.target.value)} placeholder="20982311000100" />
          <label className="text-sm text-slate-600">Path do arquivo</label>
          <input className="rounded border border-slate-300 px-3 py-2 text-sm" value={path} onChange={e=>setPath(e.target.value)} />
          <button onClick={run} disabled={loading} className="mt-2 rounded bg-brand-500 px-3 py-2 text-white hover:bg-brand-600 disabled:opacity-50">{loading? 'Processando…':'Processar'}</button>
        </div>
        {error && <div className="mt-3 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        {resp && (
          <pre className="mt-3 overflow-auto rounded bg-slate-900 p-3 text-xs text-slate-100">{JSON.stringify(resp, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}
