"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QuestionButton } from "./question-button"
import { CommentSection } from "./comment-section"
import { CameraSection } from "./camera-section"
import { auditQuestions } from "@/lib/audit-questions"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Send, Save } from "lucide-react"
import Link from "next/link"

interface Shop {
    id: string
    name: string
    brand: string
    location: string
    contact_email: string
}

interface AssessmentFormProps {
    shop: Shop
    onBack: () => void
}

export function AssessmentForm({ shop, onBack }: AssessmentFormProps) {
    const [answers, setAnswers] = useState<Record<string, any>>({})
    const [comments, setComments] = useState("")
    const [photos, setPhotos] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const allQuestionsAnswered = () =>
        auditQuestions.every((category) =>
            category.questions.every((q) => answers[q.text] !== undefined)
        )

    const submitAssessment = async (status: "finished" | "send") => {
        if (!allQuestionsAnswered()) {
            toast({
                title: "Audit incomplet",
                description: "Merci de répondre à toutes les questions avant de soumettre.",
                variant: "destructive",
            })
            return
        }

        setIsSubmitting(true)

        try {
            const supabase = createClient()

            // Format answers for storage
            const formattedAnswers: Record<string, any> = {}
            auditQuestions.forEach((category) => {
                category.questions.forEach((q) => {
                    formattedAnswers[q.text] = q.type === "yesno" ? (answers[q.text] ? "Oui" : "Non") : answers[q.text]
                })
            })

            // Insert into Supabase
            const { error } = await supabase.from("assessments").insert([
                {
                    shop_id: shop.id,
                    answers: formattedAnswers,
                    comments,
                    photo_urls: photos,
                    status,
                },
            ])

            if (error) throw error

            toast({
                title: "Succès",
                description: `Audit ${status === "finished" ? "terminé" : "envoyé"} avec succès !`,
            })

            // Reset form and go back
            setAnswers({})
            setComments("")
            setPhotos([])
            router.push("/dashboard")
        } catch (err) {
            console.error("Error submitting assessment:", err)
            toast({
                title: "Erreur lors de l'envoi",
                description: "Une erreur est survenue lors de l'envoi de l'audit.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-2">
                <Link href="/audit" className="flex items-center text-sm text-primary hover:underline">
                    <ArrowLeft className="w-4 h-4 mr-4" />
                    Retour
                </Link>
            </div>

            <div className="flex items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Audit : {shop.name}</h1>
                    <p className="text-muted-foreground">
                        {shop.brand} - {shop.location}
                    </p>
                </div>
            </div>

            {/* Questions */}
            {auditQuestions.map((category, i) => (
                <Card key={i} className="border-border bg-card">
                    <CardHeader>
                        <CardTitle className="text-primary">{category.category}</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Évaluez les aspects suivants
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {category.questions.map((questionData, j) => (
                            <div key={j} className="space-y-2">
                                {/* Question text left-aligned */}
                                <p
                                    className={`font-medium ${
                                        answers[questionData.text] === undefined
                                            ? "text-destructive border-l-2 border-destructive pl-3"
                                            : "text-foreground"
                                    }`}
                                >
                                    {questionData.text}
                                </p>

                                {/* Answer buttons centered */}
                                <div className="flex justify-center">
                                    <QuestionButton
                                        question={questionData.text}
                                        type={questionData.type}
                                        answers={answers}
                                        setAnswers={setAnswers}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            ))}

            {/* Camera Section */}
            <Card className="border-border bg-card">
                <CardHeader>
                    <CardTitle className="text-foreground">Photos</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Ajoutez des photos pour documenter l’audit
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CameraSection photos={photos} setPhotos={setPhotos} />
                </CardContent>
            </Card>

            {/* Comments Section */}
            <Card className="border-border bg-card">
                <CardHeader>
                    <CardTitle className="text-foreground">Commentaires</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Ajoutez des observations supplémentaires
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CommentSection
                        comments={comments}
                        setComments={setComments}
                        placeholder="Ajoutez vos commentaires ici..."
                    />
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
                <Button
                    onClick={() => submitAssessment("finished")}
                    disabled={!allQuestionsAnswered() || isSubmitting}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Envoi..." : "Soumettre l'audit"}
                </Button>

                <Button
                    onClick={() => submitAssessment("send")}
                    disabled={!allQuestionsAnswered() || isSubmitting}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                >
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Envoi..." : "Soumettre et Envoyer"}
                </Button>
            </div>
        </div>
    )
}
