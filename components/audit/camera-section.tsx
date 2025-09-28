"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

interface CameraSectionProps {
  photos: string[] // array of uploaded photo URLs
  setPhotos: (photos: string[]) => void
}

export function CameraSection({ photos, setPhotos }: CameraSectionProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)

  // Resize/compress image to reduce file size (~512 KB)
  const resizeFile = async (
    file: File,
    maxWidth = 1024,
    maxHeight = 1024,
    quality = 0.6
  ): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const reader = new FileReader()

      reader.onload = (e) => {
        if (!e.target?.result) return reject("No file data")
        img.src = e.target.result as string
      }

      img.onload = () => {
        let { width, height } = img
        // maintain aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }

        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        if (!ctx) return reject("Canvas not supported")
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject("Compression failed")
            const resizedFile = new File([blob], file.name, { type: "image/jpeg" })
            resolve(resizedFile)
          },
          "image/jpeg",
          quality
        )
      }

      reader.onerror = (err) => reject(err)
      reader.readAsDataURL(file)
    })
  }

  const handleAddPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return
    setUploading(true)

    const supabase = createClient()
    const newPhotos: string[] = []

    for (const file of Array.from(event.target.files)) {
      try {
        // Resize/compress file before upload
        const compressedFile = await resizeFile(file, 1024, 1024, 0.6)
        const filePath = `photos/${Date.now()}-${compressedFile.name}`

        const { data, error } = await supabase.storage
          .from("audit-photos")
          .upload(filePath, compressedFile, { cacheControl: "3600", upsert: false })

        if (error) {
          console.error(`Upload error for ${file.name}:`, error.message)
          alert(`Erreur lors de l'upload de ${file.name}: ${error.message}`)
          continue
        }

        const { data: urlData } = supabase.storage.from("audit-photos").getPublicUrl(filePath)
        if (urlData.publicUrl) newPhotos.push(urlData.publicUrl)
      } catch (err) {
        console.error("Compression/upload error:", err)
        alert(`Erreur inattendue lors de l'upload de ${file.name}`)
      }
    }

    setPhotos([...photos, ...newPhotos])
    setUploading(false)
  }

  return (
    <div className="space-y-3">
      <Label className="text-foreground font-medium">
        Photos ({photos.length})
      </Label>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        onChange={handleAddPhoto}
        className="hidden"
      />

      {/* Add photo button */}
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? "Téléchargement..." : "Ajouter une photo"}
      </Button>

      {/* Photo previews */}
      {photos.length > 0 && (
        <div className="flex gap-2 overflow-x-auto py-2">
          {photos.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Photo ${idx + 1}`}
              className="w-24 h-24 object-cover rounded-lg border border-border"
            />
          ))}
        </div>
      )}
    </div>
  )
}
