// app/dashboard/page.tsx
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { ServerRoleQueries } from "@/lib/server-role-queries" // 🔑 server-safe queries

export default async function DashboardPage() {
    // ✅ fetch user context securely on the server
    const context = await ServerRoleQueries.getUserContext()
    if (!context) redirect("/login")

    // ✅ fetch data with context
    const { data: assessments } = await ServerRoleQueries.getAssessments(context)
    const { data: shops } = await ServerRoleQueries.getShops(context)

    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <DashboardStats assessments={assessments || []} shops={shops || []} />
                <DashboardContent assessments={assessments || []} />
            </main>
        </div>
    )
}
