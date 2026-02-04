"use client"

import { useLanguage } from "@/components/providers/language-provider"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function ReportsPage() {
  const { t, isRTL } = useLanguage()

  const reports = [
    {
      title: t("reports.dailySales"),
      value: "$45,320",
      change: "+12%",
      isPositive: true,
      icon: TrendingUp,
    },
    {
      title: t("reports.monthlyRevenue"),
      value: "$145,800",
      change: "+8%",
      isPositive: true,
      icon: BarChart3,
    },
    {
      title: t("admin.totalMerchants"),
      value: "1,234",
      change: "+125",
      isPositive: true,
      icon: BarChart3,
    },
    {
      title: t("admin.activeUsers"),
      value: "5,678",
      change: "+342",
      isPositive: true,
      icon: BarChart3,
    },
  ]

  const monthlyData = [
    { month: "Jan", value: 45000 },
    { month: "Feb", value: 52000 },
    { month: "Mar", value: 48000 },
    { month: "Apr", value: 61000 },
    { month: "May", value: 55000 },
    { month: "Jun", value: 67000 },
  ]

  const topMerchants = [
    { name: "Ahmed Electronics", revenue: 125000, orders: 2543 },
    { name: "Tech Hub", revenue: 189000, orders: 3210 },
    { name: "Fashion Forward", revenue: 98500, orders: 1876 },
    { name: "Home & Living", revenue: 87300, orders: 1654 },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t("nav.reports")}</h1>
          <p className="text-muted-foreground">{t("admin.reportsDesc")}</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          {t("common.export")}
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {reports.map((report, idx) => {
          const Icon = report.icon
          return (
            <Card key={idx} className="p-6 border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {report.title}
                  </p>
                  <p className="text-2xl font-bold">{report.value}</p>
                </div>
                <Icon className="w-8 h-8 text-primary opacity-20" />
              </div>
              <p
                className={cn(
                  "text-sm font-medium",
                  report.isPositive ? "text-green-600" : "text-red-600"
                )}
              >
                {report.isPositive ? "+" : "-"} {report.change}
              </p>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Monthly Revenue */}
        <Card className="p-6 border-slate-200 dark:border-slate-800 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">
            {t("reports.monthlyRevenue")}
          </h3>
          <div className="space-y-4">
            {monthlyData.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{item.month}</span>
                  <span className="font-medium">
                    ${(item.value / 1000).toFixed(0)}K
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2 transition-all duration-300"
                    style={{ width: `${(item.value / 70000) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Period Selector */}
        <Card className="p-6 border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold mb-4">{t("filters.dateRange")}</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              {t("periods.thisMonth")}
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              {t("periods.lastMonth")}
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              {t("periods.thisYear")}
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              {t("filters.custom")}
            </Button>
          </div>
        </Card>
      </div>

      {/* Top Merchants */}
      <Card className="p-6 border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-semibold mb-4">{t("admin.merchants")}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>
                  {t("admin.store")}
                </th>
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>
                  {t("admin.systemRevenue")}
                </th>
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>
                  {t("orders.orderNumber")}
                </th>
              </tr>
            </thead>
            <tbody>
              {topMerchants.map((merchant, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>
                    {merchant.name}
                  </td>
                  <td className={cn("py-3 px-4", isRTL ? "text-right" : "text-left")}>
                    ${merchant.revenue.toLocaleString()}
                  </td>
                  <td className={cn("py-3 px-4", isRTL ? "text-right" : "text-left")}>
                    {merchant.orders.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Export Options */}
      <Card className="p-6 border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-semibold mb-4">{t("common.export")}</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <Button variant="outline" className="w-full">
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" className="w-full">
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Excel
          </Button>
        </div>
      </Card>
    </div>
  )
}
