// app/audit/page.tsx
import { redirect } from "next/navigation"
import { ServerRoleQueries } from "@/lib/server-role-queries"
import { AuditClient } from "./audit-client"

export default async function AuditIndexPage() {
    const context = await ServerRoleQueries.getUserContext()
    if (!context) redirect("/login")

    const { data: shops, error } = await ServerRoleQueries.getShops()
    if (error) console.error("Error fetching shops:", error)

    return <AuditClient shops={shops || []} />
}
