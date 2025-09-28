// lib/client-role-queries.ts
import { createClient } from "@/lib/supabase/client";

export interface UserContext {
    user: any;
    role: "super_user" | "airport_manager" | "shop_owner" | "airport_worker";
}

export class ClientRoleQueries {
    // Get user context for UI (role-based UI logic)
    static async getUserContext(): Promise<UserContext | null> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (!profile) return null;

        return { user, role: profile.role };
    }

    // Get shops (RLS applies automatically)
    static async getShops() {
        const supabase = createClient();
        return await supabase
            .from("shops")
            .select("*, airports (*)")
            .order("created_at", { ascending: false });
    }

    // Get assessments (optional shopId filter)
    static async getAssessments(shopId?: string) {
        const supabase = createClient();
        let query = supabase
            .from("assessments")
            .select("*, shops (*, airports (*))")
            .order("created_at", { ascending: false });

        if (shopId) query = query.eq("shop_id", shopId);

        return await query;
    }
}
