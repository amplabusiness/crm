import { NavLink, Routes, Route } from 'react-router-dom';

function Section({ title }: { title: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-medium text-slate-800">{title}</h2>
      <p className="text-slate-600">Detailed insights and charts.</p>
    </div>
  );
}

export function Reports() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 text-sm">
        <NavLink to="." end className={({isActive})=>`px-2 py-1 rounded ${isActive?'bg-brand-50 text-brand-700':'text-slate-600 hover:text-slate-800'}`}>Overview</NavLink>
        <NavLink to="sales" className={({isActive})=>`px-2 py-1 rounded ${isActive?'bg-brand-50 text-brand-700':'text-slate-600 hover:text-slate-800'}`}>Sales</NavLink>
        <NavLink to="traffic" className={({isActive})=>`px-2 py-1 rounded ${isActive?'bg-brand-50 text-brand-700':'text-slate-600 hover:text-slate-800'}`}>Traffic</NavLink>
      </div>
      <Routes>
        <Route index element={<Section title="Reports Overview" />} />
        <Route path="sales" element={<Section title="Sales" />} />
        <Route path="traffic" element={<Section title="Traffic" />} />
      </Routes>
    </div>
  );
}
