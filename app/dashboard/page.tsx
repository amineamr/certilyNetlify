import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ServerRoleQueries } from "@/lib/server-role-queries";
import { redirect } from "next/navigation";
import { DashboardPageClient } from "./dashboard-page-client";

export default async function DashboardPage() {
    // Get user context (role for UI)
    const context = await ServerRoleQueries.getUserContext();
    if (!context) redirect("/login");

    // Get shops & assessments (RLS automatically filters)
    const { data: assessments } = await ServerRoleQueries.getAssessments();
    const { data: shops } = await ServerRoleQueries.getShops();

    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader />
            <DashboardPageClient
                initialAssessments={assessments || []}
                initialShops={shops || []}
                userContext={context}
            />
        </div>
    );
}
