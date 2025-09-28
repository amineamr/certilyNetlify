// app/audit/[shopId]/page.tsx
import { redirect } from "next/navigation"
import { ServerRoleQueries } from "@/lib/server-role-queries"
import { AuditClient } from "../audit-client"

interface PageProps {
    params: { shopId: string }
}

export default async function AuditPage({ params }: PageProps) {
    const context = await ServerRoleQueries.getUserContext()
    if (!context) redirect("/login")

    const { data: shops, error } = await ServerRoleQueries.getShops()
    if (error) console.error(error)

    const shop = shops?.find((s) => s.id === params.shopId)
    if (!shop) redirect("/audit") // fallback if invalid shopId

    return <AuditClient initialShop={shop} shops={shops || []} />
}
