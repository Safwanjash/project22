"use client"

import React from "react"

import { 
  CheckCircle, 
  Clock, 
  Package, 
  Truck, 
  XCircle, 
  RotateCcw,
  CreditCard,
  User,
  Edit,
  MessageSquare
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface TimelineEvent {
  id: string
  type: "created" | "status_change" | "payment" | "note" | "edit" | "return" | "cancel"
  title: string
  description?: string
  timestamp: string
  user?: string
  metadata?: {
    fromStatus?: string
    toStatus?: string
    reason?: string
    notes?: string
  }
}

interface OrderTimelineProps {
  events: TimelineEvent[]
  className?: string
}

const eventConfig: Record<string, { icon: React.ElementType; color: string; bgColor: string }> = {
  created: {
    icon: Package,
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  status_change: {
    icon: CheckCircle,
    color: "text-info",
    bgColor: "bg-info/10"
  },
  payment: {
    icon: CreditCard,
    color: "text-success",
    bgColor: "bg-success/10"
  },
  note: {
    icon: MessageSquare,
    color: "text-muted-foreground",
    bgColor: "bg-muted"
  },
  edit: {
    icon: Edit,
    color: "text-warning-foreground",
    bgColor: "bg-warning/10"
  },
  return: {
    icon: RotateCcw,
    color: "text-warning-foreground",
    bgColor: "bg-warning/10"
  },
  cancel: {
    icon: XCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10"
  }
}

export function OrderTimeline({ events, className }: OrderTimelineProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {events.map((event, index) => {
        const config = eventConfig[event.type] || eventConfig.note
        const Icon = config.icon
        const isLast = index === events.length - 1

        return (
          <div key={event.id} className="flex gap-4">
            {/* Timeline line and icon */}
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                config.bgColor
              )}>
                <Icon className={cn("w-5 h-5", config.color)} />
              </div>
              {!isLast && (
                <div className="w-0.5 flex-1 bg-border my-2" />
              )}
            </div>

            {/* Content */}
            <div className={cn("pb-6", isLast && "pb-0")}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium">{event.title}</span>
                {event.user && (
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {event.user}
                  </span>
                )}
              </div>
              
              {event.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {event.description}
                </p>
              )}

              {event.metadata?.reason && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">السبب: </span>
                    {event.metadata.reason}
                  </p>
                  {event.metadata.notes && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.metadata.notes}
                    </p>
                  )}
                </div>
              )}

              <time className="text-xs text-muted-foreground mt-2 block flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {event.timestamp}
              </time>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Sample data generator for demo
export function generateSampleTimeline(orderId: string): TimelineEvent[] {
  return [
    {
      id: "1",
      type: "created",
      title: "تم إنشاء الطلب",
      description: `تم إنشاء الطلب رقم ${orderId}`,
      timestamp: "2024-01-15 10:30 ص",
      user: "أحمد محمد"
    },
    {
      id: "2",
      type: "status_change",
      title: "تغيير الحالة",
      description: "تم تغيير الحالة من 'جديد' إلى 'قيد التجهيز'",
      timestamp: "2024-01-15 11:00 ص",
      user: "أحمد محمد"
    },
    {
      id: "3",
      type: "status_change",
      title: "تم التسليم للشحن",
      description: "تم تسليم الطلب لشركة التوصيل 'سمسا'",
      timestamp: "2024-01-15 02:30 م",
      user: "خالد علي"
    },
    {
      id: "4",
      type: "payment",
      title: "تم استلام الدفع",
      description: "تم استلام المبلغ نقداً عند الاستلام",
      timestamp: "2024-01-16 04:00 م",
      user: "مندوب التوصيل"
    },
    {
      id: "5",
      type: "status_change",
      title: "تم التوصيل",
      description: "تم توصيل الطلب بنجاح للعميل",
      timestamp: "2024-01-16 04:15 م",
      user: "مندوب التوصيل"
    }
  ]
}
