"use client"

import { DashboardContent } from "@/components/dashboard/dashboard-content"

export function DashboardOwner({ assessments, shops }: { assessments: any[], shops: any[] }) {
    // Map shop_id to shop object
    const shopMap = new Map(shops.map((s) => [s.id, s]))
    const assessmentsWithShops = assessments.map((a) => ({
        ...a,
        shop: shopMap.get(a.shop_id) || null,
    }))

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h2 className="text-xl font-bold mb-4">Tous les audits</h2>
            <DashboardContent assessments={assessmentsWithShops} />
        </div>
    )
}
