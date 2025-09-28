"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff } from "lucide-react"

export function PWAStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Check if PWA is installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
    }

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered: ", registration)
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError)
        })
    }

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return (
    <div className="flex items-center space-x-2">
      <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center space-x-1">
        {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
        <span>{isOnline ? "Online" : "Offline"}</span>
      </Badge>
      {isInstalled && (
        <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
          PWA Installed
        </Badge>
      )}
    </div>
  )
}
