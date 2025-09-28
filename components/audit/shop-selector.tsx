"use client"

import { useState, useMemo } from "react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Shop {
    id: string
    name: string
    brand: string
    location: string
    contact_email: string
}

interface ShopSelectorProps {
    shops: Shop[]
    onSelectShop: (shop: Shop) => void
}

export function ShopSelector({ shops, onSelectShop }: ShopSelectorProps) {
    const [activeFilters, setActiveFilters] = useState<{ location: string | null; brand: string | null }>({
        location: null,
        brand: null,
    })

    // Filter shops based on active filters
    const filteredShops = useMemo(() => {
        return shops.filter((shop) => {
            return (
                (!activeFilters.location || shop.location === activeFilters.location) &&
                (!activeFilters.brand || shop.brand === activeFilters.brand)
            )
        })
    }, [shops, activeFilters])

    // Compute available locations and brands based on filtered shops
    const availableLocations = useMemo(() => {
        const locs = filteredShops.map((s) => s.location)
        return Array.from(new Set(locs))
    }, [filteredShops])

    const availableBrands = useMemo(() => {
        const brands = filteredShops.map((s) => s.brand)
        return Array.from(new Set(brands))
    }, [filteredShops])

    return (
        <div className="space-y-6">
            {/* Back link */}
            <div className="flex items-center space-x-2">
                <Link href="/dashboard" className="flex items-center text-sm text-primary hover:underline">
                    <ArrowLeft className="w-4 h-4 mr-4" />
                    Retour au dashboard
                </Link>
            </div>

            {/* Page title */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-2">Sélectionner un magasin</h2>
            </div>

            {/* Filters on the same line */}
            <div className="flex flex-wrap gap-4">
                {/* Location Filter */}
                <div className="flex-1 min-w-[150px]">
                    <label className="text-sm font-medium mb-1 block">Lieu</label>
                    <Select
                        value={activeFilters.location ?? "all"}
                        onValueChange={(val) =>
                            setActiveFilters((prev) => ({ ...prev, location: val === "all" ? null : val }))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un lieu" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous</SelectItem>
                            {availableLocations.map((loc) => (
                                <SelectItem key={loc} value={loc}>
                                    {loc}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Brand Filter */}
                <div className="flex-1 min-w-[150px]">
                    <label className="text-sm font-medium mb-1 block">Marque</label>
                    <Select
                        value={activeFilters.brand ?? "all"}
                        onValueChange={(val) =>
                            setActiveFilters((prev) => ({ ...prev, brand: val === "all" ? null : val }))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une marque" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toutes</SelectItem>
                            {availableBrands.map((brand) => (
                                <SelectItem key={brand} value={brand}>
                                    {brand}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Active Filters Badges */}
            <div className="flex flex-wrap gap-2">
                {activeFilters.location && (
                    <span
                        className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full cursor-pointer hover:bg-blue-200 transition"
                        onClick={() => setActiveFilters((prev) => ({ ...prev, location: null }))}
                    >
            {activeFilters.location}
                        <span className="font-bold">&times;</span>
          </span>
                )}
                {activeFilters.brand && (
                    <span
                        className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full cursor-pointer hover:bg-green-200 transition"
                        onClick={() => setActiveFilters((prev) => ({ ...prev, brand: null }))}
                    >
            {activeFilters.brand}
                        <span className="font-bold">&times;</span>
          </span>
                )}
            </div>

            {/* Shops list */}
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {filteredShops.length > 0 ? (
                    filteredShops.map((shop) => (
                        <Card
                            key={shop.id}
                            className="hover:shadow-md transition-shadow border-border bg-card cursor-pointer"
                            onClick={() => onSelectShop(shop)}
                        >
                            <CardHeader className="py-2 px-3">
                                <CardTitle className="text-sm font-semibold text-foreground">{shop.name}</CardTitle>
                                <CardDescription className="text-xs text-muted-foreground">{shop.brand}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))
                ) : (
                    <p className="text-muted-foreground text-center col-span-full">
                        Aucun magasin trouvé avec ces filtres.
                    </p>
                )}
            </div>
        </div>
    )
}
