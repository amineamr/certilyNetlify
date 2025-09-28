"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardCheck, Building, TrendingUp, Activity } from "lucide-react"
import { useUserContext } from "@/context/UserContext"

interface Assessment {
    id: string
    status: string
    created_at: string
    shop_id: string
    answers: Record<string, any>
    shops?: { id: string; airport_id?: string }
}

interface Shop {
    id: string
    airport_id?: string
    name: string
}

interface DashboardStatsProps {
    assessments: Assessment[]
    shops: Shop[]
}

export function DashboardStats({ assessments, shops }: DashboardStatsProps) {
    const userContext = useUserContext()

    let filteredShops = shops
    let filteredAssessments = assessments

    if (userContext) {
        if (userContext.role === "shop_owner") {
            const allowedShops = userContext.userShops.map(String)
            filteredShops = shops.filter((s) => allowedShops.includes(String(s.id)))
            filteredAssessments = assessments.filter((a) => allowedShops.includes(String(a.shop_id)))
        } else if (userContext.role === "airport_manager") {
            const allowedAirports = userContext.userAirports.map(String)

            // filter shops by airport
            filteredShops = shops.filter(
                (s) => s.airport_id && allowedAirports.includes(String(s.airport_id))
            )

            // filter assessments by looking at shops relation OR fallback via shop_id lookup
            filteredAssessments = assessments.filter((a) => {
                const airportId =
                    a.shops?.airport_id ||
                    shops.find((s) => String(s.id) === String(a.shop_id))?.airport_id
                return airportId && allowedAirports.includes(String(airportId))
            })
        }
        // super_user sees everything
    }

    const totalAssessments = filteredAssessments.length
    const completedAssessments = filteredAssessments.filter(
        (a) => a.status === "finished" || a.status === "send"
    ).length
    const totalShops = filteredShops.length
    const recentAssessments = filteredAssessments.filter((a) => {
        const assessmentDate = new Date(a.created_at)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return assessmentDate > weekAgo
    }).length

    const stats = [
        {
            title: "Total Audits",
            value: totalAssessments.toString(),
            change: `${recentAssessments} cette semaine`,
            icon: ClipboardCheck,
        },
        {
            title: "Audits Terminés",
            value: completedAssessments.toString(),
            change: `${Math.round(
                (completedAssessments / Math.max(totalAssessments, 1)) * 100
            )}% du total`,
            icon: Activity,
        },
        {
            title: "Magasins",
            value: totalShops.toString(),
            change: "Magasins enregistrés",
            icon: Building,
        },
        {
            title: "Taux de Completion",
            value: `${Math.round(
                (completedAssessments / Math.max(totalAssessments, 1)) * 100
            )}%`,
            change: "Audits terminés",
            icon: TrendingUp,
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
                        <stat.icon className="h-4 w-4 text-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                        <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
