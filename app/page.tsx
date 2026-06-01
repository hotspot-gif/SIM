"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Dashboard } from "@/components/dashboard"
import { LoginForm } from "@/components/login-form"
import { authenticate, clearStoredUser, getStoredUser, storeUser, type UserProfile } from "@/lib/auth"
import { Button } from "@/components/ui/button"

export default function Page() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const stored = getStoredUser()
    if (stored) setUser(stored)
  }, [])

  function handleSignIn(email: string, password: string) {
    const authenticated = authenticate(email, password)
    if (!authenticated) {
      setErrorMessage("Invalid credentials. Please check your email and password.")
      return
    }
    setErrorMessage(null)
    storeUser(authenticated)
    setUser(authenticated)
  }

  function handleSignOut() {
    clearStoredUser()
    setUser(null)
    setErrorMessage(null)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <LoginForm onSignIn={handleSignIn} errorMessage={errorMessage} />
          <div className="mt-6 rounded-3xl border border-border bg-card/90 p-5 text-sm text-muted-foreground shadow-sm">
            <p className="font-semibold text-foreground">Quick access</p>
            <p className="mt-2">Use your assigned email and the numeric password from your branch or zone assignment.</p>
            <p className="mt-2">Once signed in, you will only see retailers in your assigned branch or zone.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/sim-scan" className="rounded-full border border-border px-4 py-2 text-sm text-foreground hover:bg-secondary">
                Go to scan page
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <Dashboard user={user} onSignOut={handleSignOut} />
}
