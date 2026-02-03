"use client"

import { useState } from "react"
import { useLanguage } from "@/components/providers/language-provider"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Search,
  MoreVertical,
  Eye,
  Lock,
  Unlock,
  Trash2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export default function MerchantsPage() {
  const { t, isRTL } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")

  const merchants = [
    {
      id: 1,
      name: "Ahmed Electronics",
      owner: "Ahmed Al-Mazrouei",
      email: "ahmed@electronics.ae",
      phone: "+971501234567",
      orders: 2543,
      revenue: 125000,
      status: "active",
      joinDate: "2023-01-15",
    },
    {
      id: 2,
      name: "Fashion Forward",
      owner: "Fatima Al-Ketbi",
      email: "fatima@fashionforward.ae",
      phone: "+971509876543",
      orders: 1876,
      revenue: 98500,
      status: "active",
      joinDate: "2023-02-20",
    },
    {
      id: 3,
      name: "Home & Living",
      owner: "Mohammed Al-Dhaheri",
      email: "mohammed@homelivng.ae",
      phone: "+971501111111",
      orders: 1654,
      revenue: 87300,
      status: "active",
      joinDate: "2023-03-10",
    },
    {
      id: 4,
      name: "Beauty Pro",
      owner: "Layla Al-Marri",
      email: "layla@beautypro.ae",
      phone: "+971502222222",
      orders: 1432,
      revenue: 76500,
      status: "suspended",
      joinDate: "2023-04-05",
    },
    {
      id: 5,
      name: "Tech Hub",
      owner: "Ali Al-Mansoori",
      email: "ali@techhub.ae",
      phone: "+971503333333",
      orders: 3210,
      revenue: 189000,
      status: "active",
      joinDate: "2023-05-12",
    },
  ]

  const filteredMerchants = merchants.filter(
    (merchant) =>
      merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t("admin.merchants")}</h1>
          <p className="text-muted-foreground">{t("admin.merchantsDesc")}</p>
        </div>
        <Button>{t("common.add")} {t("admin.merchants")}</Button>
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

      {/* Merchants Table */}
      <Card className="border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("admin.store")}</th>
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("admin.owner")}</th>
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("common.email")}</th>
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("orders.orderNumber")}</th>
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("common.status")}</th>
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("admin.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredMerchants.map((merchant) => (
                <tr
                  key={merchant.id}
                  className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{merchant.name}</td>
                  <td className={cn("py-3 px-4 text-muted-foreground", isRTL ? "text-right" : "text-left")}>{merchant.owner}</td>
                  <td className={cn("py-3 px-4 text-muted-foreground", isRTL ? "text-right" : "text-left")}>{merchant.email}</td>
                  <td className={cn("py-3 px-4", isRTL ? "text-right" : "text-left")}>{merchant.orders.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={merchant.status === "active" ? "default" : "secondary"}
                    >
                      {merchant.status === "active"
                        ? t("admin.active")
                        : t("admin.suspended")}
                    </Badge>
                  </td>
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
                          {t("admin.viewStore")}
                        </DropdownMenuItem>
                        {merchant.status === "active" ? (
                          <DropdownMenuItem className="text-destructive">
                            <Lock className="w-4 h-4 mr-2" />
                            {t("admin.disableStore")}
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-green-600">
                            <Unlock className="w-4 h-4 mr-2" />
                            {t("admin.enableStore")}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          {t("common.delete")}
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
          <p className="text-sm text-muted-foreground mb-2">{t("admin.totalMerchants")}</p>
          <p className="text-2xl font-bold text-primary">{merchants.length}</p>
          <p className="text-xs text-green-600 mt-2">100% {t("admin.active")}</p>
        </Card>
        <Card className="p-6 border-slate-200 dark:border-slate-800">
          <p className="text-sm text-muted-foreground mb-2">{t("common.total")} {t("orders.orderNumber")}</p>
          <p className="text-2xl font-bold text-primary">
            {merchants.reduce((sum, m) => sum + m.orders, 0).toLocaleString()}
          </p>
        </Card>
        <Card className="p-6 border-slate-200 dark:border-slate-800">
          <p className="text-sm text-muted-foreground mb-2">{t("admin.systemRevenue")}</p>
          <p className="text-2xl font-bold text-primary">
            ${merchants.reduce((sum, m) => sum + m.revenue, 0).toLocaleString()}
          </p>
        </Card>
        <Card className="p-6 border-slate-200 dark:border-slate-800">
          <p className="text-sm text-muted-foreground mb-2">{t("common.status")}</p>
          <p className="text-2xl font-bold text-primary">
            {merchants.filter(m => m.status === "active").length}/{merchants.length}
          </p>
          <p className="text-xs text-muted-foreground mt-2">{t("admin.active")}</p>
        </Card>
      </div>
    </div>
  )
}
