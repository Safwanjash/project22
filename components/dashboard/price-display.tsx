"use client"

import { useCurrency } from "@/components/providers/currency-provider"

interface PriceDisplayProps {
    amount: number
    showSymbol?: boolean
    className?: string
}

export function PriceDisplay({ amount, showSymbol = true, className }: PriceDisplayProps) {
    const { formatPrice } = useCurrency()

    return (
        <span className={className}>
            {formatPrice(amount, showSymbol)}
        </span>
    )
}
