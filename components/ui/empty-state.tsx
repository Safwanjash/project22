"use client"

import { Button } from "@/components/ui/button"
import { Package, Users, ShoppingCart, Truck, BarChart3, FileText, CreditCard, Type as type, LucideIcon } from "lucide-react"

interface EmptyStateProps {
  type: "orders" | "customers" | "products" | "delivery" | "reports" | "payments" | "users" | "custom"
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  icon?: LucideIcon
}

const emptyStateConfig: Record<string, { icon: LucideIcon; title: string; description: string; actionLabel: string }> = {
  orders: {
    icon: ShoppingCart,
    title: "لا توجد طلبات بعد",
    description: "ابدأ بإنشاء أول طلب لك وتتبع مبيعاتك بسهولة",
    actionLabel: "إنشاء طلب جديد"
  },
  customers: {
    icon: Users,
    title: "لا يوجد عملاء بعد",
    description: "أضف عملاءك لتتمكن من إدارة طلباتهم بسهولة",
    actionLabel: "إضافة عميل جديد"
  },
  products: {
    icon: Package,
    title: "لا توجد منتجات بعد",
    description: "أضف منتجاتك لتسهيل إنشاء الطلبات",
    actionLabel: "إضافة منتج جديد"
  },
  delivery: {
    icon: Truck,
    title: "لا توجد شركات توصيل",
    description: "أضف شركات التوصيل التي تتعامل معها",
    actionLabel: "إضافة شركة توصيل"
  },
  reports: {
    icon: BarChart3,
    title: "لا توجد تقارير متاحة",
    description: "ستظهر التقارير هنا بعد إضافة بعض الطلبات",
    actionLabel: "إنشاء أول طلب"
  },
  payments: {
    icon: CreditCard,
    title: "لا توجد مدفوعات بعد",
    description: "ستظهر المدفوعات هنا عند إتمام الطلبات",
    actionLabel: "عرض الطلبات"
  },
  users: {
    icon: Users,
    title: "لا يوجد مستخدمين",
    description: "أضف مستخدمين لفريقك لإدارة المتجر معاً",
    actionLabel: "إضافة مستخدم"
  },
  custom: {
    icon: FileText,
    title: "لا توجد بيانات",
    description: "لا توجد بيانات لعرضها حالياً",
    actionLabel: "تحديث"
  }
}

export function EmptyState({ 
  type, 
  title, 
  description, 
  actionLabel, 
  onAction,
  icon: CustomIcon 
}: EmptyStateProps) {
  const config = emptyStateConfig[type]
  const Icon = CustomIcon || config.icon

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {title || config.title}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        {description || config.description}
      </p>
      {onAction && (
        <Button onClick={onAction}>
          {actionLabel || config.actionLabel}
        </Button>
      )}
    </div>
  )
}
