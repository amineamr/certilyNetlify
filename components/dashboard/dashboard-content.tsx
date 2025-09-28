"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ClipboardCheck, Calendar, Building } from "lucide-react"

export function DashboardContent({ assessments }: { assessments: any[] }) {
    if (!assessments.length) return <p>Aucun assessment à afficher</p>

    const getStatusIcon = (status?: string) => {
        switch (status) {
            case "finished":
                return <ClipboardCheck className="h-4 w-4 text-green-500" />
            case "send":
            case "open":
                return <Calendar className="h-4 w-4 text-yellow-500" />
            case "reported":
                return <Calendar className="h-4 w-4 text-red-500" />
            default:
                return <Calendar className="h-4 w-4 text-gray-500" />
        }
    }

    const calculateAverageRating = (answers?: Record<string, any>) => {
        if (!answers) return null
        const ratings = Object.values(answers).filter((v) => typeof v === "number" && v >= 1 && v <= 4)
        if (!ratings.length) return null
        return (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)
    }

    return (
        <div className="space-y-6">
            {assessments.map((a) => {
                const shop = a.shop // already attached

                return (
                    <Card key={a.id} className="bg-card border-border hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Building className="h-5 w-5 text-accent" />
                                    <CardTitle>{shop?.name || "Magasin inconnu"}</CardTitle>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {getStatusIcon(a.status)}
                                    <Badge variant="outline">{a.status || "Inconnu"}</Badge>
                                </div>
                            </div>
                            <CardDescription className="text-muted-foreground">
                                {shop?.brand} • {shop?.location} {shop?.airports?.name && `• ${shop.airports.name}`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between">
                                <span>Note moyenne: {calculateAverageRating(a.answers) || "N/A"}</span>
                                <span>{new Date(a.created_at).toLocaleDateString("fr-FR")}</span>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
