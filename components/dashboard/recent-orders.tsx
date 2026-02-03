"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { orders } from "@/lib/mock-data"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"
import { useCurrency } from "@/components/providers/currency-provider"

export function RecentOrders() {
  const { t, isRTL } = useLanguage()
  const { formatPrice } = useCurrency()
  const recentOrders = orders.slice(0, 5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg">{t("orders.recentOrders")}</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/orders" className="gap-2">
            {t("common.viewAll")}
            {isRTL ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="font-medium">{order.orderNumber}</span>
                  <span className="text-sm text-muted-foreground">
                    {order.customer.name}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={order.status} />
                <span className="font-semibold text-sm">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
