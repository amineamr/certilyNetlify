"use client"
import { useUserContext } from "@/context/UserContext"
import { Button } from "@/components/ui/button"
import { Zap, ClipboardCheck, Menu, X, User, Settings, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { PWAStatus } from "@/components/pwa/pwa-status"

interface UserData {
    id: string
    email: string
    name?: string
    role?: string
}

export function DashboardHeader() {
    const { user } = useUserContext()
    const [localUser, setLocalUser] = useState<UserData | null>(null)
    const [menuOpen, setMenuOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (user) {
            setLocalUser({
                id: user.id,
                email: user.email || "",
                name: user.user_metadata?.name || user.email?.split("@")[0],
                role: user.user_metadata?.role,
            })
        }
    }, [user])

    const handleSignOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push("/login")
    }

    return (
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                            <Zap className="w-5 h-5 text-accent-foreground" />
                        </div>
                        <span className="text-xl font-bold text-foreground">Certily</span>
                    </Link>

                    <div className="flex items-center space-x-2">
                        {/* Audit button */}
                        {localUser?.role !== "shop_owner" && (
                            <>
                                {/* Full text on desktop */}
                                <div className="hidden sm:block">
                                    <Link href="/audit">
                                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center">
                                            <ClipboardCheck className="w-4 h-4 mr-2" />
                                            Audit
                                        </Button>
                                    </Link>
                                </div>
                                {/* Icon only on mobile */}
                                <div className="sm:hidden">
                                    <Link href="/audit">
                                        <Button
                                            size="icon"
                                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                            title="Audit"
                                        >
                                            <ClipboardCheck className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </>
                        )}

                        {/* Burger menu for all screens */}
                        <Button
                            variant="ghost"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </Button>
                    </div>
                </div>

                {/* Collapsible menu */}
                {menuOpen && (
                    <div className="mt-2 space-y-2 p-4 border-t border-border/50">
                        {/* <div className="py-2 px-1">
                            Collapsible menu <PWAStatus />
                        </div>*/}
                        <Button
                            variant="ghost"
                            className="flex items-center w-full"
                            onClick={() => router.push("/profile")}
                        >
                            <User className="mr-2 h-4 w-4" />
                            Profile
                        </Button>
                        <Button
                            variant="ghost"
                            className="flex items-center w-full"
                            onClick={() => router.push("/settings")}
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </Button>

                        <Button
                            variant="ghost"
                            className="flex items-center w-full text-destructive"
                            onClick={handleSignOut}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign out
                        </Button>
                    </div>
                )}
            </div>
        </header>
    )
}
