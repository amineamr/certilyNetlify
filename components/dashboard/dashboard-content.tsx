"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClipboardCheck, Building, Calendar, MessageSquare, ExternalLink, Users, Shield, Plane } from "lucide-react"
import { ratingEmojis } from "@/lib/audit-questions"
import Link from "next/link"
import { ClientRoleQueries } from "@/lib/client-role-queries"

interface Assessment {
    id: string
    status: string
    created_at: string
    answers: Record<string, any>
    comments?: string
    shops?: {
        name?: string
        brand?: string
        location?: string
        airports?: { name?: string; location?: string }
    }
}

interface UserContext {
    role: "super_user" | "airport_manager" | "shop_owner"
    userShops: string[]
    userAirports: string[]
}

export function DashboardContent({ serverContext }: { serverContext?: UserContext }) {
    const [assessments, setAssessments] = useState<Assessment[]>([])
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

                const result = await ClientRoleQueries.getAssessments(context)
                console.log("Assessments result:", result)
                if (!result || result.error) {
                    setError(result?.error || "Impossible de récupérer les audits")
                    return
                }

                setAssessments(result.data || [])
            } catch (err) {
                console.error(err)
                setError("Une erreur est survenue")
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [serverContext])

    const getStatusIcon = (status?: string) => {
        switch (status) {
            case "finished": return <ClipboardCheck className="h-4 w-4 text-green-500" />
            case "send": return <ClipboardCheck className="h-4 w-4 text-yellow-500" />
            case "open": return <Calendar className="h-4 w-4 text-yellow-500" />
            case "reported": return <Calendar className="h-4 w-4 text-red-500" />
            default: return <Calendar className="h-4 w-4 text-gray-500" />
        }
    }

    const calculateAverageRating = (answers?: Record<string, any>) => {
        if (!answers) return null
        const ratings = Object.values(answers).filter((v) => typeof v === "number" && v >= 1 && v <= 4)
        if (!ratings.length) return null
        return (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Chargement du tableau de bord...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="bg-red-100 dark:bg-red-900/20 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto">
                        <ClipboardCheck className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-foreground">Erreur</h3>
                    <p className="text-muted-foreground mt-2">{error}</p>
                    <Button onClick={() => window.location.reload()} className="mt-4">Réessayer</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Render assessments safely with optional chaining */}
            {assessments.map((a) => (
                <Card key={a.id} className="bg-card border-border hover:shadow-md transition-shadow">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Building className="h-5 w-5 text-accent" />
                                <CardTitle>{a.shops?.name || "Magasin inconnu"}</CardTitle>
                            </div>
                            <div className="flex items-center space-x-2">
                                {getStatusIcon(a.status)}
                                <Badge variant="outline">{a.status ? a.status : "Inconnu"}</Badge>
                            </div>
                        </div>
                        <CardDescription className="text-muted-foreground">
                            {a.shops?.brand} • {a.shops?.location} {a.shops?.airports?.name && `• ${a.shops.airports.name}`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between">
                            <span>Note moyenne: {calculateAverageRating(a.answers) || "N/A"}</span>
                            <span>{new Date(a.created_at).toLocaleDateString("fr-FR")}</span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
