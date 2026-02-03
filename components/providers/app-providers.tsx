"use client"

import React from "react"

import { ThemeProvider } from "./theme-provider"
import { LanguageProvider } from "./language-provider"
import { CurrencyProvider } from "./currency-provider"
import { Toaster } from "@/components/ui/toaster"

interface AppProvidersProps {
  children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CurrencyProvider>
          {children}
          <Toaster />
        </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
