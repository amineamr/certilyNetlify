// app/audit/page.tsx
import { redirect } from "next/navigation"
import { ServerRoleQueries } from "@/lib/server-role-queries"
import { AuditClient } from "./audit-client"

export default async function AuditPage() {
  // Get the current user context
  const context = await ServerRoleQueries.getUserContext()

  if (!context) {
    // Not authenticated, redirect to login
    redirect("/login")
  }

  // Fetch shops accessible by the user
  const { data: shops, error: shopsError } = await ServerRoleQueries.getShops()

  if (shopsError) {
    console.error("Error fetching shops:", shopsError)
    // Optionally, you can throw or redirect to an error page
  }

  return <AuditClient shops={shops || []} userRole={context.role} />
}
