import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background grid-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-accent-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">Certily</span>
          </Link>
        </div>

        <Card className="bg-card border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground">Welcome back</CardTitle>
            <CardDescription className="text-muted-foreground">Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/signup" className="text-accent hover:text-accent/80 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
