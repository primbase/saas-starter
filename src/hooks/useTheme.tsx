'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
    theme: Theme
    resolvedTheme: 'light' | 'dark'
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
    children: ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

export function ThemeProvider({
    children,
    defaultTheme = 'system',
    storageKey = 'app-theme',
}: ThemeProviderProps) {
    const [theme, setThemeState] = useState<Theme>(defaultTheme)
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const stored = localStorage.getItem(storageKey) as Theme | null
        if (stored) {
            setThemeState(stored)
        }
    }, [storageKey])

    useEffect(() => {
        if (!mounted) return

        const root = window.document.documentElement
        root.classList.remove('light', 'dark')

        let effectiveTheme: 'light' | 'dark'

        if (theme === 'system') {
            effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light'
        } else {
            effectiveTheme = theme
        }

        root.classList.add(effectiveTheme)
        setResolvedTheme(effectiveTheme)
    }, [theme, mounted])

    // Listen for system theme changes
    useEffect(() => {
        if (!mounted || theme !== 'system') return

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        const handleChange = (e: MediaQueryListEvent) => {
            const root = window.document.documentElement
            root.classList.remove('light', 'dark')
            const newTheme = e.matches ? 'dark' : 'light'
            root.classList.add(newTheme)
            setResolvedTheme(newTheme)
        }

        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [theme, mounted])

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme)
        localStorage.setItem(storageKey, newTheme)
    }

    // Prevent flash of incorrect theme
    if (!mounted) {
        return (
            <ThemeContext.Provider
                value={{ theme: defaultTheme, resolvedTheme: 'light', setTheme: () => { } }}
            >
                {children}
            </ThemeContext.Provider>
        )
    }

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
