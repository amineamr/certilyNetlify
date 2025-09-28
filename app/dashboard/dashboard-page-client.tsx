"use client";

import { useState, useMemo } from "react";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export function DashboardPageClient({
                                        initialAssessments,
                                        initialShops,
                                        userContext,
                                    }: {
    initialAssessments: any[];
    initialShops: any[];
    userContext: any;
}) {
    const [activeFilters, setActiveFilters] = useState<{ location: string | null; brand: string | null }>({
        location: null,
        brand: null,
    });

    // Filter shops by active filters
    const filteredShops = useMemo(() => {
        return initialShops.filter(
            (shop) =>
                (!activeFilters.location || shop.location === activeFilters.location) &&
                (!activeFilters.brand || shop.brand === activeFilters.brand)
        );
    }, [initialShops, activeFilters]);

    // Map shop_id to shop object for assessments
    const filteredAssessments = useMemo(() => {
        const shopMap = new Map(initialShops.map((s) => [s.id, s]));
        const shopIds = new Set(filteredShops.map((s) => s.id));

        return initialAssessments
            .map((a) => ({ ...a, shop: shopMap.get(a.shop_id) || null }))
            .filter((a) => a.shop && shopIds.has(a.shop.id));
    }, [initialAssessments, filteredShops, initialShops]);

    // Available locations and brands **dynamic based on active filters**
    const availableLocations = useMemo(() => {
        const shops = activeFilters.brand
            ? initialShops.filter((s) => s.brand === activeFilters.brand)
            : initialShops;
        return Array.from(new Set(shops.map((s) => s.location)));
    }, [initialShops, activeFilters.brand]);

    const availableBrands = useMemo(() => {
        const shops = activeFilters.location
            ? initialShops.filter((s) => s.location === activeFilters.location)
            : initialShops;
        return Array.from(new Set(shops.map((s) => s.brand)));
    }, [initialShops, activeFilters.location]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Filters */}
            <div className="flex mb-4 gap-2">
                {/* Location Filter */}
                <div className="flex-1">
                    <label className="text-sm font-medium mb-1 block">Lieu</label>
                    <Select
                        value={activeFilters.location ?? "all"}
                        onValueChange={(val) => setActiveFilters((prev) => ({ ...prev, location: val === "all" ? null : val }))}
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
                <div className="flex-1">
                    <label className="text-sm font-medium mb-1 block">Marque</label>
                    <Select
                        value={activeFilters.brand ?? "all"}
                        onValueChange={(val) => setActiveFilters((prev) => ({ ...prev, brand: val === "all" ? null : val }))}
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

            {/* Active Filter Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
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
            </div>

            {/* Dashboard */}
            <DashboardStats assessments={filteredAssessments} shops={filteredShops} />
            <DashboardContent assessments={filteredAssessments} />
        </div>
    );
}
