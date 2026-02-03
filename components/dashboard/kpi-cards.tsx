"use client"

import React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  CheckCircle,
  RotateCcw,
  Clock,
  Wallet
} from "lucide-react"
import { cn } from "@/lib/utils"

interface KPICardProps {
  title: string
  value: string | number
  suffix?: string
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  comparison?: string
  icon?: React.ReactNode
  variant?: "default" | "success" | "warning" | "danger"
}

const variantStyles = {
  default: {
    iconBg: "bg-primary/10",
    iconColor: "text-primary"
  },
  success: {
    iconBg: "bg-success/10",
    iconColor: "text-success"
  },
  warning: {
    iconBg: "bg-warning/10",
    iconColor: "text-warning-foreground"
  },
  danger: {
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive"
  }
}

export function KPICard({
  title,
  value,
  suffix,
  description,
  trend,
  comparison,
  icon,
  variant = "default"
}: KPICardProps) {
  const styles = variantStyles[variant]

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold">{value}</span>
              {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                {trend.value === 0 ? (
                  <Minus className="w-4 h-4 text-muted-foreground" />
                ) : trend.isPositive ? (
                  <TrendingUp className="w-4 h-4 text-success" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-destructive" />
                )}
                <span className={cn(
                  "text-sm",
                  trend.value === 0 
                    ? "text-muted-foreground"
                    : trend.isPositive ? "text-success" : "text-destructive"
                )}>
                  {trend.value > 0 && "+"}{trend.value}%
                </span>
                {comparison && (
                  <span className="text-xs text-muted-foreground mr-1">
                    {comparison}
                  </span>
                )}
              </div>
            )}
          </div>
          {icon && (
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
              styles.iconBg
            )}>
              <div className={styles.iconColor}>{icon}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Pre-built KPI set for merchants
interface MerchantKPIsProps {
  deliverySuccessRate: number
  previousDeliveryRate?: number
  returnRate: number
  previousReturnRate?: number
  pendingCOD: number
  estimatedRevenue: number
}

import { useLanguage } from "@/components/providers/language-provider"
import { useCurrency } from "@/components/providers/currency-provider"

export function MerchantKPIs({
  deliverySuccessRate,
  previousDeliveryRate,
  returnRate,
  previousReturnRate,
  pendingCOD,
  estimatedRevenue
}: MerchantKPIsProps) {
  const { t } = useLanguage()
  const { formatPrice, currencySymbol } = useCurrency()

  const deliveryTrend = previousDeliveryRate 
    ? deliverySuccessRate - previousDeliveryRate 
    : undefined

  const returnTrend = previousReturnRate
    ? returnRate - previousReturnRate
    : undefined

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        title={t("kpi.deliverySuccessRate")}
        value={deliverySuccessRate}
        suffix="%"
        icon={<CheckCircle className="w-5 h-5" />}
        variant={deliverySuccessRate >= 90 ? "success" : deliverySuccessRate >= 70 ? "warning" : "danger"}
        trend={deliveryTrend !== undefined ? {
          value: Math.round(deliveryTrend * 10) / 10,
          isPositive: deliveryTrend >= 0
        } : undefined}
        comparison={t("kpi.fromLastMonth")}
      />

      <KPICard
        title={t("kpi.returnRate")}
        value={returnRate}
        suffix="%"
        icon={<RotateCcw className="w-5 h-5" />}
        variant={returnRate <= 5 ? "success" : returnRate <= 15 ? "warning" : "danger"}
        trend={returnTrend !== undefined ? {
          value: Math.round(returnTrend * 10) / 10,
          isPositive: returnTrend <= 0
        } : undefined}
        comparison={t("kpi.fromLastMonth")}
        description={returnRate > 15 ? t("kpi.highReturnWarning") : undefined}
      />

      <KPICard
        title={t("kpi.pendingCOD")}
        value={pendingCOD.toLocaleString()}
        suffix={currencySymbol}
        icon={<Clock className="w-5 h-5" />}
        variant="warning"
        description={t("kpi.pendingCollection")}
      />

      <KPICard
        title={t("kpi.estimatedRevenue")}
        value={estimatedRevenue.toLocaleString()}
        suffix={currencySymbol}
        icon={<Wallet className="w-5 h-5" />}
        variant="default"
        description={t("kpi.afterDelivery")}
      />
    </div>
  )
}
