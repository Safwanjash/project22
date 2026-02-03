"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, List, Users, Package } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"

export function QuickActions() {
  const { t } = useLanguage()

  const actions = [
    {
      title: t("quickActions.newOrder"),
      description: t("quickActions.newOrderDesc"),
      icon: Plus,
      href: "/dashboard/orders/new",
      variant: "default" as const,
    },
    {
      title: t("quickActions.allOrders"),
      description: t("quickActions.allOrdersDesc"),
      icon: List,
      href: "/dashboard/orders",
      variant: "secondary" as const,
    },
    {
      title: t("quickActions.customers"),
      description: t("quickActions.customersDesc"),
      icon: Users,
      href: "/dashboard/customers",
      variant: "secondary" as const,
    },
    {
      title: t("quickActions.products"),
      description: t("quickActions.productsDesc"),
      icon: Package,
      href: "/dashboard/products",
      variant: "secondary" as const,
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{t("quickActions.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((action) => (
            <Button
              key={action.href}
              asChild
              variant={action.variant}
              className="h-auto flex-col gap-2 p-4"
            >
              <Link href={action.href}>
                <action.icon className="h-5 w-5" />
                <span className="font-medium">{action.title}</span>
                <span className="text-xs opacity-70">{action.description}</span>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
