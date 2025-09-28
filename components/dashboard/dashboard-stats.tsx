"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardCheck, Building, TrendingUp, Activity } from "lucide-react"
import { ClientRoleQueries } from "@/lib/client-role-queries"

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

interface UserContext {
    role: "super_user" | "airport_manager" | "shop_owner"
    userShops: string[]
    userAirports: string[]
}

export function DashboardStats({ serverContext }: { serverContext?: UserContext }) {
    const [assessments, setAssessments] = useState<Assessment[]>([])
    const [shops, setShops] = useState<Shop[]>([])
    const [userContext, setUserContext] = useState<UserContext | null>(serverContext || null)
    const [loading, setLoading] = useState(!serverContext)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (serverContext) return // already have context from server

        const loadData = async () => {
            try {
                setLoading(true)

                const context = await ClientRoleQueries.getUserContext()
                if (!context) {
                    setError("Utilisateur non authentifié")
                    return
                }
                setUserContext(context)

                const [assessmentsResult, shopsResult] = await Promise.all([
                    ClientRoleQueries.getAssessments(context),
                    ClientRoleQueries.getShops(context),
                ])

                if (!assessmentsResult || assessmentsResult.error) {
                    setError(assessmentsResult?.error || "Impossible de récupérer les audits")
                    return
                }
                if (!shopsResult || shopsResult.error) {
                    setError(shopsResult?.error || "Impossible de récupérer les magasins")
                    return
                }

                setAssessments(assessmentsResult.data || [])
                setShops(shopsResult.data || [])
            } catch (err) {
                console.error(err)
                setError("Une erreur est survenue")
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [serverContext])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Chargement des statistiques...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <p className="text-red-500">{error}</p>
            </div>
        )
    }

    // -----------------------------
    // Monthly Target Calculation (Unique Shops)
    // -----------------------------
    const TARGET = 64
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    // get audits for current month
    const monthlyAssessments = assessments.filter((a) => {
        const date = new Date(a.created_at)
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })

    // deduplicate by shop_id (only count one audit per shop)
    const uniqueMonthlyShops = new Set(monthlyAssessments.map((a) => a.shop_id))
    const monthlyCount = uniqueMonthlyShops.size

    const auditsProgress = `${monthlyCount} / ${TARGET}`

    let auditsColor = "text-red-500"
    if (monthlyCount >= TARGET) {
        auditsColor = "text-green-500"
    } else if (monthlyCount >= TARGET * 0.5) {
        auditsColor = "text-orange-500"
    }

    // -----------------------------
    // Other Stats
    // -----------------------------
    const completedAssessments = assessments.filter(
        (a) => a.status === "finished" || a.status === "send"
    ).length

    const totalShops = shops.length

    const stats: {
        title: string
        value: string
        change: string
        Icon: any
        color: string
    }[] = [
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

    // -----------------------------
    // Render
    // -----------------------------
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
