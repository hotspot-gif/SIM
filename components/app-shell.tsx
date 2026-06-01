"use client"

import { useState } from "react"
import { Menu, X, Eye, EyeOff } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { clearStoredUser } from "@/lib/auth"

interface Props {
  title: string
  children: React.ReactNode
  hideable?: boolean
  onSignOut?: () => void
}

export function AppShell({ title, children, hideable = true, onSignOut }: Props) {
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const router = useRouter()

  function signOut() {
    if (onSignOut) {
      onSignOut()
      return
    }
    clearStoredUser()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {sidebarVisible && <Sidebar onCollapse={() => setSidebarVisible(false)} />}

        <div className="flex min-h-screen flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              {hideable && (
                <Button variant="outline" size="sm" onClick={() => setSidebarVisible((prev) => !prev)}>
                  {sidebarVisible ? <EyeOff className="mr-2 size-4" /> : <Eye className="mr-2 size-4" />}
                  {sidebarVisible ? "Hide sidebar" : "Show sidebar"}
                </Button>
              )}
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">View</p>
                <h1 className="text-lg font-semibold text-foreground">{title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={signOut}>
                Sign out
              </Button>
            </div>
          </div>

          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
