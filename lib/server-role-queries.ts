// lib/server-role-queries.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";

export const createClient = cache(() => {
    const cookieStore = cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // Ignore if called from a Server Component
                    }
                },
            },
        }
    );
});

export class ServerRoleQueries {
    // Get user context (role, for UI)
    static async getUserContext() {
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

    // Get all shops (RLS filters rows automatically)
    static async getShops() {
        const supabase = createClient();
        return await supabase
            .from("shops")
            .select("*, airports (*)")
            .order("created_at", { ascending: false });
    }

    // Get all assessments (optionally filter by shopId)
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
