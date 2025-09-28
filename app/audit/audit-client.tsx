"use client"

import { useState } from "react"
import { ShopSelector } from "@/components/audit/shop-selector"
import { AssessmentForm } from "@/components/audit/assessment-form"

interface Shop {
  id: string
  name: string
  brand: string
  location: string
  contact_email: string
}

interface AuditClientProps {
  shops: Shop[]
}

export function AuditClient({ shops }: AuditClientProps) {
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null)

  if (!selectedShop) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ShopSelector shops={shops} onSelectShop={setSelectedShop} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AssessmentForm shop={selectedShop} onBack={() => setSelectedShop(null)} />
      </div>
    </div>
  )
}
