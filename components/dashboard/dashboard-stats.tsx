"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardCheck, Building, TrendingUp, Activity } from "lucide-react"

interface Assessment {
    id: string
    status: string
    created_at: string
    shop_id: string
}

interface Shop {
    id: string
}

export function DashboardStats({
                                   assessments,
                                   shops,
                               }: {
    assessments: Assessment[]
    shops: Shop[]
}) {
    // -----------------------------
    // Monthly Target Calculation (Unique Shops)
    // -----------------------------
    const TARGET = 64
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const monthlyAssessments = assessments.filter((a) => {
        const date = new Date(a.created_at)
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })

    const uniqueMonthlyShops = new Set(monthlyAssessments.map((a) => a.shop_id))
    const monthlyCount = uniqueMonthlyShops.size
    const auditsProgress = `${monthlyCount} / ${TARGET}`

    let auditsColor = "text-red-500"
    if (monthlyCount >= TARGET) auditsColor = "text-green-500"
    else if (monthlyCount >= TARGET * 0.5) auditsColor = "text-orange-500"

    // Other stats
    const completedAssessments = assessments.filter(
        (a) => a.status === "finished" || a.status === "send"
    ).length
    const totalShops = shops.length

    const stats = [
        {
            title: "Audits du Mois",
            value: auditsProgress,
            change: `Objectif: ${TARGET}`,
            Icon: ClipboardCheck,
            color: auditsColor,
        },
        {
            title: "Audits Terminés",
            value: completedAssessments.toString(),
            change: `${Math.round((completedAssessments / Math.max(assessments.length, 1)) * 100)}% du total`,
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
            value: `${Math.round((completedAssessments / Math.max(assessments.length, 1)) * 100)}%`,
            change: "Audits terminés",
            Icon: TrendingUp,
            color: "text-foreground",
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
