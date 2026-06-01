"use client"

import { useState } from "react"
import type { FormEvent } from "react"
import { Lock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { UserProfile } from "@/lib/auth"

interface Props {
  onSignIn: (email: string, password: string) => void
  errorMessage: string | null
}

export function LoginForm({ onSignIn, errorMessage }: Props) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSignIn(email.trim(), password.trim())
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="flex justify-center">
        <img
          src="https://cms-assets.ldsvcplatform.com/IT/s3fs-public/2023-09/home_logo.png"
          alt="Universal Service Logo"
          className="h-16 w-auto object-contain"
        />
      </div>

      <div className="rounded-3xl border border-border bg-card/90 p-8 shadow-xl shadow-black/5 backdrop-blur-xl">
        <div className="mb-6 space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">SIM Collection Access</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Login to continue</h1>
          <p className="text-sm text-muted-foreground">
            Use your assigned email and numeric password to access branch and zone stock details.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              <Mail className="size-4" /> Email
            </label>
            <Input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="your.name@universalservice.it"
              autoComplete="username"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              <Lock className="size-4" /> Password
            </label>
            <Input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              placeholder="Numeric password"
              autoComplete="current-password"
              className="h-11"
            />
          </div>
          {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
          <Button type="submit" className="h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90">
            Continue
          </Button>
        </form>
      </div>

      <div className="rounded-3xl border border-border bg-card/90 p-6 text-sm text-muted-foreground shadow-sm">
        <p className="font-semibold text-foreground">Access Information</p>
        <p className="mt-2 leading-relaxed">
          Office managers see one branch, zone managers see one zone, regional managers see their group of assigned branches.
        </p>
        <p className="mt-2 leading-relaxed">
          Once signed in, you will only see retailers and stock relevant to your current assignment.
        </p>
      </div>
    </div>
  )
}
