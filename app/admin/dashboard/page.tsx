"use client"

import { useLanguage } from "@/components/providers/language-provider"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  Users,
  Store,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import Link from "next/link"

export default function AdminDashboardPage() {
  const { t } = useLanguage()

  // Sample data - in a real app, this would come from an API
  const kpis = [
    {
      title: t("admin.totalMerchants"),
      value: "1,234",
      change: 12,
      isPositive: true,
      icon: Store,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      title: t("admin.activeUsers"),
      value: "5,678",
      change: 8,
      isPositive: true,
      icon: Users,
      color: "bg-green-500/10 text-green-600 dark:text-green-400",
    },
    {
      title: t("admin.totalOrders"),
      value: "45,890",
      change: 23,
      isPositive: true,
      icon: BarChart3,
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
    {
      title: t("admin.systemRevenue"),
      value: "$125,430",
      change: 15,
      isPositive: true,
      icon: TrendingUp,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
  ]

  // Sample recent activity data
  const recentActivity = [
    {
      id: 1,
      type: "new_merchant",
      merchant: "Ahmad's Store",
      description: "New merchant registered",
      timestamp: "2 hours ago",
      status: "success",
    },
    {
      id: 2,
      type: "suspended_store",
      merchant: "Old Fashion Shop",
      description: "Store suspended due to inactivity",
      timestamp: "5 hours ago",
      status: "warning",
    },
    {
      id: 3,
      type: "new_order",
      merchant: "Tech Bazaar",
      description: "1,250 orders processed",
      timestamp: "1 day ago",
      status: "success",
    },
    {
      id: 4,
      type: "user_signup",
      merchant: "Multiple stores",
      description: "87 new users registered",
      timestamp: "1 day ago",
      status: "success",
    },
  ]

  // Sample merchants data
  const topMerchants = [
    {
      id: 1,
      name: "Ahmed Electronics",
      owner: "Ahmed Al-Mazrouei",
      orders: "2,543",
      status: "active",
      joined: "2023-01-15",
    },
    {
      id: 2,
      name: "Fashion Forward",
      owner: "Fatima Al-Ketbi",
      orders: "1,876",
      status: "active",
      joined: "2023-02-20",
    },
    {
      id: 3,
      name: "Home & Living",
      owner: "Mohammed Al-Dhaheri",
      orders: "1,654",
      status: "active",
      joined: "2023-03-10",
    },
    {
      id: 4,
      name: "Beauty Pro",
      owner: "Layla Al-Marri",
      orders: "1,432",
      status: "suspended",
      joined: "2023-04-05",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t("admin.welcome")}</h1>
          <p className="text-muted-foreground">{t("admin.overview")}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <Card key={idx} className="p-6 border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${kpi.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-sm font-medium">
                  {kpi.isPositive ? (
                    <ArrowUpRight className="w-4 h-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-600 dark:text-red-400" />
                  )}
                  <span
                    className={
                      kpi.isPositive ? "text-green-600" : "text-red-600"
                    }
                  >
                    {kpi.change}%
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-1">{kpi.title}</p>
              <p className="text-2xl font-bold">{kpi.value}</p>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-semibold mb-4">
              {t("admin.recentActivity")}
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 last:border-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm">{activity.merchant}</p>
                      <span className="text-xs text-muted-foreground">
                        {activity.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                  </div>
                  <Badge
                    variant={
                      activity.status === "success" ? "default" : "secondary"
                    }
                    className="flex-shrink-0"
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card className="border-slate-200 dark:border-slate-800 p-6">
            <h3 className="font-semibold mb-4">{t("admin.merchantsDesc")}</h3>
            <p className="text-3xl font-bold text-primary mb-2">1,234</p>
            <p className="text-sm text-muted-foreground mb-4">
              +125 this month
            </p>
            <Button asChild className="w-full">
              <Link href="/admin/dashboard/merchants">
                {t("admin.merchants")}
              </Link>
            </Button>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 p-6">
            <h3 className="font-semibold mb-4">{t("admin.usersDesc")}</h3>
            <p className="text-3xl font-bold text-primary mb-2">5,678</p>
            <p className="text-sm text-muted-foreground mb-4">
              +342 this month
            </p>
            <Button asChild className="w-full">
              <Link href="/admin/dashboard/users">
                {t("admin.users")}
              </Link>
            </Button>
          </Card>
        </div>
      </div>

      {/* Top Merchants Table */}
      <Card className="border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-lg font-semibold mb-4">{t("admin.merchants")}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="text-left py-3 px-4 font-medium">
                  {t("admin.store")}
                </th>
                <th className="text-left py-3 px-4 font-medium">
                  {t("admin.owner")}
                </th>
                <th className="text-left py-3 px-4 font-medium">
                  {t("orders.orderNumber")}
                </th>
                <th className="text-left py-3 px-4 font-medium">
                  {t("admin.registrationDate")}
                </th>
                <th className="text-left py-3 px-4 font-medium">
                  {t("admin.status")}
                </th>
                <th className="text-left py-3 px-4 font-medium">
                  {t("admin.actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {topMerchants.map((merchant) => (
                <tr
                  key={merchant.id}
                  className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="py-3 px-4 font-medium">{merchant.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {merchant.owner}
                  </td>
                  <td className="py-3 px-4">{merchant.orders}</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {merchant.joined}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        merchant.status === "active" ? "default" : "secondary"
                      }
                    >
                      {merchant.status === "active"
                        ? t("admin.active")
                        : t("admin.suspended")}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm">
                      {t("admin.viewStore")}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
