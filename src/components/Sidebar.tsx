import { NavLink } from 'react-router-dom';

type Item = { label: string; to?: string; children?: Item[] };

const items: Item[] = [
  { label: 'Overview', to: '/' },
  {
    label: 'Analytics',
    children: [
      { label: 'Reports', to: '/reports' },
      { label: 'Sales', to: '/reports/sales' },
      { label: 'Traffic', to: '/reports/traffic' },
    ],
  },
  {
    label: 'Management',
    children: [
      { label: 'Users', to: '/settings#users' },
      { label: 'Billing', to: '/settings#billing' },
    ],
  },
];

function Node({ node, depth = 0 }: { node: Item; depth?: number }) {
  const padding = 8 + depth * 16;
  const base = 'flex items-center rounded px-2 py-1 text-sm';
  if (node.to) {
    return (
      <NavLink
        to={node.to}
        className={({ isActive }) =>
          `${base}` +
          ` ml-2` +
          ` ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:text-slate-900'}`
        }
        style={{ paddingLeft: padding }}
      >
        <span className="truncate">{node.label}</span>
      </NavLink>
    );
  }
  return (
    <div style={{ paddingLeft: padding }} className="ml-2 select-none text-xs uppercase tracking-wide text-slate-500">
      {node.label}
      {node.children && (
        <div className="mt-1 space-y-1">
          {node.children.map((c) => (
            <Node key={c.label} node={c} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  return (
    <nav className="px-2 pb-4">
      <div className="space-y-2">
        {items.map((i) => (
          <Node key={i.label} node={i} />
        ))}
      </div>
    </nav>
  );
}
