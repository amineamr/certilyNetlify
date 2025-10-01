"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, TrendingUp, Activity } from "lucide-react"

interface Assessment {
    id: string
    status: string
    created_at: string
    shop_id: string
}

interface Shop {
    id: string
    is_monthly?: boolean   // 👈 flag mensuel sur la table shops
}

export function DashboardStats({
                                   assessments,
                                   shops,
                               }: {
    assessments: Assessment[]
    shops: Shop[]
}) {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    // ✅ Objectif = nombre total de shops avec is_monthly = true
    const monthlyShops = shops.filter((s) => s.is_monthly)
    const TARGET = monthlyShops.length

    // ✅ Audits réalisés ce mois-ci pour ces shops
    const monthlyAssessments = assessments.filter((a) => {
        const date = new Date(a.created_at)
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })

    // 👇 On ne garde que les shops qui sont dans monthlyShops
    const monthlyShopIds = new Set(monthlyShops.map((s) => s.id))
    const auditedMonthlyShops = new Set(
        monthlyAssessments
            .filter((a) => monthlyShopIds.has(a.shop_id))
            .map((a) => a.shop_id)
    )

    const monthlyCount = auditedMonthlyShops.size

    // Couleurs de progression
    let auditsColor = "text-red-500"
    if (monthlyCount >= TARGET) auditsColor = "text-green-500"
    else if (monthlyCount >= TARGET * 0.3) auditsColor = "text-orange-500"

    // -----------------------------
    // Autres stats
    // -----------------------------
    const completedAssessments = assessments.filter(
        (a) => a.status === "finished" || a.status === "send"
    ).length
    const totalShops = shops.length

    const stats = [
        {
            title: "Audits Terminés",
            value: completedAssessments.toString(),
            change: `${Math.round(
                (completedAssessments / Math.max(assessments.length, 1)) * 100
            )}% du total`,
            Icon: Activity,
            color: "text-foreground",
        },
        {
            title: "Magasins",
            value: totalShops.toString(),
            change: "Magasins enregistrés",
            Icon: Building,
            color: "text-foreground",
        },
        {
            title: "Taux de Completion",
            value: `${Math.round(
                (completedAssessments / Math.max(assessments.length, 1)) * 100
            )}%`,
            change: "Audits terminés",
            Icon: TrendingUp,
            color: "text-foreground",
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Progress card Audits du Mois */}
            <Card className="p-8 bg-card border-border">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Audits du Mois</span>
                        <span className={`text-sm font-medium ${auditsColor}`}>
              {TARGET > 0
                  ? Math.round(Math.min((monthlyCount / TARGET) * 100, 100))
                  : 0}
                            %
            </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                            className="h-full bg-accent rounded-full"
                            style={{
                                width: `${TARGET > 0 ? Math.min((monthlyCount / TARGET) * 100, 100) : 0}%`,
                            }}
                        ></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <div>
                            <div className="text-2xl font-bold text-foreground">
                                {monthlyCount}
                            </div>
                            <div className="text-sm text-muted-foreground">Réalisé</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-foreground">
                                {Math.max(TARGET - monthlyCount, 0)}
                            </div>
                            <div className="text-sm text-muted-foreground">Restant</div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Autres stats */}
            {stats.map((stat, index) => (
                <Card key={index} className="bg-card border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                        </CardTitle>
                        {stat.Icon && <stat.Icon className={`h-4 w-4 ${stat.color}`} />}
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                        <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
