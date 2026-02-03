"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Truck,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Store,
  Menu,
  X,
  UserCog,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useLanguage } from "@/components/providers/language-provider"
import { SettingsBar } from "@/components/dashboard/settings-toggles"

type NavKey = "dashboard" | "orders" | "customers" | "products" | "delivery" | "payments" | "reports" | "users" | "settings"

const navItems: { key: NavKey; href: string; icon: typeof LayoutDashboard }[] = [
  { key: "dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "orders", href: "/dashboard/orders", icon: ShoppingCart },
  { key: "customers", href: "/dashboard/customers", icon: Users },
  { key: "products", href: "/dashboard/products", icon: Package },
  { key: "delivery", href: "/dashboard/delivery", icon: Truck },
  { key: "payments", href: "/dashboard/payments", icon: CreditCard },
  { key: "reports", href: "/dashboard/reports", icon: BarChart3 },
  { key: "users", href: "/dashboard/users", icon: UserCog },
  { key: "settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { t, language, isRTL } = useLanguage()

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "fixed top-4 z-50 lg:hidden",
          isRTL ? "right-4" : "left-4"
        )}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 z-40 h-screen w-64 bg-sidebar border-sidebar-border transition-transform duration-300",
          isRTL 
            ? "right-0 border-l lg:translate-x-0" 
            : "left-0 border-r lg:translate-x-0",
          isRTL
            ? (isMobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0")
            : (isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
                <Store className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-sidebar-foreground">{t("common.storeName")}</h1>
                <p className="text-xs text-muted-foreground">{t("common.dashboard")}</p>
              </div>
            </div>
          </div>

          {/* Settings Bar */}
          <div className="flex items-center justify-center gap-1 p-2 border-b border-sidebar-border">
            <SettingsBar />
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/dashboard" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {t(`nav.${item.key}`)}
                </Link>
              )
            })}
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-5 w-5" />
              {t("common.logout")}
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
