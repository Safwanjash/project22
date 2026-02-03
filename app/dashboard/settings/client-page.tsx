"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
    Store,
    User,
    Bell,
    Globe,
    Shield,
    Save,
    Plus,
    Trash2,
} from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"
import { useCurrency, type Currency } from "@/components/providers/currency-provider"
import Link from "next/link"
import type { User as UserType } from "@/lib/types"

interface SettingsClientPageProps {
    initialUsers: UserType[]
}

export default function SettingsClientPage({ initialUsers }: SettingsClientPageProps) {
    const { language, setLanguage, t, isRTL } = useLanguage()
    const { currency, setCurrency } = useCurrency()
    const [storeSettings, setStoreSettings] = useState({
        name: t("settings.myStore"),
        phone: "0501234567",
        email: "store@example.com",
        address: t("settings.storeAddress"),
    })

    const [notifications, setNotifications] = useState({
        newOrders: true,
        orderUpdates: true,
        lowStock: false,
        dailyReport: true,
    })

    // In a real app we'd save these to DB too, but for this task focused on CRUD entities, 
    // we'll keep local state for settings, but show real users.

    return (
        <div className="space-y-6 pt-12 lg:pt-0">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">{t("settings.title")}</h1>
                <p className="text-muted-foreground">{t("settings.subtitle")}</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Store Information */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                <Store className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">{t("settings.storeInfo")}</CardTitle>
                                <CardDescription>{t("settings.storeInfoDesc")}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="store-name">{t("settings.storeName")}</Label>
                            <Input
                                id="store-name"
                                value={storeSettings.name}
                                onChange={(e) =>
                                    setStoreSettings({ ...storeSettings, name: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="store-phone">{t("common.phone")}</Label>
                            <Input
                                id="store-phone"
                                value={storeSettings.phone}
                                onChange={(e) =>
                                    setStoreSettings({ ...storeSettings, phone: e.target.value })
                                }
                                dir="ltr"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="store-email">{t("common.email")}</Label>
                            <Input
                                id="store-email"
                                type="email"
                                value={storeSettings.email}
                                onChange={(e) =>
                                    setStoreSettings({ ...storeSettings, email: e.target.value })
                                }
                                dir="ltr"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="store-address">{t("common.address")}</Label>
                            <Input
                                id="store-address"
                                value={storeSettings.address}
                                onChange={(e) =>
                                    setStoreSettings({ ...storeSettings, address: e.target.value })
                                }
                            />
                        </div>
                        <Button className="w-full">
                            <Save className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                            {t("common.save")}
                        </Button>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-info/10">
                                <Bell className="h-5 w-5 text-info" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">{t("settings.notifications")}</CardTitle>
                                <CardDescription>{t("settings.notificationsDesc")}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>{t("settings.newOrders")}</Label>
                                <p className="text-sm text-muted-foreground">
                                    {t("settings.newOrdersDesc")}
                                </p>
                            </div>
                            <Switch
                                checked={notifications.newOrders}
                                onCheckedChange={(checked) =>
                                    setNotifications({ ...notifications, newOrders: checked })
                                }
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>{t("settings.orderUpdates")}</Label>
                                <p className="text-sm text-muted-foreground">
                                    {t("settings.orderUpdatesDesc")}
                                </p>
                            </div>
                            <Switch
                                checked={notifications.orderUpdates}
                                onCheckedChange={(checked) =>
                                    setNotifications({ ...notifications, orderUpdates: checked })
                                }
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>{t("settings.lowStock")}</Label>
                                <p className="text-sm text-muted-foreground">
                                    {t("settings.lowStockDesc")}
                                </p>
                            </div>
                            <Switch
                                checked={notifications.lowStock}
                                onCheckedChange={(checked) =>
                                    setNotifications({ ...notifications, lowStock: checked })
                                }
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>{t("settings.dailyReport")}</Label>
                                <p className="text-sm text-muted-foreground">
                                    {t("settings.dailyReportDesc")}
                                </p>
                            </div>
                            <Switch
                                checked={notifications.dailyReport}
                                onCheckedChange={(checked) =>
                                    setNotifications({ ...notifications, dailyReport: checked })
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Language Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-success/10">
                                <Globe className="h-5 w-5 text-success" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">{t("settings.languageAndRegion")}</CardTitle>
                                <CardDescription>{t("settings.languageAndRegionDesc")}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>{t("settings.language")}</Label>
                            <Select value={language} onValueChange={(value) => setLanguage(value as "ar" | "en")}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ar">{t("settings.arabic")}</SelectItem>
                                    <SelectItem value="en">{t("settings.english")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>{t("settings.currency")}</Label>
                            <Select value={currency} onValueChange={(value) => setCurrency(value as Currency)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ILS">{t("currencies.ils")} (₪)</SelectItem>
                                    <SelectItem value="USD">{t("currencies.usd")} ($)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>{t("settings.dateFormat")}</Label>
                            <Select defaultValue="gregorian">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="gregorian">{t("settings.gregorian")}</SelectItem>
                                    <SelectItem value="hijri">{t("settings.hijri")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* User Management */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-warning/10">
                                    <Shield className="h-5 w-5 text-warning" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">{t("settings.users")}</CardTitle>
                                    <CardDescription>{t("settings.usersDesc")}</CardDescription>
                                </div>
                            </div>
                            <Button size="sm" asChild>
                                <Link href="/dashboard/users">
                                    <Plus className={`h-4 w-4 ${isRTL ? "ml-1" : "mr-1"}`} />
                                    {t("settings.manageUsers")}
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {initialUsers.slice(0, 5).map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                                            <User className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge variant={user.role === "owner" ? "default" : "secondary"}>
                                            {user.role === "owner" ? t("roles.owner") : t("roles.employee")}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                            {initialUsers.length > 5 && (
                                <Button variant="link" asChild className="p-0 h-auto">
                                    <Link href="/dashboard/users">{t("common.viewAll")}</Link>
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
