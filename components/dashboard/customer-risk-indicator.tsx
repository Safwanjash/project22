"use client"

import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { AlertTriangle, ShieldAlert, ShieldCheck, Info } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CustomerRiskData {
  totalOrders: number
  returnedOrders: number
  refusedDeliveries: number
  lastOrderDate?: string
}

type RiskLevel = "low" | "medium" | "high"

export function calculateRiskLevel(data: CustomerRiskData): { level: RiskLevel; reasons: string[] } {
  const reasons: string[] = []
  let riskScore = 0

  // Calculate return rate
  if (data.totalOrders > 0) {
    const returnRate = (data.returnedOrders / data.totalOrders) * 100
    
    if (returnRate > 30) {
      riskScore += 3
      reasons.push(`نسبة إرجاع عالية (${returnRate.toFixed(0)}%)`)
    } else if (returnRate > 15) {
      riskScore += 2
      reasons.push(`نسبة إرجاع متوسطة (${returnRate.toFixed(0)}%)`)
    }
  }

  // Check refused deliveries
  if (data.refusedDeliveries > 2) {
    riskScore += 2
    reasons.push(`رفض استلام متكرر (${data.refusedDeliveries} مرات)`)
  } else if (data.refusedDeliveries > 0) {
    riskScore += 1
    reasons.push(`رفض استلام (${data.refusedDeliveries} مرة)`)
  }

  // Determine risk level
  let level: RiskLevel = "low"
  if (riskScore >= 4) {
    level = "high"
  } else if (riskScore >= 2) {
    level = "medium"
  }

  return { level, reasons }
}

interface CustomerRiskIndicatorProps {
  data: CustomerRiskData
  showLabel?: boolean
  size?: "sm" | "md"
}

const riskConfig = {
  low: {
    icon: ShieldCheck,
    label: "عميل موثوق",
    badgeVariant: "outline" as const,
    className: "text-success border-success/30 bg-success/5"
  },
  medium: {
    icon: Info,
    label: "تنبيه متوسط",
    badgeVariant: "outline" as const,
    className: "text-warning-foreground border-warning/30 bg-warning/5"
  },
  high: {
    icon: ShieldAlert,
    label: "عميل عالي الخطورة",
    badgeVariant: "outline" as const,
    className: "text-destructive border-destructive/30 bg-destructive/5"
  }
}

export function CustomerRiskIndicator({ 
  data, 
  showLabel = false,
  size = "md"
}: CustomerRiskIndicatorProps) {
  const { level, reasons } = calculateRiskLevel(data)
  const config = riskConfig[level]
  const Icon = config.icon

  // Don't show anything for low risk unless explicitly requested
  if (level === "low" && !showLabel) {
    return null
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={config.badgeVariant} 
            className={cn(
              "gap-1 cursor-help",
              config.className,
              size === "sm" && "text-xs py-0"
            )}
          >
            <Icon className={cn("shrink-0", size === "sm" ? "w-3 h-3" : "w-4 h-4")} />
            {showLabel && <span>{config.label}</span>}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-2">
            <p className="font-semibold">{config.label}</p>
            {reasons.length > 0 ? (
              <ul className="text-sm space-y-1">
                {reasons.map((reason, index) => (
                  <li key={index} className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 shrink-0" />
                    {reason}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                سجل طلبات جيد - لا توجد مشاكل سابقة
              </p>
            )}
            <div className="text-xs text-muted-foreground pt-1 border-t">
              إجمالي الطلبات: {data.totalOrders} | المرتجعات: {data.returnedOrders}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Inline version for tables
export function CustomerRiskBadge({ data }: { data: CustomerRiskData }) {
  const { level } = calculateRiskLevel(data)
  
  if (level === "low") return null

  const config = riskConfig[level]
  const Icon = config.icon

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Icon className={cn(
            "w-4 h-4",
            level === "high" ? "text-destructive" : "text-warning-foreground"
          )} />
        </TooltipTrigger>
        <TooltipContent>
          {config.label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
