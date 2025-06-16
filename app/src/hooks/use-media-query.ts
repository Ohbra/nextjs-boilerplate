"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window === "undefined") {
      return
    }

    // Create media query
    const media = window.matchMedia(query)

    // Set initial value
    setMatches(media.matches)

    // Define listener
    const listener = () => {
      setMatches(media.matches)
    }

    // Add listener
    media.addEventListener("change", listener)

    // Clean up
    return () => {
      media.removeEventListener("change", listener)
    }
  }, [query])

  return matches
}