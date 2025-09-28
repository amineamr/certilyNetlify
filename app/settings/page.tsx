// app/settings/page.tsx
import { ServerRoleQueries } from "@/lib/server-role-queries"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function SettingsPage() {
  const context = await ServerRoleQueries.getUserContext()

  if (!context) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-4 text-gray-600">You need to log in to view settings.</p>
      </div>
    )
  }

  const { user, role } = context

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-6">
        {/* Back link */}
        <div className="flex items-center space-x-2">
            <Link href="/dashboard" className="flex items-center text-sm text-primary hover:underline">
                <ArrowLeft className="w-4 h-4 mr-4" />
                Retour au dashboard
            </Link>
        </div>
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* Account Settings */}
      <div className="rounded-2xl shadow p-6 bg-white space-y-4">
        <h2 className="text-xl font-semibold">Account</h2>
        <p><span className="font-medium">Email:</span> {user.email}</p>
        <p><span className="font-medium">Role:</span> {role}</p>
      </div>

      {/* Preferences */}
      <div className="rounded-2xl shadow p-6 bg-white space-y-4">
        <h2 className="text-xl font-semibold">Preferences</h2>
        <form className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-medium">Dark Mode</label>
            <input type="checkbox" className="w-5 h-5 accent-blue-600" disabled />
          </div>
          <div className="flex items-center justify-between">
            <label className="font-medium">Email Notifications</label>
            <input type="checkbox" className="w-5 h-5 accent-blue-600" disabled />
          </div>
        </form>
        <p className="text-sm text-gray-500">
          (Coming soon: Customize your preferences)
        </p>
      </div>

      {/* Role-based Settings */}
      {role === "super_user" && (
        <div className="rounded-2xl shadow p-6 bg-white space-y-2">
          <h2 className="text-xl font-semibold">Super User Controls</h2>
          <p className="text-gray-600">Manage global platform settings here.</p>
        </div>
      )}

      {role === "airport_manager" && (
        <div className="rounded-2xl shadow p-6 bg-white space-y-2">
          <h2 className="text-xl font-semibold">Airport Manager Settings</h2>
          <p className="text-gray-600">Settings related to managed airports will appear here.</p>
        </div>
      )}

      {role === "shop_owner" && (
        <div className="rounded-2xl shadow p-6 bg-white space-y-2">
          <h2 className="text-xl font-semibold">Shop Owner Settings</h2>
          <p className="text-gray-600">Settings related to your shops will appear here.</p>
        </div>
      )}
    </div>
  )
}
