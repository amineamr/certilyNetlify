"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { CameraSection } from "@/components/audit/camera-section"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

// Minimal CommentSection component
function CommentSection({ comment, setComment }: { comment: string; setComment: (c: string) => void }) {
    return (
        <div className="space-y-1">
            <Label>Commentaire</Label>
            <textarea
                className="w-full border rounded p-2"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Écrivez un commentaire..."
            />
        </div>
    )
}

interface DashboardWorkerProps {
    shops: { id: string; name: string }[]
}

export function DashboardWorker({ shops }: DashboardWorkerProps) {
    const [selectedShop, setSelectedShop] = useState<string | null>(null)
    const [comment, setComment] = useState("")
    const [photos, setPhotos] = useState<string[]>([])
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (!selectedShop) return alert("Veuillez sélectionner un magasin.")
        setSubmitting(true)

        try {
            const supabase = createClient()
            const { error } = await supabase.from("litige").insert([
                {
                    shop_id: selectedShop,
                    comment,
                    photos,
                    created_at: new Date().toISOString(),
                },
            ])

            if (error) {
                console.error(error)
                alert("Erreur lors de la soumission")
            } else {
                alert("Litige soumis avec succès")
                setComment("")
                setPhotos([])
                setSelectedShop(null)
            }
        } catch (err) {
            console.error(err)
            alert("Erreur inattendue")
        }

        setSubmitting(false)
    }

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6 bg-white rounded-lg shadow">
            {/* Shop Selector */}
            <div>
                <Label>Magasin</Label>
                <Select value={selectedShop ?? "none"} onValueChange={(val) => setSelectedShop(val === "none" ? null : val)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un magasin" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">-- Sélectionner --</SelectItem>
                        {shops.map((shop) => (
                            <SelectItem key={shop.id} value={shop.id}>
                                {shop.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Comment Section */}
            <CommentSection comment={comment} setComment={setComment} />

            {/* Camera Section */}
            <CameraSection photos={photos} setPhotos={setPhotos} />

            {/* Submit button */}
            <Button type="button" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Envoi..." : "Soumettre"}
            </Button>
        </div>
    )
}
