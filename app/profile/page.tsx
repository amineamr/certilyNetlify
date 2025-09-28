// app/profile/page.tsx
import { ServerRoleQueries } from "@/lib/server-role-queries"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function ProfilePage() {
  const context = await ServerRoleQueries.getUserContext()

  if (!context) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="mt-4 text-gray-600">You are not logged in.</p>
      </div>
    )
  }

  const { user, role, userShops, userAirports } = context

  return (
    
    <div className="max-w-7xl mx-auto p-8 space-y-6">
        {/* Back link */}
        <div className="flex items-center space-x-2">
            <Link href="/dashboard" className="flex items-center text-sm text-primary hover:underline">
                <ArrowLeft className="w-4 h-4 mr-4" />
                Retour au dashboard
            </Link>
        </div>
      <h1 className="text-3xl font-bold">Profile</h1>

      <div className="rounded-2xl shadow p-6 bg-white space-y-4">
        <h2 className="text-xl font-semibold">User Info</h2>
        <p><span className="font-medium">Email:</span> {user.email}</p>
        <p><span className="font-medium">Role:</span> {role}</p>
      </div>

      {role === "shop_owner" && (
        <div className="rounded-2xl shadow p-6 bg-white space-y-2">
          <h2 className="text-xl font-semibold">My Shops</h2>
          {userShops.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700">
              {userShops.map((id) => (
                <li key={id}>{id}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No shops assigned.</p>
          )}
        </div>
      )}

      {role === "airport_manager" && (
        <div className="rounded-2xl shadow p-6 bg-white space-y-2">
          <h2 className="text-xl font-semibold">Managed Airports</h2>
          {userAirports.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700">
              {userAirports.map((id) => (
                <li key={id}>{id}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No airports assigned.</p>
          )}
        </div>
      )}

      {role === "super_user" && (
        <div className="rounded-2xl shadow p-6 bg-white">
          <h2 className="text-xl font-semibold">Super User Access</h2>
          <p className="text-gray-600">You can manage all shops and airports.</p>
        </div>
      )}
    </div>
  )
}
