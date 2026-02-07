"use client"

import { useState } from "react"
import { useLanguage } from "@/components/providers/language-provider"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Search,
    Download,
    Filter,
    UserPlus,
    Store,
    Settings,
    Shield,
    AlertTriangle,
    CheckCircle,
    XCircle,
    LogIn,
    RefreshCw,
    Check,
} from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type EventType =
    | "merchant_registration"
    | "merchant_approved"
    | "merchant_rejected"
    | "merchant_suspended"
    | "merchant_activated"
    | "admin_login"
    | "admin_created"
    | "settings_changed"
    | "system_alert"

interface ActivityEvent {
    id: number
    type: EventType
    description: string
    actor: string
    actorRole: string
    target?: string
    ipAddress: string
    timestamp: string
    metadata?: Record<string, string>
}

export default function ActivityLogsPage() {
    const { t, isRTL } = useLanguage()
    const [searchTerm, setSearchTerm] = useState("")
    const [eventFilter, setEventFilter] = useState<"all" | EventType>("all")
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

    const showToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    const activities: ActivityEvent[] = [
        {
            id: 1,
            type: "admin_login",
            description: "Admin logged in successfully",
            actor: "Mohammed Al-Rashid",
            actorRole: "Super Admin",
            ipAddress: "192.168.1.100",
            timestamp: "2024-01-15 14:32:15",
        },
        {
            id: 2,
            type: "merchant_approved",
            description: "Approved new merchant registration",
            actor: "Sara Al-Ketbi",
            actorRole: "Admin",
            target: "Gourmet Delights",
            ipAddress: "192.168.1.101",
            timestamp: "2024-01-15 14:25:00",
        },
        {
            id: 3,
            type: "merchant_registration",
            description: "New merchant registration submitted",
            actor: "System",
            actorRole: "System",
            target: "Sports Corner",
            ipAddress: "85.123.45.67",
            timestamp: "2024-01-15 13:45:22",
        },
        {
            id: 4,
            type: "settings_changed",
            description: "Platform commission rate updated from 5% to 4.5%",
            actor: "Mohammed Al-Rashid",
            actorRole: "Super Admin",
            ipAddress: "192.168.1.100",
            timestamp: "2024-01-15 12:30:00",
        },
        {
            id: 5,
            type: "merchant_suspended",
            description: "Merchant suspended due to policy violation",
            actor: "Ahmed Hassan",
            actorRole: "Support",
            target: "Beauty Pro",
            ipAddress: "192.168.1.102",
            timestamp: "2024-01-15 11:15:33",
        },
        {
            id: 6,
            type: "admin_created",
            description: "New admin account created",
            actor: "Mohammed Al-Rashid",
            actorRole: "Super Admin",
            target: "Noura Al-Shamsi",
            ipAddress: "192.168.1.100",
            timestamp: "2024-01-15 10:00:00",
        },
        {
            id: 7,
            type: "merchant_rejected",
            description: "Merchant registration rejected - incomplete documentation",
            actor: "Sara Al-Ketbi",
            actorRole: "Admin",
            target: "Quick Mart",
            ipAddress: "192.168.1.101",
            timestamp: "2024-01-14 16:45:00",
        },
        {
            id: 8,
            type: "system_alert",
            description: "High order volume detected - 500+ orders in last hour",
            actor: "System",
            actorRole: "System",
            ipAddress: "System",
            timestamp: "2024-01-14 15:30:00",
        },
        {
            id: 9,
            type: "merchant_activated",
            description: "Merchant account reactivated",
            actor: "Ahmed Hassan",
            actorRole: "Support",
            target: "Old Fashion Shop",
            ipAddress: "192.168.1.102",
            timestamp: "2024-01-14 14:20:00",
        },
        {
            id: 10,
            type: "admin_login",
            description: "Admin logged in successfully",
            actor: "Fatima Al-Mazrouei",
            actorRole: "Support",
            ipAddress: "192.168.1.103",
            timestamp: "2024-01-14 09:00:00",
        },
    ]

    const filteredActivities = activities.filter((activity) => {
        const matchesSearch =
            activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (activity.target && activity.target.toLowerCase().includes(searchTerm.toLowerCase()))
        const matchesFilter = eventFilter === "all" || activity.type === eventFilter
        return matchesSearch && matchesFilter
    })

    const getEventIcon = (type: EventType) => {
        switch (type) {
            case "merchant_registration":
                return <Store className="w-4 h-4" />
            case "merchant_approved":
                return <CheckCircle className="w-4 h-4 text-green-600" />
            case "merchant_rejected":
                return <XCircle className="w-4 h-4 text-red-600" />
            case "merchant_suspended":
                return <AlertTriangle className="w-4 h-4 text-amber-600" />
            case "merchant_activated":
                return <RefreshCw className="w-4 h-4 text-green-600" />
            case "admin_login":
                return <LogIn className="w-4 h-4 text-blue-600" />
            case "admin_created":
                return <UserPlus className="w-4 h-4 text-primary" />
            case "settings_changed":
                return <Settings className="w-4 h-4 text-purple-600" />
            case "system_alert":
                return <AlertTriangle className="w-4 h-4 text-red-600" />
            default:
                return <Shield className="w-4 h-4" />
        }
    }

    const getEventBadge = (type: EventType) => {
        const labels: Record<EventType, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
            merchant_registration: { label: t("admin.eventMerchantRegistration"), variant: "secondary" },
            merchant_approved: { label: t("admin.eventMerchantApproved"), variant: "default" },
            merchant_rejected: { label: t("admin.eventMerchantRejected"), variant: "destructive" },
            merchant_suspended: { label: t("admin.eventMerchantSuspended"), variant: "destructive" },
            merchant_activated: { label: t("admin.eventMerchantActivated"), variant: "default" },
            admin_login: { label: t("admin.eventAdminLogin"), variant: "outline" },
            admin_created: { label: t("admin.eventAdminCreated"), variant: "secondary" },
            settings_changed: { label: t("admin.eventSettingsChanged"), variant: "secondary" },
            system_alert: { label: t("admin.eventSystemAlert"), variant: "destructive" },
        }
        const { label, variant } = labels[type]
        return <Badge variant={variant}>{label}</Badge>
    }

    const eventTypes: { value: "all" | EventType; label: string }[] = [
        { value: "all", label: t("common.all") },
        { value: "merchant_registration", label: t("admin.eventMerchantRegistration") },
        { value: "merchant_approved", label: t("admin.eventMerchantApproved") },
        { value: "merchant_rejected", label: t("admin.eventMerchantRejected") },
        { value: "merchant_suspended", label: t("admin.eventMerchantSuspended") },
        { value: "merchant_activated", label: t("admin.eventMerchantActivated") },
        { value: "admin_login", label: t("admin.eventAdminLogin") },
        { value: "admin_created", label: t("admin.eventAdminCreated") },
        { value: "settings_changed", label: t("admin.eventSettingsChanged") },
        { value: "system_alert", label: t("admin.eventSystemAlert") },
    ]

    const handleExport = () => {
        const headers = ["ID", "Timestamp", "Event Type", "Description", "Actor", "Role", "Target", "IP Address"]
        const csvContent = [
            headers.join(","),
            ...filteredActivities.map(activity => [
                activity.id,
                `"${activity.timestamp}"`,
                activity.type,
                `"${activity.description}"`,
                `"${activity.actor}"`,
                `"${activity.actorRole}"`,
                `"${activity.target || ''}"`,
                activity.ipAddress
            ].join(","))
        ].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = `activity_logs_${new Date().toISOString().split("T")[0]}.csv`
        link.click()
        showToast(`${t("common.export")}: ${filteredActivities.length} ${t("admin.totalEvents").toLowerCase()}`)
    }

    return (
        <div className="space-y-8">
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
                    <h1 className="text-3xl font-bold">{t("admin.activityLogs")}</h1>
                    <p className="text-muted-foreground">{t("admin.activityLogsDesc")}</p>
                </div>
                <Button variant="outline" onClick={handleExport}>
                    <Download className="w-4 h-4 mr-2" />
                    {t("common.export")}
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className={cn(
                        "absolute top-3 w-5 h-5 text-muted-foreground",
                        isRTL ? "right-3" : "left-3"
                    )} />
                    <Input
                        placeholder={t("admin.searchLogs")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={isRTL ? "pr-10 text-right" : "pl-10"}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-muted-foreground" />
                    <Select value={eventFilter} onValueChange={(v) => setEventFilter(v as any)}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder={t("admin.filterByEvent")} />
                        </SelectTrigger>
                        <SelectContent>
                            {eventTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Activity Log Table */}
            <Card className="border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("admin.timestamp")}</th>
                                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("admin.eventType")}</th>
                                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("admin.description")}</th>
                                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("admin.actor")}</th>
                                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("admin.ipAddress")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredActivities.map((activity) => (
                                <tr
                                    key={activity.id}
                                    className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                >
                                    <td className={cn("py-3 px-4 text-muted-foreground text-xs whitespace-nowrap", isRTL ? "text-right" : "text-left")}>
                                        {activity.timestamp}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            {getEventIcon(activity.type)}
                                            {getEventBadge(activity.type)}
                                        </div>
                                    </td>
                                    <td className={cn("py-3 px-4", isRTL ? "text-right" : "text-left")}>
                                        <p className="font-medium">{activity.description}</p>
                                        {activity.target && (
                                            <p className="text-xs text-muted-foreground">
                                                {t("admin.target")}: {activity.target}
                                            </p>
                                        )}
                                    </td>
                                    <td className={cn("py-3 px-4", isRTL ? "text-right" : "text-left")}>
                                        <p className="font-medium">{activity.actor}</p>
                                        <p className="text-xs text-muted-foreground">{activity.actorRole}</p>
                                    </td>
                                    <td className={cn("py-3 px-4 text-muted-foreground text-xs font-mono", isRTL ? "text-right" : "text-left")}>
                                        {activity.ipAddress}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Summary Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="p-6 border-slate-200 dark:border-slate-800">
                    <p className="text-sm text-muted-foreground mb-2">{t("admin.totalEvents")}</p>
                    <p className="text-2xl font-bold text-primary">{activities.length}</p>
                    <p className="text-xs text-muted-foreground mt-2">{t("admin.last24Hours")}</p>
                </Card>
                <Card className="p-6 border-slate-200 dark:border-slate-800">
                    <p className="text-sm text-muted-foreground mb-2">{t("admin.merchantEvents")}</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {activities.filter(a => a.type.startsWith("merchant_")).length}
                    </p>
                </Card>
                <Card className="p-6 border-slate-200 dark:border-slate-800">
                    <p className="text-sm text-muted-foreground mb-2">{t("admin.adminEvents")}</p>
                    <p className="text-2xl font-bold text-purple-600">
                        {activities.filter(a => a.type.startsWith("admin_") || a.type === "settings_changed").length}
                    </p>
                </Card>
                <Card className="p-6 border-slate-200 dark:border-slate-800">
                    <p className="text-sm text-muted-foreground mb-2">{t("admin.systemAlerts")}</p>
                    <p className="text-2xl font-bold text-red-600">
                        {activities.filter(a => a.type === "system_alert").length}
                    </p>
                </Card>
            </div>
        </div>
    )
}
