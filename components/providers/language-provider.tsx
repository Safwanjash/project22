"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export type Language = "ar" | "en"

type LanguageProviderProps = {
  children: React.ReactNode
  defaultLanguage?: Language
  storageKey?: string
}

type LanguageProviderState = {
  language: Language
  setLanguage: (language: Language) => void
  dir: "rtl" | "ltr"
  isRTL: boolean
  t: (key: string) => string
}

const initialState: LanguageProviderState = {
  language: "ar",
  setLanguage: () => null,
  dir: "rtl",
  isRTL: true,
  t: (key: string) => key,
}

const LanguageProviderContext = createContext<LanguageProviderState>(initialState)

// Import translations
import { translations } from "@/lib/translations"

export function LanguageProvider({
  children,
  defaultLanguage = "ar",
  storageKey = "ui-language",
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(storageKey) as Language | null
    if (stored) {
      setLanguageState(stored)
    }
  }, [storageKey])

  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    root.setAttribute("lang", language)
    root.setAttribute("dir", language === "ar" ? "rtl" : "ltr")
  }, [language, mounted])

  const t = (key: string): string => {
    const keys = key.split(".")
    let value: unknown = translations[language]
    
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = (value as Record<string, unknown>)[k]
      } else {
        return key // Return key if translation not found
      }
    }
    
    return typeof value === "string" ? value : key
  }

  const setLanguage = (lang: Language) => {
    localStorage.setItem(storageKey, lang)
    setLanguageState(lang)
  }

  const value: LanguageProviderState = {
    language,
    setLanguage,
    dir: language === "ar" ? "rtl" : "ltr",
    isRTL: language === "ar",
    t,
  }

  return (
    <LanguageProviderContext.Provider value={value}>
      {children}
    </LanguageProviderContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageProviderContext)

  if (context === undefined)
    throw new Error("useLanguage must be used within a LanguageProvider")

  return context
}
