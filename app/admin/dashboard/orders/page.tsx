"use client"

import { useState } from "react"
import { useLanguage } from "@/components/providers/language-provider"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Search,
  Eye,
  MoreVertical,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export default function OrdersPage() {
  const { t, isRTL } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")

  const orders = [
    {
      id: "#ORD-001234",
      merchant: "Ahmed Electronics",
      customer: "Ahmed Al-Mansouri",
      amount: 1500,
      items: 3,
      status: "delivered",
      date: "2024-01-15",
    },
    {
      id: "#ORD-001233",
      merchant: "Fashion Forward",
      customer: "Fatima Al-Kaabi",
      amount: 850,
      items: 2,
      status: "with_delivery",
      date: "2024-01-14",
    },
    {
      id: "#ORD-001232",
      merchant: "Tech Hub",
      customer: "Mohammed Al-Shehhi",
      amount: 3200,
      items: 1,
      status: "processing",
      date: "2024-01-14",
    },
    {
      id: "#ORD-001231",
      merchant: "Home & Living",
      customer: "Layla Al-Mazrouei",
      amount: 2100,
      items: 5,
      status: "delivered",
      date: "2024-01-13",
    },
    {
      id: "#ORD-001230",
      merchant: "Beauty Pro",
      customer: "Sara Al-Khaleeli",
      amount: 650,
      items: 4,
      status: "returned",
      date: "2024-01-12",
    },
    {
      id: "#ORD-001229",
      merchant: "Ahmed Electronics",
      customer: "Ali Al-Muhairi",
      amount: 2750,
      items: 2,
      status: "delivered",
      date: "2024-01-11",
    },
  ]

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.merchant.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "default"
      case "processing":
        return "secondary"
      case "with_delivery":
        return "default"
      case "returned":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusLabel = (status: string) => {
    const statusKey = `status.${status}`
    return t(statusKey)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t("nav.orders")}</h1>
          <p className="text-muted-foreground">{t("admin.ordersDesc")}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className={cn(
          "absolute top-3 w-5 h-5 text-muted-foreground",
          isRTL ? "right-3" : "left-3"
        )} />
        <Input
          placeholder={t("common.search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={isRTL ? "pr-10 text-right" : "pl-10"}
        />
      </div>

      {/* Orders Table */}
      <Card className="border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("orders.orderNumber")}</th>
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("admin.store")}</th>
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("orders.customer")}</th>
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("orders.items")}</th>
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("common.total")}</th>
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("common.status")}</th>
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("common.date")}</th>
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("admin.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{order.id}</td>
                  <td className={cn("py-3 px-4 text-muted-foreground text-xs", isRTL ? "text-right" : "text-left")}>{order.merchant}</td>
                  <td className={cn("py-3 px-4", isRTL ? "text-right" : "text-left")}>{order.customer}</td>
                  <td className={cn("py-3 px-4", isRTL ? "text-right" : "text-left")}>{order.items}</td>
                  <td className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>${order.amount.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <Badge variant={getStatusColor(order.status) as any}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </td>
                  <td className={cn("py-3 px-4 text-muted-foreground text-xs", isRTL ? "text-right" : "text-left")}>{order.date}</td>
                  <td className="py-3 px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align={isRTL ? "start" : "end"}>
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          {t("common.view")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 border-slate-200 dark:border-slate-800">
          <p className="text-sm text-muted-foreground mb-2">{t("common.total")} {t("nav.orders")}</p>
          <p className="text-2xl font-bold text-primary">{orders.length}</p>
        </Card>
        <Card className="p-6 border-slate-200 dark:border-slate-800">
          <p className="text-sm text-muted-foreground mb-2">{t("common.total")} {t("common.amount")}</p>
          <p className="text-2xl font-bold text-primary">
            ${orders.reduce((sum, o) => sum + o.amount, 0).toLocaleString()}
          </p>
        </Card>
        <Card className="p-6 border-slate-200 dark:border-slate-800">
          <p className="text-sm text-muted-foreground mb-2">{t("status.delivered")}</p>
          <p className="text-2xl font-bold text-green-600">
            {orders.filter(o => o.status === "delivered").length}
          </p>
        </Card>
        <Card className="p-6 border-slate-200 dark:border-slate-800">
          <p className="text-sm text-muted-foreground mb-2">{t("status.processing")}</p>
          <p className="text-2xl font-bold text-amber-600">
            {orders.filter(o => o.status === "processing").length}
          </p>
        </Card>
      </div>
    </div>
  )
}
