"use client"

// A simple global state to persist sidebar state across remounts during navigation
let sidebarCollapsed = false

if (typeof window !== "undefined") {
  const saved = localStorage.getItem("sidebar-collapsed")
  if (saved !== null) {
    sidebarCollapsed = JSON.parse(saved)
  }
}

export function getSidebarCollapsed() {
  return sidebarCollapsed
}

export function setSidebarCollapsed(value: boolean) {
  sidebarCollapsed = value
  if (typeof window !== "undefined") {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(value))
  }
}
