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
    <div className="mx-auto max-w-md rounded-3xl border border-border bg-card/90 p-8 shadow-xl shadow-black/5 backdrop-blur-xl">
      <div className="mb-6 space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">SIM Collection Access</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Login to continue</h1>
        <p className="text-sm text-muted-foreground">
          Use your assigned Email and numeric password to access branch and zone stock details.
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
          />
        </div>
        {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          Continue
        </Button>
      </form>
      <div className="mt-6 rounded-2xl bg-secondary p-4 text-xs text-muted-foreground">
        <p className="font-semibold text-foreground">Tip</p>
        <p>Office managers see one branch, zone managers see one zone, regional managers see their group of four branches.</p>
      </div>
    </div>
  )
}
