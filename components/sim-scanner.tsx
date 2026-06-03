"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Camera, Barcode, RefreshCw, CheckCircle, XCircle, ShieldAlert, ArrowRight, ArrowLeft, Keyboard, Scan } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetcher } from "@/lib/fetcher"
import type { IccidResult } from "@/lib/types"
import { BrowserMultiFormatReader } from "@zxing/browser"
import { formatCurrency } from "@/lib/calc"
import { useRouter } from "next/navigation"

export function SimScanner() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const readerRef = useRef<BrowserMultiFormatReader | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [scanned, setScanned] = useState<string>("")
  const [result, setResult] = useState<IccidResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<"select" | "barcode" | "manual" | "result">("select")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let isActive = true
    let hasDetected = false

    async function startScanner() {
      if (!videoRef.current || !navigator.mediaDevices?.getUserMedia) {
        if (isActive) setError("Camera not available on this device.")
        return
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { min: 320, ideal: 640, max: 1280 },
            height: { min: 240, ideal: 480, max: 720 },
          },
        })

        if (!isActive) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }

        readerRef.current = new BrowserMultiFormatReader()
        
        await readerRef.current.decodeFromVideoDevice(undefined, videoRef.current, (decodeResult, decodeError) => {
          if (!isActive) return
          
          if (decodeResult && !hasDetected) {
            hasDetected = true
            const scannedValue = decodeResult.getText()
            if (scannedValue.trim()) {
              setScanned(scannedValue)
              validate(scannedValue)
            }
          }
        })
      } catch (err) {
        if (isActive) {
          setError("Unable to open camera. Please allow camera access or use manual entry.")
        }
      }
    }

    if (mode === "barcode") {
      isActive = true
      hasDetected = false
      setError(null)
      startScanner()
    }

    return () => {
      isActive = false
      try {
        if (readerRef.current) {
          readerRef.current.reset()
          readerRef.current = null
        }
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => {
            try {
              track.stop()
            } catch {}
          })
          streamRef.current = null
        }
      } catch {}
    }
  }, [mode])

  const validate = async (value: string) => {
    if (!value.trim()) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetcher(`/api/iccid?value=${encodeURIComponent(value.trim())}`)
      setResult(data)
      setMode("result")
    } catch {
      setError("Invalid or not found ICCID. Please try another one.")
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setScanned("")
    setResult(null)
    setError(null)
    setMode("select")
  }

  if (mode === "select") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <button
          onClick={() => setMode("barcode")}
          className="flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-border bg-card p-10 transition-all hover:border-accent hover:bg-accent/5 group"
        >
          <div className="rounded-full bg-accent/10 p-5 text-accent transition-transform group-hover:scale-110">
            <Scan className="size-10" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-foreground">Scan Barcode</h3>
            <p className="text-sm text-muted-foreground">Use your camera to scan ICCID barcode</p>
          </div>
        </button>

        <button
          onClick={() => setMode("manual")}
          className="flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-border bg-card p-10 transition-all hover:border-accent hover:bg-accent/5 group"
        >
          <div className="rounded-full bg-brand-purple/10 p-5 text-brand-purple transition-transform group-hover:scale-110">
            <Keyboard className="size-10" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-foreground">Manual Input</h3>
            <p className="text-sm text-muted-foreground">Type the ICCID number manually</p>
          </div>
        </button>
      </div>
    )
  }

  if (mode === "result") {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={reset} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 size-4" />
            Back to Selection
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setMode(scanned ? "barcode" : "manual")}>
              Scan Again
            </Button>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4">
            <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${result?.defective ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
              {result?.defective ? (
                <>
                  <ShieldAlert className="size-6" />
                  <div>
                    <h2 className="text-lg font-bold uppercase tracking-wider">Defective SIM Detected</h2>
                    <p className="text-sm opacity-90">* This serial number is part of defective stock</p>
                  </div>
                </>
              ) : (
                <>
                  <CheckCircle className="size-6" />
                  <div>
                    <h2 className="text-lg font-bold">Valid / Not Defective</h2>
                    <p className="text-sm opacity-90">This ICCID is not part of the known defective stock</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {result?.batch && (
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-6">
                <div className="grid gap-4 rounded-2xl bg-secondary/50 p-6 border border-border/50">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">Retailer ID</p>
                    <p className="text-lg font-bold text-foreground">{result.batch.retailerId}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">City & Territory</p>
                    <p className="font-medium text-foreground">{result.batch.city} - {result.batch.territory}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">SIM Profile</p>
                    <p className="font-medium text-foreground">{result.batch.simProfile || "-"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid gap-4 rounded-2xl bg-secondary/50 p-6 border border-border/50">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">ICCID Range</p>
                    <div className="font-mono text-sm">
                      <p><span className="text-muted-foreground mr-2">From:</span> {result.batch.iccidFr}</p>
                      <p><span className="text-muted-foreground mr-2">To:</span> {result.batch.iccidTo}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">Estimated Reimbursement</p>
                    <p className="text-2xl font-bold text-accent">{formatCurrency(result.batch.reimbursement)}</p>
                  </div>
                </div>
                
                <Button 
                  onClick={() => router.push(`/search?q=${encodeURIComponent(result.batch!.retailerId)}`)}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 text-base font-semibold"
                >
                  Go to Retailer Stock Details
                  <ArrowRight className="ml-2 size-5" />
                </Button>
              </div>
            </div>
          )}

          {!result?.batch && (
             <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
                <div className="rounded-full bg-secondary p-5">
                   <Barcode className="size-10 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                   <p className="text-lg font-medium text-foreground">Validated ICCID: <span className="font-mono">{scanned}</span></p>
                   <p className="text-sm text-muted-foreground max-w-xs">This ICCID was validated successfully but no associated batch was found in the defective stock database.</p>
                </div>
                <Button variant="outline" onClick={reset}>Try Another One</Button>
             </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={reset} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 size-4" />
          Back to Selection
        </Button>
        <div className="text-sm font-medium text-muted-foreground">
          Mode: {mode === "barcode" ? "Barcode Scanner" : "Manual Input"}
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        {mode === "barcode" && (
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-black aspect-video sm:aspect-[16/9] max-w-2xl mx-auto">
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                autoPlay
                playsInline
                muted
              />
              <div className="absolute inset-0 border-2 border-accent/50 opacity-20 pointer-events-none" />
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-accent/50 opacity-40 pointer-events-none" />
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground italic">Point your camera at the ICCID barcode on the SIM card</p>
              {error && (
                <div className="mx-auto max-w-md rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
            </div>
          </div>
        )}

        {mode === "manual" && (
          <div className="max-w-md mx-auto space-y-6 py-4">
            <div className="space-y-2">
              <label htmlFor="manual-iccid" className="text-sm font-semibold text-foreground">
                Enter ICCID Number
              </label>
              <p className="text-xs text-muted-foreground">Enter full 19/18 digits or 11-digit short code</p>
              <div className="flex gap-2">
                <Input
                  id="manual-iccid"
                  value={scanned}
                  onChange={(e) => setScanned(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && validate(scanned)}
                  placeholder="e.g. 8939350070063429655"
                  inputMode="numeric"
                  className="font-mono text-base h-12"
                  autoFocus
                />
                <Button 
                  onClick={() => validate(scanned)} 
                  disabled={loading || !scanned.trim()}
                  className="h-12 px-6"
                >
                  {loading ? <RefreshCw className="size-4 animate-spin" /> : "Validate"}
                </Button>
              </div>
              {error && <p className="text-sm text-destructive mt-2">{error}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
