"use client"

import { useState } from "react"
import { useLanguage } from "@/components/providers/language-provider"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
  const { t, isRTL } = useLanguage()
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{t("nav.settings")}</h1>
        <p className="text-muted-foreground">{t("admin.settingsDesc")}</p>
      </div>

      {/* System Configuration */}
      <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-6">{t("settings.storeInfo")}</h3>
          <div className="space-y-4">
            <div className={cn("grid gap-4", isRTL ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2")}>
              <div className="space-y-2">
                <Label htmlFor="platform-name">{t("common.name")}</Label>
                <Input
                  id="platform-name"
                  placeholder="E-Commerce Management System"
                  defaultValue="E-Commerce Management System"
                  className={isRTL ? "text-right" : "text-left"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform-email">{t("common.email")}</Label>
                <Input
                  id="platform-email"
                  placeholder="admin@ecommerce.ae"
                  defaultValue="admin@ecommerce.ae"
                  type="email"
                  className={isRTL ? "text-right" : "text-left"}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="platform-phone">{t("common.phone")}</Label>
              <Input
                id="platform-phone"
                placeholder="+971-1-234-5678"
                defaultValue="+971-1-234-5678"
                className={isRTL ? "text-right" : "text-left"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="platform-address">{t("common.address")}</Label>
              <Input
                id="platform-address"
                placeholder="Dubai, UAE"
                defaultValue="Dubai, UAE"
                className={isRTL ? "text-right" : "text-left"}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Commission Settings */}
        <div>
          <h3 className="text-lg font-semibold mb-6">{t("settings.storeName")}</h3>
          <div className="space-y-4">
            <div className={cn("grid gap-4", isRTL ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2")}>
              <div className="space-y-2">
                <Label htmlFor="commission-percentage">
                  {t("common.discount")} %
                </Label>
                <Input
                  id="commission-percentage"
                  type="number"
                  placeholder="5"
                  defaultValue="5"
                  min="0"
                  max="100"
                  className={isRTL ? "text-right" : "text-left"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="min-order">
                  {t("common.minimum")} {t("common.amount")} ($)
                </Label>
                <Input
                  id="min-order"
                  type="number"
                  placeholder="10"
                  defaultValue="10"
                  min="0"
                  className={isRTL ? "text-right" : "text-left"}
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Business Hours */}
        <div>
          <h3 className="text-lg font-semibold mb-6">{t("common.date")}</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date-format">{t("settings.dateFormat")}</Label>
              <Select defaultValue="gregorian">
                <SelectTrigger id="date-format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gregorian">
                    {t("settings.gregorian")} (DD/MM/YYYY)
                  </SelectItem>
                  <SelectItem value="hijri">
                    {t("settings.hijri")} (HH/MM/YH)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Notifications */}
        <div>
          <h3 className="text-lg font-semibold mb-6">{t("settings.notifications")}</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <div>
                <p className="font-medium">{t("settings.emailNotifications")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("settings.newOrdersDesc")}
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <div>
                <p className="font-medium">{t("settings.smsNotifications")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("settings.orderUpdatesDesc")}
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <div>
                <p className="font-medium">{t("settings.pushNotifications")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("settings.lowStockDesc")}
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <div>
                <p className="font-medium">{t("settings.dailyReport")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("settings.dailyReportDesc")}
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        <Separator />

        {/* Save Button */}
        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? t("common.loading") : t("settings.saveSettings")}
          </Button>
          <Button variant="outline">{t("common.cancel")}</Button>
        </div>
      </Card>

      {/* Dangerous Zone */}
      <Card className="p-6 border-red-200 dark:border-red-900/30 space-y-4">
        <h3 className="text-lg font-semibold text-red-600">{t("common.actions")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("common.delete")} {t("common.total")} {t("common.data")}
        </p>
        <Button variant="destructive">
          {t("common.delete")} {t("common.total")} {t("common.data")}
        </Button>
      </Card>
    </div>
  )
}
