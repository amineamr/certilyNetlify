"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface Assessment {
    id: string
    status: string
    created_at: string
    shop_id: string
}

interface Shop {
    id: string
    name: string
    brand: string
    location: string
    is_monthly?: boolean
}

interface ShopSelectorProps {
    shops: Shop[]
    assessments: Assessment[]
}

export function ShopSelector({ shops, assessments = [] }: ShopSelectorProps) {
    const [activeFilters, setActiveFilters] = useState<{
        location: string | null
        brand: string | null
        monthly: boolean
    }>({
        location: null,
        brand: null,
        monthly: false,
    })

    // Current month/year
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    // Shops that already have assessments this month
    const auditedThisMonth = useMemo(() => {
        const filtered = assessments.filter((a) => {
            const date = new Date(a.created_at)
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear
        })
        return new Set(filtered.map((a) => a.shop_id))
    }, [assessments, currentMonth, currentYear])

    // Shops used for dropdown options (monthly checkbox applied)
    const monthlyFilteredShops = useMemo(() => {
        return shops.filter((shop) => {
            if (!activeFilters.monthly) return true
            return shop.is_monthly === true && !auditedThisMonth.has(shop.id)
        })
    }, [shops, activeFilters.monthly, auditedThisMonth])

    // Available locations & brands based on monthly filter + other filter
    const availableLocations = useMemo(() => {
        return Array.from(
            new Set(
                monthlyFilteredShops
                    .filter((s) => !activeFilters.brand || s.brand === activeFilters.brand)
                    .map((s) => s.location)
            )
        )
    }, [monthlyFilteredShops, activeFilters.brand])

    const availableBrands = useMemo(() => {
        return Array.from(
            new Set(
                monthlyFilteredShops
                    .filter((s) => !activeFilters.location || s.location === activeFilters.location)
                    .map((s) => s.brand)
            )
        )
    }, [monthlyFilteredShops, activeFilters.location])

    // Shops displayed in the grid (all filters combined)
    const filteredShops = useMemo(() => {
        return shops.filter((shop) => {
            const locationMatch = !activeFilters.location || shop.location === activeFilters.location
            const brandMatch = !activeFilters.brand || shop.brand === activeFilters.brand
            const monthlyMatch =
                !activeFilters.monthly || (shop.is_monthly === true && !auditedThisMonth.has(shop.id))
            return locationMatch && brandMatch && monthlyMatch
        })
    }, [shops, activeFilters, auditedThisMonth])

    return (
        <div className="space-y-6">
            {/* Back link */}
            <div className="flex items-center space-x-2">
                <Link
                    href="/dashboard"
                    className="flex items-center text-sm text-primary hover:underline"
                >
                    <ArrowLeft className="w-4 h-4 mr-4" />
                    Retour
                </Link>
            </div>

            {/* Title */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                    Sélectionner un magasin
                </h2>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-end">
                {/* Location filter */}
                <div className="flex-1 min-w-[150px]">
                    <label className="text-sm font-medium mb-1 block">Lieu</label>
                    <Select
                        value={activeFilters.location ?? "all"}
                        onValueChange={(val) =>
                            setActiveFilters((prev) => ({
                                ...prev,
                                location: val === "all" ? null : val,
                            }))
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

                {/* Brand filter */}
                <div className="flex-1 min-w-[150px]">
                    <label className="text-sm font-medium mb-1 block">Marque</label>
                    <Select
                        value={activeFilters.brand ?? "all"}
                        onValueChange={(val) =>
                            setActiveFilters((prev) => ({
                                ...prev,
                                brand: val === "all" ? null : val,
                            }))
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

                {/* Monthly filter */}
                <div className="flex items-center space-x-2">
                    <Switch id="monthly" checked={activeFilters.monthly}
                        onCheckedChange={(val) =>
                            setActiveFilters((prev) => ({ ...prev, monthly: Boolean(val) }))
                        }
                    />
                    <label
                        htmlFor="monthly"
                        className="text-sm font-medium leading-none cursor-pointer"
                    >
                        Suivi mensuel
                    </label>
                </div>
            </div>

            {/* Active filters badges */}
            <div className="flex flex-wrap gap-2">
                {activeFilters.location && (
                    <span
                        className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full cursor-pointer hover:bg-blue-200 transition"
                        onClick={() => setActiveFilters((prev) => ({ ...prev, location: null }))}
                    >
            {activeFilters.location} <span className="font-bold">&times;</span>
          </span>
                )}
                {activeFilters.brand && (
                    <span
                        className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full cursor-pointer hover:bg-green-200 transition"
                        onClick={() => setActiveFilters((prev) => ({ ...prev, brand: null }))}
                    >
            {activeFilters.brand} <span className="font-bold">&times;</span>
          </span>
                )}
                {activeFilters.monthly && (
                    <span
                        className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full cursor-pointer hover:bg-purple-200 transition"
                        onClick={() => setActiveFilters((prev) => ({ ...prev, monthly: false }))}
                    >
            Suivi mensuel <span className="font-bold">&times;</span>
          </span>
                )}
            </div>

            {/* Shops list */}
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {filteredShops.length > 0 ? (
                    filteredShops.map((shop) => (
                        <Link
                            key={shop.id}
                            href={`/audit/${shop.id}`}
                            className="hover:shadow-md transition-shadow border-border bg-card"
                        >
                            <Card>
                                <CardHeader className="py-2 px-3">
                                    <CardTitle className="text-sm font-semibold text-foreground">
                                        {shop.name}
                                    </CardTitle>
                                    <CardDescription className="text-xs text-muted-foreground">
                                        {shop.brand}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
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
