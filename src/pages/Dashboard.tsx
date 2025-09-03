import { useEffect, useState } from 'react';

export function Dashboard() {
  const [now, setNow] = useState<string>('');
  useEffect(() => {
    const id = setInterval(() => setNow(new Date().toLocaleTimeString()), 1000);
    setNow(new Date().toLocaleTimeString());
    return () => clearInterval(id);
  }, []);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-800">Welcome</h1>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-slate-700">App is running.</p>
        <p className="text-slate-500 text-sm">Current time: {now}</p>
      </div>
    </div>
  );
}
