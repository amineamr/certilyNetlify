import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { PWAInstallPrompt } from "@/components/pwa/pwa-install-prompt"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { UserContextProvider } from "@/context/UserContext"

export const metadata: Metadata = {
  title: "Certily - Professional Audit Platform",
  description:
    "Streamline your audit processes with Certily - the complete platform for conducting, tracking, and reporting audits across multiple locations",
  generator: "v0.app",
  manifest: "/manifest.json",
  themeColor: "#ffffff",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Certily",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <UserContextProvider>
        <Suspense fallback={null}>{children}</Suspense>
        <PWAInstallPrompt />
        <Toaster />
        <Analytics />
      </UserContextProvider>
      </body>
    </html>
  )
}
