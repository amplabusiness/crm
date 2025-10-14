import { useEffect, useMemo, useState } from 'react';
import { getSupabase } from '../../lib/supabaseClient';

export type Todo = {
  id: number;
  task: string | null;
  status: string | null;
};

export function Todos() {
  const supabase = useMemo(() => getSupabase(), []);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  async function load() {
    setLoading(true);
    setError(null);
    const query = supabase.from('todos').select('id, task, status').order('id', { ascending: true });
    const { data, error } = await query;
    if (error) {
      setError(error.message);
    } else {
      setTodos(data as Todo[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    const channel = supabase
      .channel('public:todos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'todos' }, () => {
        load();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const visible = useMemo(() => {
    if (filter === 'all') return todos;
    return todos.filter((t) => (t.status || '').toLowerCase() === filter);
  }, [todos, filter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">Todos</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded border border-slate-300 bg-white px-2 py-1 text-sm text-slate-700"
        >
          <option value="all">All</option>
          <option value="complete">Complete</option>
          <option value="in progress">In progress</option>
          <option value="not started">Not started</option>
        </select>
      </div>

      {loading && <div className="text-slate-500">Loading…</div>}
      {error && <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-3 py-2 font-medium">ID</th>
              <th className="px-3 py-2 font-medium">Task</th>
              <th className="px-3 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((t) => (
              <tr key={t.id} className="border-t border-slate-100">
                <td className="px-3 py-2 text-slate-500">{t.id}</td>
                <td className="px-3 py-2">{t.task}</td>
                <td className="px-3 py-2">
                  <span className="rounded bg-brand-50 px-2 py-0.5 text-brand-700">{t.status}</span>
                </td>
              </tr>
            ))}
            {!loading && !error && visible.length === 0 && (
              <tr>
                <td colSpan={3} className="px-3 py-6 text-center text-slate-500">
                  No items
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
