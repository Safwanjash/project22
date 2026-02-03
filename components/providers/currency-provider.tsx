"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export type Currency = "ILS" | "USD"

type CurrencyProviderProps = {
  children: React.ReactNode
  defaultCurrency?: Currency
  storageKey?: string
}

type CurrencyInfo = {
  code: Currency
  symbol: string
  nameAr: string
  nameEn: string
  rate: number // Rate relative to ILS (ILS = 1)
}

export const currencies: Record<Currency, CurrencyInfo> = {
  ILS: {
    code: "ILS",
    symbol: "₪",
    nameAr: "شيكل",
    nameEn: "Shekel",
    rate: 1,
  },
  USD: {
    code: "USD",
    symbol: "$",
    nameAr: "دولار",
    nameEn: "Dollar",
    rate: 0.27, // Example rate: 1 ILS = 0.27 USD
  },
}

type CurrencyProviderState = {
  currency: Currency
  setCurrency: (currency: Currency) => void
  currencyInfo: CurrencyInfo
  formatPrice: (amount: number, showSymbol?: boolean) => string
  convertPrice: (amount: number, fromCurrency?: Currency) => number
}

const initialState: CurrencyProviderState = {
  currency: "ILS",
  setCurrency: () => null,
  currencyInfo: currencies.ILS,
  formatPrice: (amount: number) => `₪${amount.toFixed(2)}`,
  convertPrice: (amount: number) => amount,
}

const CurrencyProviderContext = createContext<CurrencyProviderState>(initialState)

export function CurrencyProvider({
  children,
  defaultCurrency = "ILS",
  storageKey = "ui-currency",
}: CurrencyProviderProps) {
  const [currency, setCurrencyState] = useState<Currency>(defaultCurrency)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(storageKey) as Currency | null
    if (stored && currencies[stored]) {
      setCurrencyState(stored)
    }
  }, [storageKey])

  const setCurrency = (curr: Currency) => {
    localStorage.setItem(storageKey, curr)
    setCurrencyState(curr)
  }

  const currencyInfo = currencies[currency]

  const convertPrice = (amount: number, fromCurrency: Currency = "ILS"): number => {
    if (fromCurrency === currency) return amount
    
    // Convert to ILS first, then to target currency
    const amountInILS = amount / currencies[fromCurrency].rate
    return amountInILS * currencies[currency].rate
  }

  const formatPrice = (amount: number, showSymbol = true): string => {
    const convertedAmount = convertPrice(amount)
    const formatted = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(convertedAmount)

    if (showSymbol) {
      return `${currencyInfo.symbol}${formatted}`
    }
    return formatted
  }

  const value: CurrencyProviderState = {
    currency,
    setCurrency,
    currencyInfo,
    formatPrice,
    convertPrice,
  }

  return (
    <CurrencyProviderContext.Provider value={value}>
      {children}
    </CurrencyProviderContext.Provider>
  )
}

export const useCurrency = () => {
  const context = useContext(CurrencyProviderContext)

  if (context === undefined)
    throw new Error("useCurrency must be used within a CurrencyProvider")

  return context
}
