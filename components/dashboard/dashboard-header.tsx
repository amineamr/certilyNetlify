"use client"
import { useUserContext } from "@/context/UserContext"
import { Button } from "@/components/ui/button"
import { Zap, ClipboardCheck, Menu, X, User, Settings, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { PWAStatus } from "@/components/pwa/pwa-status"

interface UserData {
    id: string
    email: string
    name?: string
    role?: string
}

// Accept role from props or userContext
export function DashboardHeader({ role }: { role?: string }) {
    const { user } = useUserContext()
    const router = useRouter()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    if (!user) return null

    // Build localUser using role from props if available
    const localUser: UserData = {
        id: user.id,
        email: user.email || "",
        name: user.user_metadata?.name || user.email?.split("@")[0],
        role: role || user.user_metadata?.role,
    }

    const canAudit =
        localUser.role === "super_user" || localUser.role === "airport_manager"

    const handleSignOut = async () => {
        router.push("/login")
        const supabase = createClient()
        await supabase.auth.signOut()
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
                        <PWAStatus />
                    </Link>

                    {/* Desktop menu */}
                    <div className="hidden sm:flex items-center space-x-4">
                        {canAudit && (
                            <Link href="/audit">
                                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center">
                                    <ClipboardCheck className="w-4 h-4 mr-2" />
                                    Audit
                                </Button>
                            </Link>
                        )}

                        <Button
                            variant="ghost"
                            onClick={() => router.push("/profile")}
                            className="flex items-center"
                        >
                            <User className="mr-2 h-4 w-4" />
                            Profile
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => router.push("/settings")}
                            className="flex items-center"
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </Button>

                        <Button
                            variant="ghost"
                            onClick={handleSignOut}
                            className="flex items-center text-destructive"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign out
                        </Button>
                    </div>

                    {/* Mobile menu */}
                    <div className="flex sm:hidden items-center space-x-2">
                        {canAudit && (
                            <Link href="/audit">
                                <Button
                                    size="icon"
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                    title="Audit"
                                >
                                    <ClipboardCheck className="w-4 h-4" />
                                </Button>
                            </Link>
                        )}

                        <Button
                            variant="ghost"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile collapsible menu */}
                {mobileMenuOpen && (
                    <div className="sm:hidden mt-2 space-y-2 p-4 border-t border-border/50">
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
