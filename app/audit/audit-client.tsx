"use client"
import { useEffect,useState } from "react"
import { ShopSelector } from "@/components/audit/shop-selector"
import { AssessmentForm } from "@/components/audit/assessment-form"

export interface Shop {
    id: string
    name: string
    brand: string
    location: string
    contact_email: string
}

interface AuditClientProps {
    initialShop?: Shop
    shops?: Shop[]
    assessments?: Assessment[]
}

export function AuditClient({ initialShop, shops, assessments = [] }: AuditClientProps) {
    const [selectedShop, setSelectedShop] = useState<Shop | null>(initialShop || null)

    if (!selectedShop) {
        return (
            <div className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <ShopSelector shops={shops} assessments={assessments} />
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
