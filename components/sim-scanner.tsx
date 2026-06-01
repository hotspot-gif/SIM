"use client"

import { useEffect, useRef, useState } from "react"
import { Camera, Barcode, RefreshCw, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetcher } from "@/lib/fetcher"
import type { IccidResult } from "@/lib/types"

export function SimScanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [scanned, setScanned] = useState<string>("")
  const [result, setResult] = useState<IccidResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    let interval: number | null = null
    let detector: any
    async function startScanner() {
      if (!videoRef.current || !navigator.mediaDevices?.getUserMedia) {
        setError("Camera not available on this device.")
        return
      }

      const BarcodeDetectorClass = (window as any).BarcodeDetector
      if (!BarcodeDetectorClass) {
        setError("Barcode detector not supported in this browser.")
        return
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        })
        setStream(stream)
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }

        detector = new BarcodeDetectorClass({ formats: ["code_128", "ean_13", "ean_8", "qr_code"] })
        interval = window.setInterval(async () => {
          if (!videoRef.current) return
          try {
            const barcodes = await detector.detect(videoRef.current)
            if (barcodes.length > 0) {
              setScanned(barcodes[0].rawValue ?? "")
              setScanning(false)
            }
          } catch {
            // ignore intermittent scanning failures
          }
        }, 700)
      } catch (err) {
        setError("Unable to open camera. Please allow camera access or use manual entry.")
      }
    }

    if (scanning) {
      startScanner()
    }

    return () => {
      if (interval) window.clearInterval(interval)
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [scanning, stream])

  async function validate(value: string) {
    setError(null)
    setResult(null)
    setScanned(value)
    if (!value.trim()) return
    try {
      const data = await fetcher(`/api/iccid?value=${encodeURIComponent(value.trim())}`)
      setResult(data)
    } catch {
      setError("Unable to validate ICCID. Try again.")
    }
  }

  return (
    <div className="space-y-6 rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">SIM Scan</p>
          <h1 className="text-2xl font-semibold text-foreground">Scan ICCID with mobile camera</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Use the camera scanner if available, or enter the ICCID manually. Scanned values can be validated instantly.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setScanning((prev) => !prev)} className="bg-primary text-primary-foreground">
            <Camera className="mr-2 size-4" />
            {scanning ? "Stop scan" : "Start scan"}
          </Button>
          <Button variant="outline" onClick={() => validate(scanned)}>
            <RefreshCw className="mr-2 size-4" /> Validate
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-secondary p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Scanned ICCID</p>
            <p className="mt-2 font-mono text-sm text-foreground break-all">{scanned || "No code scanned yet."}</p>
          </div>

          <div className="rounded-2xl border border-border bg-secondary p-4">
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground" htmlFor="manual-iccid">
              Manual ICCID input
            </label>
            <Input
              id="manual-iccid"
              value={scanned}
              onChange={(event) => setScanned(event.target.value)}
              placeholder="Enter full ICCID"
              inputMode="numeric"
              className="mt-3 font-mono"
            />
          </div>
        </div>

        <div className="space-y-4">
          {scanning && (
            <div className="overflow-hidden rounded-2xl border border-border bg-black/90">
              <video ref={videoRef} className="aspect-video w-full object-cover" muted playsInline />
            </div>
          )}

          <div className="rounded-2xl border border-border bg-secondary p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Barcode className="size-4 text-accent" /> Result
            </div>
            <div className="mt-3 space-y-3 text-sm">
              {result ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 rounded-2xl bg-background px-3 py-2 text-sm">
                    <CheckCircle className="size-4 text-success" />
                    <span>{result.defective ? "Defective stock detected" : "Not defective"}</span>
                  </div>
                  {result.batch ? (
                    <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                      <div>
                        <p className="font-semibold text-foreground">Retailer</p>
                        <p>{result.batch.retailerId}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">City</p>
                        <p>{result.batch.city || "Unknown"}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Range</p>
                        <p>{result.batch.iccidFr}-{result.batch.iccidTo}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Qty</p>
                        <p>{result.batch.qty}</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-2xl border border-dashed border-border px-3 py-6 text-sm text-muted-foreground">
                  <XCircle className="size-4" />
                  <span>No ICCID validated yet.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
