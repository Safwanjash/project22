"use client"

import React from "react"
import Link from "next/link"
import { useLanguage } from "@/components/providers/language-provider"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BarChart3,
  Settings,
  Users,
  Store,
  ShoppingCart,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isRTL, t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = [
    {
      label: t("nav.dashboard"),
      href: "/admin/dashboard",
      icon: BarChart3,
    },
    {
      label: t("admin.merchants"),
      href: "/admin/dashboard/merchants",
      icon: Store,
    },
    {
      label: t("admin.users"),
      href: "/admin/dashboard/users",
      icon: Users,
    },
    {
      label: t("nav.orders"),
      href: "/admin/dashboard/orders",
      icon: ShoppingCart,
    },
    {
      label: t("nav.reports"),
      href: "/admin/dashboard/reports",
      icon: BarChart3,
    },
    {
      label: t("nav.settings"),
      href: "/admin/dashboard/settings",
      icon: Settings,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 z-40">
        <h1 className="font-bold text-lg">{t("admin.title")}</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 w-64 h-screen bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo Area */}
        <div className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center px-6 hidden lg:flex">
          <h1 className="text-xl font-bold text-primary">
            {t("admin.title")}
          </h1>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-6 px-3">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 px-4",
                      isRTL && "flex-row-reverse"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                  </Button>
                </Link>
              )
            })}
          </nav>
        </ScrollArea>

        {/* Logout Button */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-4">
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start gap-3",
              isRTL && "flex-row-reverse"
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>{t("nav.logout")}</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "min-h-screen transition-all duration-300",
          isRTL ? "lg:mr-64" : "lg:ml-64",
          "pt-16 lg:pt-0"
        )}
      >
        <div className="p-4 lg:p-8">{children}</div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
