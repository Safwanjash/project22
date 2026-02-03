"use client"

import React from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { useLanguage } from "@/components/providers/language-provider"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isRTL } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className={cn(
        "min-h-screen transition-all duration-300",
        isRTL ? "lg:mr-64" : "lg:ml-64"
      )}>
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
