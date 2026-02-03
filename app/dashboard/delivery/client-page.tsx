"use client"

import { useState, useActionState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/dashboard/stat-card"
import { Plus, Edit, Truck, CheckCircle, RotateCcw, Clock, Phone, FileText, Loader2 } from "lucide-react"
import Link from "next/link"
import { createDeliveryCompany, updateDeliveryCompany, toggleDeliveryCompanyStatus } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import { PriceDisplay } from "@/components/dashboard/price-display"
import { useLanguage } from "@/components/providers/language-provider"
import type { DeliveryCompany, Order } from "@/lib/types"

interface DeliveryClientPageProps {
    initialCompanies: DeliveryCompany[]
    initialOrders: Order[]
}

const initialState = {
    success: false,
    message: "",
    errors: undefined
}

export default function DeliveryClientPage({ initialCompanies, initialOrders }: DeliveryClientPageProps) {
    const { t } = useLanguage()
    const { toast } = useToast()
    const [companies, setCompanies] = useState(initialCompanies)
    const [orders, setOrders] = useState(initialOrders)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingCompany, setEditingCompany] = useState<DeliveryCompany | null>(null)

    useEffect(() => {
        setCompanies(initialCompanies)
        setOrders(initialOrders)
    }, [initialCompanies, initialOrders])

    // Create Action
    const [createState, createAction, isCreating] = useActionState(createDeliveryCompany, initialState)

    useEffect(() => {
        if (createState.success) {
            setIsCreateOpen(false)
            toast({ title: t("common.success"), description: createState.message, variant: "default" })
        } else if (createState.message) {
            toast({ title: t("common.error"), description: createState.message, variant: "destructive" })
        }
    }, [createState, toast])

    // Update Action
    const [updateState, updateAction, isUpdating] = useActionState(updateDeliveryCompany, initialState)

    useEffect(() => {
        if (updateState.success) {
            setEditingCompany(null)
            toast({ title: t("common.success"), description: updateState.message, variant: "default" })
        } else if (updateState.message) {
            toast({ title: t("common.error"), description: updateState.message, variant: "destructive" })
        }
    }, [updateState, toast])


    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        // Optimistic
        setCompanies(companies.map(c => c.id === id ? { ...c, isActive: !currentStatus } : c))
        const result = await toggleDeliveryCompanyStatus(id)
        if (!result.success) {
            setCompanies(companies.map(c => c.id === id ? { ...c, isActive: currentStatus } : c))
            toast({ title: t("common.error"), description: result.message, variant: "destructive" })
        } else {
            toast({ title: t("common.success"), description: result.message })
        }
    }

    // Calculate delivery stats
    const deliveredOrders = orders.filter((o) => o.status === "delivered").length
    const returnedOrders = orders.filter((o) => o.status === "returned").length
    const pendingOrders = orders.filter((o) => o.status === "with_delivery").length
    const totalDeliveries = deliveredOrders + returnedOrders + pendingOrders

    const successRate =
        totalDeliveries > 0
            ? Math.round((deliveredOrders / totalDeliveries) * 100)
            : 0

    return (
        <div className="space-y-6 pt-12 lg:pt-0">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{t("delivery.title")}</h1>
                    <p className="text-muted-foreground">{t("delivery.subtitle")}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/delivery/daily-sheet">
                            <FileText className="h-4 w-4 ml-2" />
                            {t("delivery.dailySheet")}
                        </Link>
                    </Button>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 ml-2" />
                                {t("delivery.addCompany")}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>{t("delivery.addCompany")}</DialogTitle>
                            </DialogHeader>
                            <form action={createAction} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="company-name">{t("delivery.companyName")}</Label>
                                    <Input id="company-name" name="name" placeholder={t("delivery.companyName")} />
                                    {createState.errors?.name && <p className="text-sm text-red-500">{createState.errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="company-phone">{t("common.phone")}</Label>
                                    <Input id="company-phone" name="phone" placeholder="9200xxxxx" dir="ltr" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="company-cost">{t("reports.deliveryCosts")}</Label>
                                    <Input id="company-cost" name="cost" type="number" placeholder="0" dir="ltr" />
                                    {createState.errors?.cost && <p className="text-sm text-red-500">{createState.errors.cost}</p>}
                                </div>
                                <Button className="w-full" disabled={isCreating}>
                                    {isCreating ? <Loader2 className="animate-spin" /> : t("delivery.addCompany")}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title={t("dashboard.delivered")}
                    value={deliveredOrders}
                    icon={CheckCircle}
                    iconClassName="bg-success/10 text-success"
                />
                <StatCard
                    title={t("dashboard.returns")}
                    value={returnedOrders}
                    icon={RotateCcw}
                    iconClassName="bg-destructive/10 text-destructive"
                />
                <StatCard
                    title={t("delivery.activeOrders")}
                    value={pendingOrders}
                    icon={Truck}
                    iconClassName="bg-info/10 text-info"
                />
                <StatCard
                    title={t("delivery.successRate")}
                    value={`${successRate}%`}
                    icon={CheckCircle}
                    iconClassName="bg-primary/10 text-primary"
                />
            </div>

            {/* Delivery Companies */}
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg">{t("delivery.allCompanies")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t("delivery.companyName")}</TableHead>
                                    <TableHead>{t("delivery.contact")}</TableHead>
                                    <TableHead>{t("reports.deliveryCosts")}</TableHead>
                                    <TableHead>{t("common.status")}</TableHead>
                                    <TableHead className="w-32"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {companies.map((company) => (
                                    <TableRow key={company.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                                                    <Truck className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                                <span className="font-medium">{company.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                <span dir="ltr">{company.phone}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                            <PriceDisplay amount={company.cost} />
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={company.isActive ? "default" : "secondary"}>
                                                {company.isActive ? t("products.active") : t("products.inactive")}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Dialog open={editingCompany?.id === company.id} onOpenChange={(open) => !open && setEditingCompany(null)}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" onClick={() => setEditingCompany(company)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-md">
                                                        <DialogHeader>
                                                            <DialogTitle>{t("common.edit")}</DialogTitle>
                                                        </DialogHeader>
                                                        <form action={updateAction} className="space-y-4 py-4">
                                                            <input type="hidden" name="id" value={company.id} />
                                                            <div className="space-y-2">
                                                                <Label>{t("delivery.companyName")}</Label>
                                                                <Input name="name" defaultValue={company.name} />
                                                                {editingCompany?.id === company.id && updateState.errors?.name && <p className="text-sm text-red-500">{updateState.errors.name}</p>}
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>{t("common.phone")}</Label>
                                                                <Input name="phone" defaultValue={company.phone} dir="ltr" />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>{t("reports.deliveryCosts")}</Label>
                                                                <Input
                                                                    name="cost"
                                                                    type="number"
                                                                    defaultValue={company.cost}
                                                                    dir="ltr"
                                                                />
                                                                {editingCompany?.id === company.id && updateState.errors?.cost && <p className="text-sm text-red-500">{updateState.errors.cost}</p>}
                                                            </div>
                                                            <Button className="w-full" disabled={isUpdating}>
                                                                {isUpdating ? <Loader2 className="animate-spin" /> : t("common.save")}
                                                            </Button>
                                                        </form>
                                                    </DialogContent>
                                                </Dialog>
                                                <div className="flex items-center gap-2">
                                                    <Switch
                                                        checked={company.isActive}
                                                        onCheckedChange={() => handleToggleStatus(company.id, company.isActive)}
                                                    />
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
