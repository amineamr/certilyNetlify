// context/UserContext.tsx
"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"

type UserContextType = {
    user: any | null
    setUser: (user: any | null) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserContextProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<any | null>(null)

    useEffect(() => {
        const supabase = createClient()

        // fetch the current user once on mount
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user ?? null)
        })

        // subscribe to auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUserContext() {
    const ctx = useContext(UserContext)
    if (!ctx) {
        throw new Error("useUserContext must be used within a UserContextProvider")
    }
    return ctx
}
