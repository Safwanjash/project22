"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle, WifiOff, ServerCrash, RefreshCw } from "lucide-react"

interface ErrorStateProps {
  type?: "network" | "server" | "general"
  title?: string
  description?: string
  onRetry?: () => void
  onSecondaryAction?: () => void
  secondaryActionLabel?: string
}

const errorConfig = {
  network: {
    icon: WifiOff,
    title: "خطأ في الاتصال",
    description: "تعذر الاتصال بالإنترنت. تأكد من اتصالك وحاول مرة أخرى."
  },
  server: {
    icon: ServerCrash,
    title: "خطأ في الخادم",
    description: "حدث خطأ غير متوقع. فريقنا يعمل على حل المشكلة."
  },
  general: {
    icon: AlertCircle,
    title: "حدث خطأ",
    description: "تعذر تحميل البيانات. حاول مرة أخرى."
  }
}

export function ErrorState({ 
  type = "general", 
  title, 
  description, 
  onRetry,
  onSecondaryAction,
  secondaryActionLabel = "تواصل مع الدعم"
}: ErrorStateProps) {
  const config = errorConfig[type]
  const Icon = config.icon

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-destructive" />
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {title || config.title}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        {description || config.description}
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        {onRetry && (
          <Button onClick={onRetry}>
            <RefreshCw className="w-4 h-4 ml-2" />
            إعادة المحاولة
          </Button>
        )}
        {onSecondaryAction && (
          <Button variant="outline" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
