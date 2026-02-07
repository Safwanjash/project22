"use client"

import { useState } from "react"
import { useLanguage } from "@/components/providers/language-provider"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import {
  Building2,
  CreditCard,
  Bell,
  Shield,
  Globe,
  Check,
  Download,
} from "lucide-react"

interface PlatformSettings {
  platformName: string
  platformUrl: string
  supportEmail: string
  supportPhone: string
  platformDescription: string
  commissionRate: number
  minPayout: number
  payoutSchedule: string
  autoApproveMerchants: boolean
  requireVerification: boolean
  allowMerchantRegistration: boolean
  maxProductsPerMerchant: number
  defaultCurrency: string
  defaultTimezone: string
  dateFormat: string
  newMerchantNotification: boolean
  highVolumeAlerts: boolean
  systemReports: boolean
  securityAlerts: boolean
}

const initialSettings: PlatformSettings = {
  platformName: "E-Commerce Platform",
  platformUrl: "https://platform.ae",
  supportEmail: "support@platform.ae",
  supportPhone: "+971-800-PLATFORM",
  platformDescription: "A comprehensive e-commerce management platform for merchants.",
  commissionRate: 5,
  minPayout: 100,
  payoutSchedule: "weekly",
  autoApproveMerchants: false,
  requireVerification: true,
  allowMerchantRegistration: true,
  maxProductsPerMerchant: 1000,
  defaultCurrency: "aed",
  defaultTimezone: "gst",
  dateFormat: "dmy",
  newMerchantNotification: true,
  highVolumeAlerts: true,
  systemReports: true,
  securityAlerts: true,
}

export default function SettingsPage() {
  const { t, isRTL } = useLanguage()
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState<PlatformSettings>(initialSettings)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const updateSetting = <K extends keyof PlatformSettings>(key: K, value: PlatformSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setHasChanges(false)
    showToast(t("settings.saveSettings"))
  }

  const handleCancel = () => {
    setSettings(initialSettings)
    setHasChanges(false)
    showToast(t("common.cancel"), "error")
  }

  const handleExportSettings = () => {
    const settingsJson = JSON.stringify(settings, null, 2)
    const blob = new Blob([settingsJson], { type: "application/json" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `platform_settings_${new Date().toISOString().split("T")[0]}.json`
    link.click()
    showToast(t("common.export"))
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Toast Notification */}
      {toast && (
        <div className={cn(
          "fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transition-all",
          toast.type === "success"
            ? "bg-green-600 text-white"
            : "bg-red-600 text-white"
        )}>
          <Check className="w-4 h-4" />
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t("admin.platformSettings")}</h1>
          <p className="text-muted-foreground">{t("admin.platformSettingsDesc")}</p>
        </div>
        <Button variant="outline" onClick={handleExportSettings}>
          <Download className="w-4 h-4 mr-2" />
          {t("common.export")}
        </Button>
      </div>

      {/* Platform Information */}
      <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">{t("admin.platformInfo")}</h3>
        </div>
        <div className="space-y-4">
          <div className={cn("grid gap-4", "grid-cols-1 md:grid-cols-2")}>
            <div className="space-y-2">
              <Label htmlFor="platform-name">{t("admin.platformName")}</Label>
              <Input
                id="platform-name"
                value={settings.platformName}
                onChange={(e) => updateSetting("platformName", e.target.value)}
                className={isRTL ? "text-right" : "text-left"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="platform-url">{t("admin.platformUrl")}</Label>
              <Input
                id="platform-url"
                value={settings.platformUrl}
                onChange={(e) => updateSetting("platformUrl", e.target.value)}
                className={isRTL ? "text-right" : "text-left"}
              />
            </div>
          </div>
          <div className={cn("grid gap-4", "grid-cols-1 md:grid-cols-2")}>
            <div className="space-y-2">
              <Label htmlFor="support-email">{t("admin.supportEmail")}</Label>
              <Input
                id="support-email"
                value={settings.supportEmail}
                onChange={(e) => updateSetting("supportEmail", e.target.value)}
                type="email"
                className={isRTL ? "text-right" : "text-left"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-phone">{t("admin.supportPhone")}</Label>
              <Input
                id="support-phone"
                value={settings.supportPhone}
                onChange={(e) => updateSetting("supportPhone", e.target.value)}
                className={isRTL ? "text-right" : "text-left"}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="platform-description">{t("admin.platformDescription")}</Label>
            <Textarea
              id="platform-description"
              value={settings.platformDescription}
              onChange={(e) => updateSetting("platformDescription", e.target.value)}
              className={isRTL ? "text-right" : "text-left"}
              rows={3}
            />
          </div>
        </div>
      </Card>

      {/* Commission & Fees */}
      <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-green-500/10">
            <CreditCard className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold">{t("admin.commissionSettings")}</h3>
        </div>
        <div className="space-y-4">
          <div className={cn("grid gap-4", "grid-cols-1 md:grid-cols-2")}>
            <div className="space-y-2">
              <Label htmlFor="commission-rate">{t("admin.commissionRate")}</Label>
              <div className="relative">
                <Input
                  id="commission-rate"
                  type="number"
                  value={settings.commissionRate}
                  onChange={(e) => updateSetting("commissionRate", parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                  className={cn(isRTL ? "text-right pr-12" : "text-left pr-12")}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
              </div>
              <p className="text-xs text-muted-foreground">{t("admin.commissionRateDesc")}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="min-payout">{t("admin.minPayout")}</Label>
              <div className="relative">
                <Input
                  id="min-payout"
                  type="number"
                  value={settings.minPayout}
                  onChange={(e) => updateSetting("minPayout", parseFloat(e.target.value) || 0)}
                  min="0"
                  className={cn(isRTL ? "text-right pr-12" : "text-left pr-12")}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              </div>
              <p className="text-xs text-muted-foreground">{t("admin.minPayoutDesc")}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="payout-schedule">{t("admin.payoutSchedule")}</Label>
            <Select
              value={settings.payoutSchedule}
              onValueChange={(v) => updateSetting("payoutSchedule", v)}
            >
              <SelectTrigger id="payout-schedule">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">{t("admin.daily")}</SelectItem>
                <SelectItem value="weekly">{t("admin.weekly")}</SelectItem>
                <SelectItem value="biweekly">{t("admin.biweekly")}</SelectItem>
                <SelectItem value="monthly">{t("admin.monthly")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Merchant Settings */}
      <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold">{t("admin.merchantSettings")}</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <div>
              <p className="font-medium">{t("admin.autoApproveMerchants")}</p>
              <p className="text-sm text-muted-foreground">
                {t("admin.autoApproveMerchantsDesc")}
              </p>
            </div>
            <Switch
              checked={settings.autoApproveMerchants}
              onCheckedChange={(v) => updateSetting("autoApproveMerchants", v)}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <div>
              <p className="font-medium">{t("admin.requireVerification")}</p>
              <p className="text-sm text-muted-foreground">
                {t("admin.requireVerificationDesc")}
              </p>
            </div>
            <Switch
              checked={settings.requireVerification}
              onCheckedChange={(v) => updateSetting("requireVerification", v)}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <div>
              <p className="font-medium">{t("admin.allowMerchantRegistration")}</p>
              <p className="text-sm text-muted-foreground">
                {t("admin.allowMerchantRegistrationDesc")}
              </p>
            </div>
            <Switch
              checked={settings.allowMerchantRegistration}
              onCheckedChange={(v) => updateSetting("allowMerchantRegistration", v)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-products">{t("admin.maxProductsPerMerchant")}</Label>
            <Input
              id="max-products"
              type="number"
              value={settings.maxProductsPerMerchant}
              onChange={(e) => updateSetting("maxProductsPerMerchant", parseInt(e.target.value) || 0)}
              min="0"
              className={isRTL ? "text-right" : "text-left"}
            />
            <p className="text-xs text-muted-foreground">{t("admin.maxProductsDesc")}</p>
          </div>
        </div>
      </Card>

      {/* Localization */}
      <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <Globe className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold">{t("admin.localization")}</h3>
        </div>
        <div className="space-y-4">
          <div className={cn("grid gap-4", "grid-cols-1 md:grid-cols-2")}>
            <div className="space-y-2">
              <Label htmlFor="default-currency">{t("admin.defaultCurrency")}</Label>
              <Select
                value={settings.defaultCurrency}
                onValueChange={(v) => updateSetting("defaultCurrency", v)}
              >
                <SelectTrigger id="default-currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aed">AED - UAE Dirham</SelectItem>
                  <SelectItem value="usd">USD - US Dollar</SelectItem>
                  <SelectItem value="eur">EUR - Euro</SelectItem>
                  <SelectItem value="sar">SAR - Saudi Riyal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-timezone">{t("admin.defaultTimezone")}</Label>
              <Select
                value={settings.defaultTimezone}
                onValueChange={(v) => updateSetting("defaultTimezone", v)}
              >
                <SelectTrigger id="default-timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gst">GST (GMT+4) - Gulf Standard Time</SelectItem>
                  <SelectItem value="ast">AST (GMT+3) - Arabia Standard Time</SelectItem>
                  <SelectItem value="utc">UTC (GMT+0) - Coordinated Universal Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date-format">{t("settings.dateFormat")}</Label>
            <Select
              value={settings.dateFormat}
              onValueChange={(v) => updateSetting("dateFormat", v)}
            >
              <SelectTrigger id="date-format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <Bell className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-lg font-semibold">{t("admin.platformNotifications")}</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <div>
              <p className="font-medium">{t("admin.newMerchantNotification")}</p>
              <p className="text-sm text-muted-foreground">
                {t("admin.newMerchantNotificationDesc")}
              </p>
            </div>
            <Switch
              checked={settings.newMerchantNotification}
              onCheckedChange={(v) => updateSetting("newMerchantNotification", v)}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <div>
              <p className="font-medium">{t("admin.highVolumeAlerts")}</p>
              <p className="text-sm text-muted-foreground">
                {t("admin.highVolumeAlertsDesc")}
              </p>
            </div>
            <Switch
              checked={settings.highVolumeAlerts}
              onCheckedChange={(v) => updateSetting("highVolumeAlerts", v)}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <div>
              <p className="font-medium">{t("admin.systemReports")}</p>
              <p className="text-sm text-muted-foreground">
                {t("admin.systemReportsDesc")}
              </p>
            </div>
            <Switch
              checked={settings.systemReports}
              onCheckedChange={(v) => updateSetting("systemReports", v)}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <div>
              <p className="font-medium">{t("admin.securityAlerts")}</p>
              <p className="text-sm text-muted-foreground">
                {t("admin.securityAlertsDesc")}
              </p>
            </div>
            <Switch
              checked={settings.securityAlerts}
              onCheckedChange={(v) => updateSetting("securityAlerts", v)}
            />
          </div>
        </div>
      </Card>

      <Separator />

      {/* Save Button */}
      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={isSaving || !hasChanges}>
          {isSaving ? t("common.loading") : t("settings.saveSettings")}
        </Button>
        <Button variant="outline" onClick={handleCancel} disabled={!hasChanges}>
          {t("common.cancel")}
        </Button>
        {hasChanges && (
          <span className="text-sm text-amber-600 flex items-center">
            • {t("common.unsavedChanges") || "Unsaved changes"}
          </span>
        )}
      </div>
    </div>
  )
}
