"use client"

import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/providers/language-provider"

export type OrderStatus =
  | "new"
  | "processing"
  | "with_delivery"
  | "delivered"
  | "returned"
  | "canceled"

export type PaymentStatus = "paid" | "unpaid" | "partial"

interface StatusBadgeProps {
  status: OrderStatus | PaymentStatus
  type?: "order" | "payment"
  className?: string
}

export function StatusBadge({
  status,
  type = "order",
  className,
}: StatusBadgeProps) {
  const { t } = useLanguage()

  const orderStatusConfig: Record<
    OrderStatus,
    { label: string; className: string }
  > = {
    new: {
      label: t("status.new"),
      className: "bg-info/10 text-info border-info/20",
    },
    processing: {
      label: t("status.processing"),
      className: "bg-warning/10 text-warning border-warning/20",
    },
    with_delivery: {
      label: t("status.with_delivery"),
      className: "bg-primary/10 text-primary border-primary/20",
    },
    delivered: {
      label: t("status.delivered"),
      className: "bg-success/10 text-success border-success/20",
    },
    returned: {
      label: t("status.returned"),
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
    canceled: {
      label: t("status.canceled"),
      className: "bg-muted text-muted-foreground border-muted",
    },
  }

  const paymentStatusConfig: Record<
    PaymentStatus,
    { label: string; className: string }
  > = {
    paid: {
      label: t("status.paid"),
      className: "bg-success/10 text-success border-success/20",
    },
    unpaid: {
      label: t("status.unpaid"),
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
    partial: {
      label: t("status.partial_return"), // Or add status.partial to translations
      className: "bg-warning/10 text-warning border-warning/20",
    },
  }

  const config =
    type === "order"
      ? orderStatusConfig[status as OrderStatus]
      : paymentStatusConfig[status as PaymentStatus]

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
