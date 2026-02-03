"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/dashboard/stat-card"
import { orders } from "@/lib/mock-data"
import {
  TrendingUp,
  ShoppingCart,
  CheckCircle,
  RotateCcw,
  Banknote,
  Percent,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useCurrency } from "@/components/providers/currency-provider"
import { useLanguage } from "@/components/providers/language-provider"
import { PriceDisplay } from "@/components/dashboard/price-display"

export default function ReportsPage() {
  const { formatPrice } = useCurrency()
  const { t, isRTL } = useLanguage()

  // Calculate stats
  const totalOrders = orders.length
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length
  const returnedOrders = orders.filter((o) => o.status === "returned").length
  const totalRevenue = orders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + o.total, 0)
  const deliveryRate = Math.round((deliveredOrders / totalOrders) * 100)
  const returnRate = Math.round((returnedOrders / totalOrders) * 100)

  // Translated sample data for charts
  const salesData = [
    { day: t("days.sat"), sales: 2400, orders: 12 },
    { day: t("days.sun"), sales: 1398, orders: 8 },
    { day: t("days.mon"), sales: 3800, orders: 18 },
    { day: t("days.tue"), sales: 3908, orders: 20 },
    { day: t("days.wed"), sales: 4800, orders: 24 },
    { day: t("days.thu"), sales: 3800, orders: 16 },
    { day: t("days.fri"), sales: 4300, orders: 22 },
  ]

  const monthlyData = [
    { month: t("months.jan"), revenue: 45000 },
    { month: t("months.feb"), revenue: 52000 },
    { month: t("months.mar"), revenue: 48000 },
    { month: t("months.apr"), revenue: 61000 },
    { month: t("months.may"), revenue: 55000 },
    { month: t("months.jun"), revenue: 67000 },
  ]

  const statusData = [
    { name: t("status.delivered"), value: deliveredOrders, color: "var(--success)" },
    { name: t("status.returned"), value: returnedOrders, color: "var(--destructive)" },
    { name: t("status.with_delivery"), value: orders.filter((o) => o.status === "with_delivery").length, color: "var(--info)" },
    { name: t("status.new"), value: orders.filter((o) => o.status === "new").length, color: "var(--primary)" },
  ]

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{t("charts.performance")}</h1>
        <p className="text-muted-foreground">{t("dashboard.welcome")}</p>
      </div>

      {/* Key Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title={t("nav.orders")}
          value={totalOrders}
          icon={ShoppingCart}
          iconClassName="bg-primary/10 text-primary"
        />
        <StatCard
          title={t("status.delivered")}
          value={deliveredOrders}
          icon={CheckCircle}
          iconClassName="bg-success/10 text-success"
        />
        <StatCard
          title={t("status.returned")}
          value={returnedOrders}
          icon={RotateCcw}
          iconClassName="bg-destructive/10 text-destructive"
        />
        <StatCard
          title={t("common.total")}
          value={<PriceDisplay amount={totalRevenue} />}
          icon={Banknote}
          iconClassName="bg-success/10 text-success"
        />
        <StatCard
          title={t("charts.deliverySuccess")}
          value={`${deliveryRate}%`}
          icon={Percent}
          iconClassName="bg-info/10 text-info"
        />
        <StatCard
          title={t("charts.returnRate")}
          value={`${returnRate}%`}
          icon={TrendingUp}
          iconClassName="bg-warning/10 text-warning"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily Sales Chart */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">{t("charts.dailySales")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.65 0.15 160)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="oklch(0.65 0.15 160)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0 0)" />
                  <XAxis
                    dataKey="day"
                    stroke="oklch(0.65 0 0)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="oklch(0.65 0 0)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.14 0 0)",
                      border: "1px solid oklch(0.22 0 0)",
                      borderRadius: "8px",
                      direction: isRTL ? "rtl" : "ltr",
                    }}
                    labelStyle={{ color: "oklch(0.95 0 0)" }}
                    formatter={(value: number) => [formatPrice(value), t("charts.sales")]}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="oklch(0.65 0.15 160)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Revenue Chart */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">{t("charts.monthlyRevenue")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0 0)" />
                  <XAxis
                    dataKey="month"
                    stroke="oklch(0.65 0 0)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="oklch(0.65 0 0)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.14 0 0)",
                      border: "1px solid oklch(0.22 0 0)",
                      borderRadius: "8px",
                      direction: isRTL ? "rtl" : "ltr",
                    }}
                    labelStyle={{ color: "oklch(0.95 0 0)" }}
                    formatter={(value: number) => [formatPrice(value), t("charts.revenue")]}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="oklch(0.65 0.15 160)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Status Distribution */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">{t("charts.orderStatus")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.14 0 0)",
                      border: "1px solid oklch(0.22 0 0)",
                      borderRadius: "8px",
                      direction: isRTL ? "rtl" : "ltr",
                    }}
                    formatter={(value: number, name: string) => [value, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {statusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                  <span className={isRTL ? "text-sm font-medium mr-auto" : "text-sm font-medium ml-auto"}>{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">{t("charts.performance")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Delivery Rate */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("charts.deliverySuccess")}</span>
                  <span className="font-semibold text-success">{deliveryRate}%</span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-success transition-all"
                    style={{ width: `${deliveryRate}%` }}
                  />
                </div>
              </div>

              {/* Return Rate */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("charts.returnRate")}</span>
                  <span className="font-semibold text-destructive">{returnRate}%</span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-destructive transition-all"
                    style={{ width: `${returnRate}%` }}
                  />
                </div>
              </div>

              {/* Revenue Goal */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("charts.revenueGoal")}</span>
                  <span className="font-semibold">
                    <PriceDisplay amount={totalRevenue} /> / <PriceDisplay amount={10000} />
                  </span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${Math.min((totalRevenue / 10000) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">{t("charts.avgOrderValue")}</p>
                  <p className="text-2xl font-bold">
                    {totalOrders > 0 ? (
                      <PriceDisplay
                        amount={Math.round(
                          orders.reduce((sum, o) => sum + o.total, 0) / totalOrders
                        )}
                      />
                    ) : (
                      <PriceDisplay amount={0} />
                    )}

                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">{t("charts.estimatedNetRevenue")}</p>
                  <p className="text-2xl font-bold text-success">
                    <PriceDisplay amount={Math.round(totalRevenue * 0.85)} />
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
