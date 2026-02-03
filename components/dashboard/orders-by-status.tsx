"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { orders } from "@/lib/mock-data"
import type { OrderStatus } from "@/components/dashboard/status-badge"
import { useLanguage } from "@/components/providers/language-provider"

export function OrdersByStatus() {
  const { t } = useLanguage()

  const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
    new: { label: t("status.new"), color: "bg-info" },
    processing: { label: t("status.processing"), color: "bg-warning" },
    with_delivery: { label: t("status.with_delivery"), color: "bg-primary" },
    delivered: { label: t("status.delivered"), color: "bg-success" },
    returned: { label: t("status.returned"), color: "bg-destructive" },
    canceled: { label: t("status.canceled"), color: "bg-muted-foreground" },
  }

  const statusCounts = orders.reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    },
    {} as Record<OrderStatus, number>
  )

  const totalOrders = orders.length

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{t("orders.orderStatus")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {(Object.keys(statusConfig) as OrderStatus[]).map((status) => {
            const count = statusCounts[status] || 0
            const percentage = totalOrders > 0 ? (count / totalOrders) * 100 : 0

            return (
              <div key={status} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {statusConfig[status].label}
                  </span>
                  <span className="font-medium">{count}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${statusConfig[status].color}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
