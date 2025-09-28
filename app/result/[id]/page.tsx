// app/audit/[id]/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Building, Calendar, ClipboardCheck } from "lucide-react"
import { CameraSection } from "@/components/audit/camera-section"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface AuditPageProps {
    params: { id: string }
}

interface Assessment {
    id: string
    shop: {
        id: string
        name: string
        brand: string
        location: string
        airports?: { name: string }
    }
    answers: Record<string, any>
    comments: string | null
    photo_urls: string[] | null
    status: string
    created_at: string
}

export default function AuditPage({ params }: AuditPageProps) {
    const router = useRouter()
    const [assessment, setAssessment] = useState<Assessment | null>(null)
    const [loading, setLoading] = useState(true)
    const [photos, setPhotos] = useState<string[]>([])

    useEffect(() => {
        const fetchAssessment = async () => {
            setLoading(true)
            try {
                const supabase = createClient()
                const { data, error } = await supabase
                    .from("assessments")
                    .select("*, shop:shop_id(*)")
                    .eq("id", params.id)
                    .single()

                if (error || !data) {
                    console.error(error)
                    router.push("/404")
                    return
                }

                setAssessment(data)
                setPhotos(data.photo_urls || [])
            } catch (err) {
                console.error(err)
                router.push("/404")
            } finally {
                setLoading(false)
            }
        }

        fetchAssessment()
    }, [params.id, router])

    if (loading) return <p className="text-center p-6">Chargement...</p>
    if (!assessment) return null

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

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            {/* Back link */}
            <div className="flex items-center space-x-2">
                <Link href="/dashboard" className="flex items-center text-sm text-primary hover:underline">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Retour
                </Link>
            </div>
            {/* Shop Info */}
            <Card className="bg-card border-border shadow-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Building className="h-5 w-5 text-accent" />
                            <CardTitle>{assessment.shop?.name || "Magasin inconnu"}</CardTitle>
                        </div>
                        <Badge variant="outline">{assessment.status || "Inconnu"}</Badge>
                    </div>
                    <CardDescription className="text-muted-foreground">
                        {assessment.shop?.brand} • {assessment.shop?.location}{" "}
                        {assessment.shop?.airports?.name && `• ${assessment.shop.airports.name}`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground">
                        Créé le: {new Date(assessment.created_at).toLocaleDateString("fr-FR")}
                    </div>
                </CardContent>
            </Card>

            {/* Answers */}
            <Card className="bg-card border-border shadow-sm">
                <CardHeader>
                    <CardTitle>Réponses à l’audit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {Object.entries(assessment.answers).map(([question, answer]) => (
                        <div
                            key={question}
                            className="flex justify-between border-b border-border py-2 last:border-b-0"
                        >
                            <span>{question}</span>
                            <span className="font-semibold">{answer}</span>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Comments */}
            {assessment.comments && (
                <Card className="bg-card border-border shadow-sm">
                    <CardHeader>
                        <CardTitle>Commentaires</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">{assessment.comments}</p>
                    </CardContent>
                </Card>
            )}

            {/* Photos */}
            {photos.length > 0 && (
                <Card className="bg-card border-border shadow-sm">
                    <CardHeader>
                        <CardTitle>Photos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CameraSection photos={photos} setPhotos={setPhotos} />
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
