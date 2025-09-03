export function Settings() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-medium text-slate-800">Settings</h2>
        <ul className="mt-2 list-disc pl-6 text-slate-600">
          <li id="users">Manage users</li>
          <li id="billing">Billing preferences</li>
        </ul>
      </div>
    </div>
  );
}
