"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { StatusBadge, type OrderStatus } from "@/components/dashboard/status-badge"
import { Plus, Search, Eye, Trash2 } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { AdvancedFilterPanel, getPresetSavedFilters, type FilterValues } from "@/components/dashboard/advanced-filter-panel"
import { useRouter } from "next/navigation"
import type { Order } from "@/lib/types"
import { PriceDisplay } from "@/components/dashboard/price-display"
import { useLanguage } from "@/components/providers/language-provider"
import { deleteOrder } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface OrdersClientPageProps {
    initialOrders: Order[]
}

export default function OrdersClientPage({ initialOrders }: OrdersClientPageProps) {
    const { t, isRTL, language } = useLanguage()
    const router = useRouter()
    const { toast } = useToast()
    const [orders, setOrders] = useState(initialOrders)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [advancedFilters, setAdvancedFilters] = useState<FilterValues>({})

    // Sync props
    useEffect(() => {
        setOrders(initialOrders)
    }, [initialOrders])

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.phone.includes(searchQuery)

        const matchesStatus =
            statusFilter === "all" || order.status === statusFilter

        // Advanced filters
        const matchesAdvanced =
            (!advancedFilters.status || order.status === advancedFilters.status) &&
            (!advancedFilters.paymentMethod || order.paymentMethod === advancedFilters.paymentMethod) &&
            (!advancedFilters.customer || order.customer.name.toLowerCase().includes(advancedFilters.customer.toLowerCase()))

        return matchesSearch && matchesStatus && matchesAdvanced
    })

    const handleDeleteOrder = async (id: string) => {
        const result = await deleteOrder(id)
        if (result.success) {
            setOrders(orders.filter(o => o.id !== id))
            toast({ title: t("common.success"), description: result.message })
        } else {
            toast({ title: t("common.error"), description: result.message, variant: "destructive" })
        }
    }

    return (
        <div className="space-y-6 pt-12 lg:pt-0">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{t("orders.title")}</h1>
                    <p className="text-muted-foreground">{t("orders.subtitle")}</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/orders/new">
                        <Plus className={isRTL ? "h-4 w-4 ml-2" : "h-4 w-4 mr-2"} />
                        {t("orders.newOrder")}
                    </Link>
                </Button>
            </div>

            {/* Advanced Filters */}
            <AdvancedFilterPanel
                onFilterChange={setAdvancedFilters}
                savedFilters={getPresetSavedFilters(t)}
            />

            {/* Quick Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="relative flex-1">
                            <Search className={isRTL ? "absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" : "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"} />
                            <Input
                                placeholder={t("orders.searchPlaceholder")}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={isRTL ? "pr-10" : "pl-10"}
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder={t("orders.status")} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t("orders.allStatuses")}</SelectItem>
                                <SelectItem value="new">{t("status.new")}</SelectItem>
                                <SelectItem value="processing">{t("status.processing")}</SelectItem>
                                <SelectItem value="with_delivery">{t("status.with_delivery")}</SelectItem>
                                <SelectItem value="delivered">{t("status.delivered")}</SelectItem>
                                <SelectItem value="returned">{t("status.returned")}</SelectItem>
                                <SelectItem value="canceled">{t("status.canceled")}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Orders Table */}
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg">
                        {t("orders.history")} ({filteredOrders.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className={isRTL ? "text-right" : "text-left"}>{t("orders.orderNumber")}</TableHead>
                                    <TableHead className={isRTL ? "text-right" : "text-left"}>{t("orders.customer")}</TableHead>
                                    <TableHead className={isRTL ? "text-right" : "text-left"}>{t("common.phone")}</TableHead>
                                    <TableHead className={isRTL ? "text-right" : "text-left"}>{t("orders.status")}</TableHead>
                                    <TableHead className={isRTL ? "text-right" : "text-left"}>{t("orders.paymentMethod")}</TableHead>
                                    <TableHead className={isRTL ? "text-right" : "text-left"}>{t("orders.deliveryCompany")}</TableHead>
                                    <TableHead className={isRTL ? "text-right" : "text-left"}>{t("orders.total")}</TableHead>
                                    <TableHead className={isRTL ? "text-right" : "text-left"}>{t("orders.date")}</TableHead>
                                    <TableHead className="w-12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">
                                            {order.orderNumber}
                                        </TableCell>
                                        <TableCell>{order.customer.name}</TableCell>
                                        <TableCell dir="ltr" className={isRTL ? "text-right" : "text-left"}>
                                            {order.customer.phone}
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={order.status} />
                                        </TableCell>
                                        <TableCell>
                                            {order.paymentMethod === "cod"
                                                ? t("payments.cod")
                                                : t("payments.bankTransfer")}
                                        </TableCell>
                                        <TableCell>
                                            {order.deliveryCompany?.name || "-"}
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                            <PriceDisplay amount={order.total} />
                                        </TableCell>
                                        <TableCell className="text-muted-foreground whitespace-nowrap">
                                            {new Date(order.createdAt).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={`/dashboard/orders/${order.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>{t("common.delete")}</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                {t("confirm.delete")}
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDeleteOrder(order.id)}
                                                                className="bg-destructive hover:bg-destructive/90"
                                                            >
                                                                {t("common.delete")}
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredOrders.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={9} className="py-0">
                                            <EmptyState
                                                type="orders"
                                                onAction={() => router.push("/dashboard/orders/new")}
                                            />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
