import { useEffect, useState } from 'react';

export function Settings() {
  const [url, setUrl] = useState('');
  const [anon, setAnon] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const lsUrl = localStorage.getItem('sb_url') || '';
    const lsAnon = localStorage.getItem('sb_anon') || '';
    setUrl(lsUrl);
    setAnon(lsAnon);
  }, []);

  function save() {
    localStorage.setItem('sb_url', url.trim());
    localStorage.setItem('sb_anon', anon.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
    // Reload optional if we need to re-init clients across app:
    // location.reload();
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-medium text-slate-800">Settings</h2>
        <div className="mt-4 grid gap-3">
          <label className="text-sm text-slate-600">Supabase Project URL</label>
          <input
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
            placeholder="https://xxxxx.supabase.co"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <label className="mt-2 text-sm text-slate-600">Supabase anon public key</label>
          <input
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
            placeholder="eyJhbGci..."
            value={anon}
            onChange={(e) => setAnon(e.target.value)}
          />
          <div className="mt-3">
            <button onClick={save} className="rounded bg-brand-500 px-3 py-2 text-white hover:bg-brand-600">Salvar</button>
            {saved && <span className="ml-2 text-sm text-brand-700">Salvo</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
