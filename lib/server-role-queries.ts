import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { cache } from "react"

export const createClient = cache(() => {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (error) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
})

export class ServerRoleQueries {
  static async getUserContext() {
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile) return null

    let userShops: string[] = []
    let userAirports: string[] = []

    if (profile.role === 'shop_owner') {
      const { data: shops } = await supabase
        .from('user_shops')
        .select('shop_id')
        .eq('user_id', user.id)
      userShops = shops?.map(s => s.shop_id) || []
    }

    if (profile.role === 'airport_manager') {
      const { data: airports } = await supabase
        .from('user_airports')
        .select('airport_id')
        .eq('user_id', user.id)
      userAirports = airports?.map(a => a.airport_id) || []
    }

    return {
      user,
      role: profile.role,
      userShops,
      userAirports
    }
  }

  // Get shops with server-side filtering
  static async getShops() {
    const context = await this.getUserContext()
    if (!context) return { data: null, error: 'Not authenticated' }

    const supabase = createClient()
    
    let query = supabase.from('shops').select(`
      *,
      airports (*)
    `)

    if (context.role === 'shop_owner') {
      query = query.in('id', context.userShops)
    } else if (context.role === 'airport_manager') {
      query = query.in('airport_id', context.userAirports)
    }

    return await query.order('created_at', { ascending: false })
  }

  // Get assessments with server-side filtering
  static async getAssessments(shopId?: string) {
    const context = await this.getUserContext()
    if (!context) return { data: null, error: 'Not authenticated' }

    const supabase = createClient()
    
    let query = supabase
      .from('assessments')
      .select(`
        *,
        shops (*, airports (*))
      `)

    if (shopId) {
      query = query.eq('shop_id', shopId)
    }

    if (context.role === 'shop_owner') {
      query = query.in('shop_id', context.userShops)
    } else if (context.role === 'airport_manager') {
      const { data: shops } = await supabase
        .from('shops')
        .select('id')
        .in('airport_id', context.userAirports)
      
      const shopIds = shops?.map(s => s.id) || []
      query = query.in('shop_id', shopIds)
    }

    return await query.order('created_at', { ascending: false })
  }
}
