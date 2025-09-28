import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ServerRoleQueries } from "@/lib/server-role-queries";
import { redirect } from "next/navigation";
import { DashboardPageClient } from "./dashboard-page-client";
import { DashboardWorker } from "@/components/dashboard/dashboard-worker";
import { DashboardOwner } from "@/components/dashboard/dashboard-owner";

export default async function DashboardPage() {
    // Get user context (role for UI)
    const context = await ServerRoleQueries.getUserContext();
    if (!context) redirect("/login");

    // Fetch shops & assessments (RLS applies automatically in backend)
    const { data: assessments } = await ServerRoleQueries.getAssessments();
    const { data: shops } = await ServerRoleQueries.getShops();

    const role = context.role;

    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader />

            {role === "super_user" || role === "airport_manager" ? (
                <DashboardPageClient
                    initialAssessments={assessments || []}
                    initialShops={shops || []}
                    userContext={context}
                />
            ) : role === "airport_worker" ? (
                <DashboardWorker userContext={context} shops={shops || []} />
            ) : role === "shop_owner" ? (
                <DashboardOwner userContext={context} shops={shops || []} assessments={assessments || []} />
            ) : (
                <div className="p-6 text-center text-gray-600">
                    <p>Role not recognized. Please contact an administrator.</p>
                </div>
            )}
        </div>
    );
}
