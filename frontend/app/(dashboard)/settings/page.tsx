export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
        <p className="text-slate-600">Manage billing, integrations, and workspace preferences.</p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Profile</h2>
        <p className="mt-2 text-sm text-slate-600">
          Connect your Clerk account to manage authentication and update personal information.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Billing</h2>
        <p className="mt-2 text-sm text-slate-600">
          Stripe integration coming soon. Subscribe to access advanced analytics and automations.
        </p>
      </div>
    </div>
  )
}
