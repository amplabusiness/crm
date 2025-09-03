import { Routes, Route, NavLink } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Sidebar } from './components/Sidebar';
import { Todos } from './features/todos/Todos';
import Experts from './pages/Experts';
import ImportPage from './pages/Import';
import CnpjaSync from './pages/CnpjaSync';

export default function App() {
  return (
    <div className="app-shell">
      <aside className="app-sidebar bg-white border-r border-slate-200">
        <div className="p-4 text-lg font-semibold text-brand-700">Modern App</div>
        <Sidebar />
      </aside>
      <header className="app-header sticky top-0 z-10 flex items-center justify-between bg-white/90 px-4 shadow-sm backdrop-blur">
        <div className="font-medium text-slate-700">Dashboard</div>
        <nav className="flex items-center gap-3 text-sm">
          <NavLink className={({isActive})=>`px-2 py-1 rounded ${isActive? 'bg-brand-50 text-brand-700':'text-slate-600 hover:text-slate-800'}`} to="/">Home</NavLink>
          <NavLink className={({isActive})=>`px-2 py-1 rounded ${isActive? 'bg-brand-50 text-brand-700':'text-slate-600 hover:text-slate-800'}`} to="/reports">Reports</NavLink>
          <NavLink className={({isActive})=>`px-2 py-1 rounded ${isActive? 'bg-brand-50 text-brand-700':'text-slate-600 hover:text-slate-800'}`} to="/todos">Todos</NavLink>
          <NavLink className={({isActive})=>`px-2 py-1 rounded ${isActive? 'bg-brand-50 text-brand-700':'text-slate-600 hover:text-slate-800'}`} to="/especialistas">Especialistas</NavLink>
          <NavLink className={({isActive})=>`px-2 py-1 rounded ${isActive? 'bg-brand-50 text-brand-700':'text-slate-600 hover:text-slate-800'}`} to="/importar">Importar</NavLink>
          <NavLink className={({isActive})=>`px-2 py-1 rounded ${isActive? 'bg-brand-50 text-brand-700':'text-slate-600 hover:text-slate-800'}`} to="/cnpja">CNPJa</NavLink>
          <NavLink className={({isActive})=>`px-2 py-1 rounded ${isActive? 'bg-brand-50 text-brand-700':'text-slate-600 hover:text-slate-800'}`} to="/settings">Settings</NavLink>
        </nav>
      </header>
      <main className="app-main p-4">
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/reports/*" element={<Reports/>} />
          <Route path="/todos" element={<Todos/>} />
          <Route path="/especialistas" element={<Experts/>} />
          <Route path="/importar" element={<ImportPage/>} />
          <Route path="/settings" element={<Settings/>} />
        </Routes>
      </main>
    </div>
  );
}
