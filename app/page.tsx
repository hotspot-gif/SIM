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
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <LoginForm onSignIn={handleSignIn} errorMessage={errorMessage} />
        </div>
      </div>
    )
  }

  return <Dashboard user={user} onSignOut={handleSignOut} />
}
