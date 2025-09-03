import { useState } from 'react';

export default function ImportPage(){
  const [text,setText]=useState('');
  const [resp,setResp]=useState<any>(null);
  const [error,setError]=useState<string|null>(null);
  const [loading,setLoading]=useState(false);

  async function submit(){
    setLoading(true); setError(null); setResp(null);
    try{
      const r=await fetch('/api/import-cnpjs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text})});
      const j=await r.json();
      if(!r.ok||j.ok===false) throw new Error(j.error||'Erro');
      setResp(j);
    }catch(e:any){ setError(String(e.message||e)); }
    finally{ setLoading(false); }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-800">Importar CNPJs</h1>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <textarea className="h-60 w-full rounded border border-slate-300 p-2 text-sm" value={text} onChange={e=>setText(e.target.value)} placeholder="Cole a lista de CNPJs (com ou sem pontuação)"></textarea>
        <button onClick={submit} disabled={loading||!text.trim()} className="mt-3 rounded bg-brand-500 px-3 py-2 text-white hover:bg-brand-600 disabled:opacity-50">{loading?'Importando…':'Importar'}</button>
        {error && <div className="mt-3 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        {resp && <pre className="mt-3 overflow-auto rounded bg-slate-900 p-3 text-xs text-slate-100">{JSON.stringify(resp,null,2)}</pre>}
      </div>
    </div>
  );
}
