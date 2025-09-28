import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function UnauthorizedPage() {
  return (
    <div className="relative flex h-screen flex-col items-center justify-center overflow-hidden">
      {/* Subtle grid background (same as not-found) */}
      <div className="absolute inset-0 grid-pattern" />

      <Card className="relative z-10 w-full max-w-md border border-border shadow-xl rounded-xl bg-card">
        <CardContent className="flex flex-col items-center p-8 text-center">
          <h1 className="text-5xl font-bold text-destructive animate__animated animate__fadeInDown">
            401
          </h1>
          <p className="mt-4 text-lg text-muted-foreground animate__animated animate__fadeInUp">
            You don’t have permission to view this page.
          </p>

          <Button
            asChild
            className="mt-6 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Link href="/">Go Back Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
