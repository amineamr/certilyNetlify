// lib/client-role-queries.ts
import { createClient } from "@/lib/supabase/client"

export interface UserContext {
    user: any
    role: "super_user" | "airport_manager" | "shop_owner"
    userShops: string[]
    userAirports: string[]
}

export class ClientRoleQueries {
    // Get user context (client-side)
    static async getUserContext(): Promise<UserContext | null> {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return null

        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single()
        if (!profile) return null

        let userShops: string[] = []
        let userAirports: string[] = []

        if (profile.role === "shop_owner") {
            const { data: shops } = await supabase
                .from("user_shops")
                .select("shop_id")
                .eq("user_id", user.id)
            userShops = shops?.map((s) => s.shop_id) || []
        }

        if (profile.role === "airport_manager") {
            const { data: airports } = await supabase
                .from("user_airports")
                .select("airport_id")
                .eq("user_id", user.id)
            userAirports = airports?.map((a) => a.airport_id) || []
        }

        return { user, role: profile.role, userShops, userAirports }
    }

    // Get shops with client-side filtering
    static async getShops(context: UserContext) {
        const supabase = createClient()

        let query = supabase.from("shops").select(`
      *,
      airports (*)
    `)

        if (context.role === "shop_owner") {
            query = query.in("id", context.userShops)
        } else if (context.role === "airport_manager") {
            query = query.in("airport_id", context.userAirports)
        }

        return await query.order("created_at", { ascending: false })
    }

    // Get assessments with client-side filtering
    static async getAssessments(context: UserContext) {
        if (!context) return { data: null, error: "Not authenticated" }

        const supabase = createClient()

        let query = supabase
            .from("assessments")
            .select(`
        *,
        shops (*, airports (*))
      `)
            .order("created_at", { ascending: false })

        if (context.role === "shop_owner") {
            query = query.in("shop_id", context.userShops)
        } else if (context.role === "airport_manager") {
            const { data: shops } = await supabase
                .from("shops")
                .select("id")
                .in("airport_id", context.userAirports)

            const shopIds = shops?.map((s) => s.id) || []
            query = query.in("shop_id", shopIds)
        }

        return await query
    }
}
