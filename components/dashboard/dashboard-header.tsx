"use client"
import { useUserContext } from "@/context/UserContext"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PWAStatus } from "@/components/pwa/pwa-status"
import { Zap, Settings, LogOut, User, ClipboardCheck, Menu, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

interface UserData {
  id: string
  email: string
  name?: string
  role?: string
}

export function DashboardHeader() {
  const { user } = useUserContext()
  const [localUser, setLocalUser] = useState<UserData | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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

          {/* Desktop menu */}
          <div className="hidden sm:flex items-center space-x-4">
            {localUser?.role !== "shop_owner" && (
              <Link href="/audit">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <ClipboardCheck className="w-4 h-4 mr-2" />
                  Audit
                </Button>
              </Link>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-accent text-accent-foreground">
                      {localUser?.name?.charAt(0).toUpperCase() ||
                        localUser?.email?.charAt(0).toUpperCase() ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-popover border-border" align="end">
                <div className="flex flex-col gap-2 p-2">
                  <p className="font-medium text-foreground">{localUser?.name || "User"}</p>
                  <p className="text-sm text-muted-foreground truncate">{localUser?.email}</p>
                </div>

                <DropdownMenuSeparator />

                <div className="px-4 py-2">
                  <PWAStatus />
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="text-foreground hover:bg-accent hover:text-accent-foreground">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="text-foreground hover:bg-accent hover:text-accent-foreground">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-foreground hover:bg-destructive hover:text-destructive-foreground cursor-pointer"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Audit button and hamburger menu */}
          <div className="flex sm:hidden items-center space-x-2">
            {localUser?.role !== "shop_owner" && (
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

        {/* Mobile menu content */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-2 space-y-2">
            <div className="flex flex-col space-y-2 p-2 border-t border-border/50">
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
          </div>
        )}
      </div>
    </header>
  )
}
