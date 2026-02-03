"use client"

import { useState, useActionState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, AlertTriangle, Phone, MapPin, ShoppingCart, Loader2, Trash2 } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { CustomerRiskIndicator } from "@/components/dashboard/customer-risk-indicator"
import { createCustomer, deleteCustomer } from "@/app/actions"
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
import { useToast } from "@/hooks/use-toast"
import type { Customer, Order } from "@/lib/types"
import { PriceDisplay } from "@/components/dashboard/price-display"
import { useLanguage } from "@/components/providers/language-provider"

interface CustomersClientPageProps {
    initialCustomers: Customer[]
    initialOrders: Order[]
}

const initialState = {
    success: false,
    message: "",
    errors: undefined
}

export default function CustomersClientPage({ initialCustomers, initialOrders }: CustomersClientPageProps) {
    const { t, isRTL, language } = useLanguage()
    const { toast } = useToast()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [customers, setCustomers] = useState(initialCustomers)
    const [orders, setOrders] = useState(initialOrders)

    useEffect(() => {
        setCustomers(initialCustomers)
        setOrders(initialOrders)
    }, [initialCustomers, initialOrders])

    const [createState, createAction, isCreating] = useActionState(createCustomer, initialState)

    useEffect(() => {
        if (createState.success) {
            setIsCreateOpen(false)
            toast({ title: t("common.success"), description: createState.message, variant: "default" })
        } else if (createState.message) {
            toast({ title: t("common.error"), description: createState.message, variant: "destructive" })
        }
    }, [createState, toast])


    const filteredCustomers = customers.filter(
        (customer) =>
            customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.phone.includes(searchQuery) ||
            customer.city.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getCustomerOrders = (customerId: string) => {
        return orders.filter((order) => order.customer.id === customerId)
    }

    const handleDeleteCustomer = async (id: string) => {
        const result = await deleteCustomer(id)
        if (result.success) {
            setCustomers(customers.filter(c => c.id !== id))
            toast({ title: t("common.success"), description: result.message })
        } else {
            toast({ title: t("common.error"), description: result.message, variant: "destructive" })
        }
    }

    const isHighRisk = (customer: Customer) => {
        return customer.returnCount >= 3 || (customer.totalOrders > 0 && (customer.returnCount / customer.totalOrders) > 0.3)
    }

    return (
        <div className="space-y-6 pt-12 lg:pt-0">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{t("customers.title")}</h1>
                    <p className="text-muted-foreground">{t("customers.subtitle")}</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 ml-2" />
                            {t("customers.addCustomer")}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>{t("customers.addCustomer")}</DialogTitle>
                        </DialogHeader>
                        <form action={createAction} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="new-name">{t("customers.customerName")}</Label>
                                <Input id="new-name" name="name" placeholder={t("customers.customerName")} />
                                {createState.errors?.name && <p className="text-sm text-red-500">{createState.errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-phone">{t("common.phone")}</Label>
                                <Input id="new-phone" name="phone" placeholder="05xxxxxxxx" dir="ltr" />
                                {createState.errors?.phone && <p className="text-sm text-red-500">{createState.errors.phone}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-address">{t("common.address")}</Label>
                                <Input id="new-address" name="address" placeholder={t("common.address")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-city">{t("common.city")}</Label>
                                <Input id="new-city" name="city" placeholder={t("common.city")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-notes">{t("common.notes")}</Label>
                                <Textarea id="new-notes" name="notes" placeholder={t("customers.customerNotes")} />
                            </div>
                            <Button className="w-full" disabled={isCreating}>
                                {isCreating ? <Loader2 className="animate-spin" /> : t("customers.addCustomer")}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="p-4">
                    <div className="relative">
                        <Search className={isRTL ? "absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" : "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"} />
                        <Input
                            placeholder={t("customers.searchPlaceholder")}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={isRTL ? "pr-10" : "pl-10"}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Customers Table */}
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg">
                        {t("customers.title")} ({filteredCustomers.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className={isRTL ? "text-right" : "text-left"}>{t("common.name")}</TableHead>
                                    <TableHead className={isRTL ? "text-right" : "text-left"}>{t("common.phone")}</TableHead>
                                    <TableHead className={isRTL ? "text-right" : "text-left"}>{t("common.city")}</TableHead>
                                    <TableHead className={isRTL ? "text-right" : "text-left"}>{t("customers.totalOrders")}</TableHead>
                                    <TableHead className={isRTL ? "text-right" : "text-left"}>{t("dashboard.returns")}</TableHead>
                                    <TableHead className={isRTL ? "text-right" : "text-left"}>{t("common.status")}</TableHead>
                                    <TableHead className="w-24"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCustomers.map((customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell className="font-medium">{customer.name}</TableCell>
                                        <TableCell dir="ltr" className={isRTL ? "text-right" : "text-left"}>
                                            {customer.phone}
                                        </TableCell>
                                        <TableCell>{customer.city}</TableCell>
                                        <TableCell>{customer.totalOrders}</TableCell>
                                        <TableCell>
                                            {customer.returnCount > 0 ? (
                                                <span className="text-destructive font-medium">
                                                    {customer.returnCount}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">0</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {isHighRisk(customer) ? (
                                                <Badge variant="destructive" className="gap-1">
                                                    <AlertTriangle className="h-3 w-3" />
                                                    {t("customers.highRisk")}
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">{t("customers.lowRisk")}</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setSelectedCustomer(customer)}
                                                    >
                                                        {t("common.details")}
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-lg">
                                                    <DialogHeader>
                                                        <DialogTitle>{t("customers.customerDetails")}</DialogTitle>
                                                    </DialogHeader>
                                                    {selectedCustomer && (
                                                        <div className="space-y-6 py-4">
                                                            {/* Customer Risk Indicator */}
                                                            <CustomerRiskIndicator
                                                                data={{
                                                                    totalOrders: selectedCustomer.totalOrders,
                                                                    returnedOrders: selectedCustomer.returnCount,
                                                                    refusedDeliveries: 0
                                                                }}
                                                                showLabel={true}
                                                            />

                                                            {/* Customer Info */}
                                                            <div className="space-y-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                                                                        <span className="text-lg font-bold text-primary">
                                                                            {selectedCustomer.name.charAt(0)}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="font-bold text-lg">
                                                                            {selectedCustomer.name}
                                                                        </h3>
                                                                    </div>
                                                                </div>

                                                                <div className="grid gap-3">
                                                                    <div className="flex items-center gap-3 text-sm">
                                                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                                                        <span dir="ltr">{selectedCustomer.phone}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-3 text-sm">
                                                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                                                        <span>
                                                                            {selectedCustomer.address}، {selectedCustomer.city}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-3 text-sm">
                                                                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                                                                        <span>
                                                                            {selectedCustomer.totalOrders} {t("orders.title")} ({selectedCustomer.returnCount} {t("status.returned")})
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {selectedCustomer.notes && (
                                                                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                                                                        <p className="text-sm text-destructive">
                                                                            {selectedCustomer.notes}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Recent Orders */}
                                                            <div className="space-y-3">
                                                                <h4 className="font-semibold">{t("customers.lastOrder")}</h4>
                                                                <div className="space-y-2">
                                                                    {getCustomerOrders(selectedCustomer.id)
                                                                        .slice(0, 3)
                                                                        .map((order) => (
                                                                            <div
                                                                                key={order.id}
                                                                                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                                                                            >
                                                                                <div>
                                                                                    <p className="font-medium">
                                                                                        {order.orderNumber}
                                                                                    </p>
                                                                                    <p className="text-xs text-muted-foreground">
                                                                                        {new Date(order.createdAt).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}
                                                                                    </p>
                                                                                </div>
                                                                                <p className="font-semibold">
                                                                                    <PriceDisplay amount={order.total} />
                                                                                </p>
                                                                            </div>
                                                                        ))}
                                                                    {getCustomerOrders(selectedCustomer.id).length === 0 && (
                                                                        <p className="text-sm text-muted-foreground text-center py-4">
                                                                            {t("orders.noOrders")}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </DialogContent>
                                            </Dialog>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    >
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
                                                            onClick={() => handleDeleteCustomer(customer.id)}
                                                            className="bg-destructive hover:bg-destructive/90"
                                                        >
                                                            {t("common.delete")}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredCustomers.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="py-0">
                                            <EmptyState type="customers" />
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
