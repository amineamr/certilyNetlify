// app/audit/page.tsx
import { redirect } from "next/navigation"
import { ServerRoleQueries } from "@/lib/server-role-queries"
import { AuditClient } from "./audit-client"

export default async function AuditIndexPage() {
    const context = await ServerRoleQueries.getUserContext()
    if (!context) redirect("/login")

    // Fetch shops
    const { data: shops, error: shopsError } = await ServerRoleQueries.getShops()
    if (shopsError) console.error("Error fetching shops:", shopsError)

    // Fetch assessments
    const { data: assessments, error: assessmentsError } =
        await ServerRoleQueries.getAssessments()
    if (assessmentsError) console.error("Error fetching assessments:", assessmentsError)

    return <AuditClient shops={shops || []} assessments={assessments || []} />
}
