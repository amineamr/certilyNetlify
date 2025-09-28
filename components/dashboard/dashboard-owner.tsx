"use client"

import { DashboardContent } from "@/components/dashboard/dashboard-content"

export function DashboardOwner({ assessments }: { assessments: any[] }) {
    return (
        <div className="max-w-5xl mx-auto p-6">
            <h2 className="text-xl font-bold mb-4">My Assessments</h2>
            <DashboardContent assessments={assessments} />
        </div>
    )
}
