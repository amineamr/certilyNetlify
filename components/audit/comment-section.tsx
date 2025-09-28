"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface CommentSectionProps {
  comments: string
  setComments: (comments: string) => void
  placeholder?: string
}

export function CommentSection({
  comments,
  setComments,
  placeholder = "Ajoutez vos commentaires ici...",
}: CommentSectionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="comments" className="text-foreground font-medium">
        Commentaires additionnels
      </Label>
      <Textarea
        id="comments"
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        placeholder={placeholder}
        className="min-h-[100px] bg-background border-border text-foreground placeholder:text-muted-foreground"
        rows={4}
      />
    </div>
  )
}
