import { useState } from 'react';

export default function CnpjaSync(){
  const [offset,setOffset]=useState(0);
  const [log,setLog]=useState<string[]>([]);
  const [running,setRunning]=useState(false);

  async function runBatch(){
    setRunning(true);
    try{
      const r = await fetch('/api/cnpja-sync-all',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({offset,limit:25,depth:2})});
      const j = await r.json();
      if(!r.ok||j.ok===false) throw new Error(j.error||'Erro');
      setOffset(j.nextOffset||0);
      setLog(l=>[...l, `processed=${j.processed} failed=${j.failed} next=${j.nextOffset}`]);
    }catch(e:any){ setLog(l=>[...l, `erro: ${String(e.message||e)}`]); }
    finally{ setRunning(false); }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-800">Sincronizar CNPJa</h1>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={runBatch} disabled={running} className="rounded bg-brand-500 px-3 py-2 text-white hover:bg-brand-600 disabled:opacity-50">{running?'Processando…':'Rodar lote (25)'}</button>
          <span className="text-sm text-slate-500">offset: {offset}</span>
        </div>
        <div className="mt-3 space-y-1 text-xs">
          {log.map((l,i)=>(<div key={i} className="font-mono">{l}</div>))}
        </div>
      </div>
    </div>
  );
}
