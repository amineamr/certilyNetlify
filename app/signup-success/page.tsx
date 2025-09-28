import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SignupSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-foreground">Check Your Email</CardTitle>
          <CardDescription className="text-muted-foreground">We've sent you a confirmation link</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Please check your email and click the confirmation link to activate your account. Once confirmed, you can
            sign in to access your dashboard.
          </p>
          <div className="flex justify-center">
            <Button asChild variant="outline">
              <Link href="/login">Back to Sign In</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
