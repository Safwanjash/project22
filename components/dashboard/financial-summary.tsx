"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Truck, 
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/providers/language-provider"
import { useCurrency } from "@/components/providers/currency-provider"

interface FinancialSummaryProps {
  totalRevenue: number
  deliveryCosts: number
  pendingCOD: number
  estimatedProfit: number
  previousPeriodProfit?: number
  period?: "today" | "week" | "month"
}

export function FinancialSummary({
  totalRevenue,
  deliveryCosts,
  pendingCOD,
  estimatedProfit,
  previousPeriodProfit,
  period = "month"
}: FinancialSummaryProps) {
  const { t } = useLanguage()
  const { formatPrice } = useCurrency()

  const periodLabels = {
    today: t("periods.today"),
    week: t("periods.thisWeek"),
    month: t("periods.thisMonth")
  }

  const profitChange = previousPeriodProfit 
    ? ((estimatedProfit - previousPeriodProfit) / previousPeriodProfit) * 100 
    : null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            {t("financial.summary")}
          </CardTitle>
          <Badge variant="secondary">{periodLabels[period]}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Profit Card */}
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t("financial.estimatedProfit")}</p>
              <p className="text-3xl font-bold text-primary mt-1">
                {formatPrice(estimatedProfit)}
              </p>
            </div>
            {profitChange !== null && (
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-sm",
                profitChange >= 0 
                  ? "bg-success/10 text-success" 
                  : "bg-destructive/10 text-destructive"
              )}>
                {profitChange >= 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {Math.abs(profitChange).toFixed(1)}%
              </div>
            )}
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <span className="text-sm">{t("financial.totalSales")}</span>
            </div>
            <span className="font-semibold text-success">
              +{formatPrice(totalRevenue)}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                <Truck className="w-4 h-4 text-destructive" />
              </div>
              <span className="text-sm">{t("financial.deliveryCosts")}</span>
            </div>
            <span className="font-semibold text-destructive">
              -{formatPrice(deliveryCosts)}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-warning-foreground" />
              </div>
              <div>
                <span className="text-sm">{t("financial.pendingCOD")}</span>
                <p className="text-xs text-muted-foreground">{t("financial.notCollectedYet")}</p>
              </div>
            </div>
            <span className="font-semibold text-warning-foreground">
              {formatPrice(pendingCOD)}
            </span>
          </div>
        </div>

        {/* Formula Explanation */}
        <div className="p-3 rounded-lg border border-dashed">
          <p className="text-xs text-muted-foreground text-center">
            {t("financial.profitFormula")}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// Compact version for dashboard
export function FinancialSummaryCompact({
  totalRevenue,
  deliveryCosts,
  pendingCOD,
  estimatedProfit
}: Omit<FinancialSummaryProps, 'period' | 'previousPeriodProfit'>) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-sm text-muted-foreground">المبيعات</span>
          </div>
          <p className="text-xl font-bold mt-1">{totalRevenue.toLocaleString()}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-destructive" />
            <span className="text-sm text-muted-foreground">التوصيل</span>
          </div>
          <p className="text-xl font-bold mt-1">{deliveryCosts.toLocaleString()}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-warning-foreground" />
            <span className="text-sm text-muted-foreground">COD معلق</span>
          </div>
          <p className="text-xl font-bold mt-1">{pendingCOD.toLocaleString()}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">الربح</span>
          </div>
          <p className="text-xl font-bold mt-1 text-primary">{estimatedProfit.toLocaleString()}</p>
        </CardContent>
      </Card>
    </div>
  )
}
