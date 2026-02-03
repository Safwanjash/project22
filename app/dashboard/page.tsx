"use client"

import { StatCard } from "@/components/dashboard/stat-card"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { OrdersByStatus } from "@/components/dashboard/orders-by-status"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { MerchantKPIs } from "@/components/dashboard/kpi-cards"
import { FinancialSummary } from "@/components/dashboard/financial-summary"
import { ActivityLog, sampleActivities } from "@/components/dashboard/activity-log"
import { QuickOrderForm, type QuickOrderData } from "@/components/dashboard/quick-order-form"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/components/providers/language-provider"
import { useCurrency } from "@/components/providers/currency-provider"
import {
  ShoppingCart,
  TrendingUp,
  Truck,
  RotateCcw,
} from "lucide-react"

export default function DashboardPage() {
  const { toast } = useToast()
  const { t } = useLanguage()
  const { formatPrice } = useCurrency()

  const handleQuickOrder = (order: QuickOrderData) => {
    toast({
      title: t("orders.createSuccess"),
      description: `${t("orders.newOrderFor")} ${order.customerName} - ${formatPrice(order.price)}`,
    })
  }

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("dashboard.welcome")}</h1>
          <p className="text-muted-foreground">{t("dashboard.overview")}</p>
        </div>
        <QuickOrderForm onSubmit={handleQuickOrder} />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("dashboard.todayOrders")}
          value="24"
          icon={ShoppingCart}
          trend={{ value: 12, isPositive: true }}
          iconClassName="bg-primary/10 text-primary"
        />
        <StatCard
          title={t("dashboard.todayRevenue")}
          value={formatPrice(4250)}
          icon={TrendingUp}
          trend={{ value: 8, isPositive: true }}
          iconClassName="bg-success/10 text-success"
        />
        <StatCard
          title={t("dashboard.delivered")}
          value="18"
          icon={Truck}
          trend={{ value: 5, isPositive: true }}
          iconClassName="bg-info/10 text-info"
        />
        <StatCard
          title={t("dashboard.returns")}
          value="2"
          icon={RotateCcw}
          trend={{ value: 3, isPositive: false }}
          iconClassName="bg-destructive/10 text-destructive"
        />
      </div>

      {/* KPIs */}
      <MerchantKPIs
        deliverySuccessRate={92}
        previousDeliveryRate={89}
        returnRate={8}
        previousReturnRate={10}
        pendingCOD={3450}
        estimatedRevenue={12500}
      />

      {/* Quick Actions */}
      <QuickActions />

      {/* Orders Overview & Financial Summary */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>
        <div className="space-y-6">
          <OrdersByStatus />
          <FinancialSummary
            totalRevenue={15000}
            deliveryCosts={1500}
            pendingCOD={3450}
            estimatedProfit={13500}
            previousPeriodProfit={12000}
            period="month"
          />
        </div>
      </div>

      {/* Activity Log */}
      <ActivityLog 
        activities={sampleActivities} 
        title={t("dashboard.recentActivities")}
        maxHeight="300px"
      />
    </div>
  )
}
