'use client'

import { useState, useEffect } from 'react'

/**
 * Hook to detect if the viewport matches a given media query
 * @param query Media query string (e.g., '(min-width: 768px)')
 * @returns boolean indicating if the query matches
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const mediaQuery = window.matchMedia(query)
        setMatches(mediaQuery.matches)

        const handler = (event: MediaQueryListEvent) => {
            setMatches(event.matches)
        }

        mediaQuery.addEventListener('change', handler)
        return () => mediaQuery.removeEventListener('change', handler)
    }, [query])

    // Return false during SSR to prevent hydration mismatch
    if (!mounted) {
        return false
    }

    return matches
}

/**
 * Preset breakpoint hooks
 */
export function useIsMobile() {
    return !useMediaQuery('(min-width: 768px)')
}

export function useIsTablet() {
    const isTabletOrLarger = useMediaQuery('(min-width: 768px)')
    const isDesktop = useMediaQuery('(min-width: 1024px)')
    return isTabletOrLarger && !isDesktop
}

export function useIsDesktop() {
    return useMediaQuery('(min-width: 1024px)')
}

export function useIsLargeDesktop() {
    return useMediaQuery('(min-width: 1440px)')
}
