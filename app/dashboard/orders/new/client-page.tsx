"use client"

import React, { useState, useActionState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Separator } from "@/components/ui/separator"
import { ArrowRight, Plus, Trash2, User, Package, Truck, CreditCard, Loader2 } from "lucide-react"
import { createOrder } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import { PriceDisplay } from "@/components/dashboard/price-display"
import { useLanguage } from "@/components/providers/language-provider"
import type { Customer, Product, DeliveryCompany } from "@/lib/types"

interface NewOrderClientPageProps {
    customers: Customer[]
    products: Product[]
    deliveryCompanies: DeliveryCompany[]
}

interface OrderItem {
    productId: string
    variantId?: string
    variantDetails?: string
    quantity: number
}

const initialState = {
    success: false,
    message: "",
    errors: undefined
}

export default function NewOrderClientPage({
    customers,
    products: initialProducts,
    deliveryCompanies: initialDeliveryCompanies
}: NewOrderClientPageProps) {
    const router = useRouter()
    const { t, isRTL } = useLanguage()
    const { toast } = useToast()

    const [selectedCustomer, setSelectedCustomer] = useState<string>("")
    const [orderItems, setOrderItems] = useState<OrderItem[]>([{ productId: "", quantity: 1 }])
    const [deliveryCompanyId, setDeliveryCompanyId] = useState<string>("")
    const [deliveryZone, setDeliveryZone] = useState<"west_bank" | "1948" | "jerusalem">("west_bank")
    const [paymentMethod, setPaymentMethod] = useState<string>("cod")
    const [notes, setNotes] = useState("")

    // New Customer State
    const [newCustomerName, setNewCustomerName] = useState("")
    const [newCustomerPhone, setNewCustomerPhone] = useState("")
    const [newCustomerAddress, setNewCustomerAddress] = useState("")
    const [newCustomerCity, setNewCustomerCity] = useState("")

    const activeProducts = initialProducts.filter((p) => p.isActive)
    const activeDeliveryCompanies = initialDeliveryCompanies.filter((d) => d.isActive)

    const addItem = () => {
        setOrderItems([...orderItems, { productId: "", quantity: 1 }])
    }

    const removeItem = (index: number) => {
        if (orderItems.length > 1) {
            setOrderItems(orderItems.filter((_, i) => i !== index))
        }
    }

    const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
        const newItems = [...orderItems]
        // @ts-ignore
        newItems[index] = { ...newItems[index], [field]: value }
        setOrderItems(newItems)
    }

    const calculateSubtotal = () => {
        return orderItems.reduce((sum, item) => {
            const product = initialProducts.find((p) => p.id === item.productId)
            let price = product?.price || 0

            // If variant is selected, use variant price
            if (item.variantId && product?.type === "variant" && product.variants) {
                const variant = product.variants.find(v => v.id === item.variantId)
                price = variant?.price || product.price
            }

            return sum + price * item.quantity
        }, 0)
    }

    const selectedDelivery = initialDeliveryCompanies.find((d) => d.id === deliveryCompanyId)
    let deliveryCost = 0
    if (selectedDelivery) {
        if (deliveryZone === "west_bank") deliveryCost = selectedDelivery.costWestBank || selectedDelivery.cost
        else if (deliveryZone === "1948") deliveryCost = selectedDelivery.cost1948 || 0
        else if (deliveryZone === "jerusalem") deliveryCost = selectedDelivery.costJerusalem || 0

        // Fallback
        if (isNaN(deliveryCost)) deliveryCost = selectedDelivery.cost || 0
    }
    const subtotal = calculateSubtotal()
    const total = subtotal + deliveryCost

    const [isLoading, setIsLoading] = useState(false)

    // Check if all variant products have variants selected
    const isFormValid = () => {
        return orderItems.every(item => {
            const product = initialProducts.find(p => p.id === item.productId)
            // If it's a variant product, it must have a variant selected
            if (product?.type === "variant") {
                return !!item.variantId
            }
            return true
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate that variant products have a variant selected
        for (const item of orderItems) {
            const product = initialProducts.find(p => p.id === item.productId)
            if (product?.type === "variant" && !item.variantId) {
                toast({
                    title: t("common.error"),
                    description: t("products.selectVariantRequired") || "Please select a variant for all variant products",
                    variant: "destructive"
                })
                return
            }
        }

        setIsLoading(true)

        try {
            const payload = {
                customerId: selectedCustomer,
                newCustomer: selectedCustomer === "new" ? {
                    name: newCustomerName,
                    phone: newCustomerPhone,
                    address: newCustomerAddress,
                    city: newCustomerCity
                } : undefined,
                items: orderItems,
                deliveryCompanyId,
                deliveryZone,
                paymentMethod: paymentMethod as "cod" | "bank_transfer",
                notes
            }

            const result = await createOrder(payload)

            if (result.success) {
                toast({ title: t("common.success"), description: result.message })
                router.push("/dashboard/orders")
            } else {
                toast({ title: t("common.error"), description: result.message, variant: "destructive" })
                if (result.errors) {
                    // Log errors or display them? Generic error toast is mostly enough for now unless specific field
                    console.error(result.errors)
                }
            }
        } catch (error) {
            toast({ title: t("common.error"), description: t("common.unexpectedError"), variant: "destructive" })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pt-12 lg:pt-0">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" type="button" asChild>
                    <Link href="/dashboard/orders">
                        <ArrowRight className={`h-5 w-5 ${isRTL ? "rotate-180" : ""}`} />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">{t("orders.newOrder")}</h1>
                    <p className="text-muted-foreground">{t("orders.createOrderDesc")}</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Customer Selection */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="h-5 w-5" />
                                {t("orders.customer")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>{t("orders.selectCustomerDesc")}</Label>
                                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t("orders.selectCustomer")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="new">{t("customers.newCustomer")}</SelectItem>
                                        {customers.map((customer) => (
                                            <SelectItem key={customer.id} value={customer.id}>
                                                {customer.name} - {customer.phone}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {selectedCustomer === "new" && (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">{t("customers.customerName")}</Label>
                                        <Input
                                            id="name"
                                            placeholder={t("customers.customerName")}
                                            required
                                            value={newCustomerName}
                                            onChange={(e) => setNewCustomerName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">{t("common.phone")}</Label>
                                        <Input
                                            id="phone"
                                            placeholder="05xxxxxxxx"
                                            dir="ltr"
                                            required
                                            value={newCustomerPhone}
                                            onChange={(e) => setNewCustomerPhone(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2 sm:col-span-2">
                                        <Label htmlFor="address">{t("common.address")}</Label>
                                        <Input
                                            id="address"
                                            placeholder={t("common.address")}
                                            required
                                            value={newCustomerAddress}
                                            onChange={(e) => setNewCustomerAddress(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="city">{t("common.city")}</Label>
                                        <Input
                                            id="city"
                                            placeholder={t("common.city")}
                                            required
                                            value={newCustomerCity}
                                            onChange={(e) => setNewCustomerCity(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Products */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                {t("orders.products")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {orderItems.map((item, index) => {
                                const selectedProduct = activeProducts.find(p => p.id === item.productId)

                                return (
                                    <div key={index} className="space-y-3 border-b pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
                                        <div className="flex gap-4 items-end">
                                            <div className="flex-1 space-y-2">
                                                <Label>{t("orders.product")}</Label>
                                                <Select
                                                    value={item.productId}
                                                    onValueChange={(value) => {
                                                        const newItems = [...orderItems]
                                                        // Reset variant when product changes
                                                        newItems[index] = {
                                                            ...newItems[index],
                                                            productId: value,
                                                            variantId: undefined,
                                                            variantDetails: undefined
                                                        }
                                                        setOrderItems(newItems)
                                                    }}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t("orders.selectProduct")} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {activeProducts.map((product) => (
                                                            <SelectItem key={product.id} value={product.id}>
                                                                {product.name} - <PriceDisplay amount={product.price} />
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="w-24 space-y-2">
                                                <Label>{t("orders.quantity")}</Label>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        updateItem(index, "quantity", parseInt(e.target.value) || 1)
                                                    }
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="mb-0.5"
                                                onClick={() => removeItem(index)}
                                                disabled={orderItems.length === 1}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {/* Variant Selection */}
                                        {selectedProduct && selectedProduct.type === "variant" && selectedProduct.variants && (
                                            <div className="space-y-2">
                                                <Label>{t("products.selectVariant")} <span className="text-destructive">*</span></Label>
                                                <Select
                                                    value={item.variantId}
                                                    onValueChange={(value) => {
                                                        const variant = selectedProduct.variants?.find(v => v.id === value)
                                                        if (variant) {
                                                            const newItems = [...orderItems]
                                                            newItems[index] = {
                                                                ...newItems[index],
                                                                variantId: value,
                                                                variantDetails: `${t("products.size")}: ${variant.size}, ${t("products.color")}: ${variant.color}`
                                                            }
                                                            setOrderItems(newItems)
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t("products.selectVariant")} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {selectedProduct.variants
                                                            .filter(v => v.isActive)
                                                            .map(variant => (
                                                                <SelectItem key={variant.id} value={variant.id}>
                                                                    {variant.size} - {variant.color}
                                                                    {variant.price && variant.price !== selectedProduct.price && (
                                                                        <span> - <PriceDisplay amount={variant.price} /></span>
                                                                    )}
                                                                </SelectItem>
                                                            ))
                                                        }
                                                    </SelectContent>
                                                </Select>
                                                {selectedProduct.variants.filter(v => v.isActive).length === 0 && (
                                                    <p className="text-sm text-destructive font-medium">
                                                        {t("products.noVariantsAvailable")}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                            <Button type="button" variant="outline" onClick={addItem} className="w-full bg-transparent">
                                <Plus className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                                {t("orders.addProduct")}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Notes */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg">{t("common.notes")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder={t("orders.orderNotesPlaceholder")}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Delivery */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Truck className="h-5 w-5" />
                                {t("orders.delivery")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>{t("delivery.zones.title") || "المنطقة"}</Label>
                                <Select value={deliveryZone} onValueChange={(v: any) => setDeliveryZone(v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="west_bank">{t("delivery.zones.west_bank") || "الضفة الغربية"}</SelectItem>
                                        <SelectItem value="1948">{t("delivery.zones.area_1948") || "الداخل (48)"}</SelectItem>
                                        <SelectItem value="jerusalem">{t("delivery.zones.jerusalem") || "القدس"}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>{t("orders.deliveryCompany")}</Label>
                                <Select value={deliveryCompanyId} onValueChange={setDeliveryCompanyId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t("orders.selectDeliveryCompany")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {activeDeliveryCompanies.map((company) => {
                                            let cost = 0
                                            if (deliveryZone === "west_bank") cost = company.costWestBank || company.cost
                                            else if (deliveryZone === "1948") cost = company.cost1948 || 0
                                            else if (deliveryZone === "jerusalem") cost = company.costJerusalem || 0
                                            if (isNaN(cost)) cost = company.cost || 0

                                            return (
                                                <SelectItem key={company.id} value={company.id}>
                                                    {company.name} - <PriceDisplay amount={cost} />
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                {t("orders.paymentMethod")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cod">{t("payments.cod")}</SelectItem>
                                    <SelectItem value="bank_transfer">{t("payments.bankTransfer")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    {/* Order Summary */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg">{t("orders.orderSummary")}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">{t("common.subtotal")}</span>
                                <span><PriceDisplay amount={subtotal} /></span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">{t("reports.deliveryCosts")}</span>
                                <span><PriceDisplay amount={deliveryCost} /></span>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-lg font-bold">
                                <span>{t("common.total")}</span>
                                <span><PriceDisplay amount={total} /></span>
                            </div>
                            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                                {isLoading ? <Loader2 className="animate-spin" /> : t("orders.createOrder")}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    )
}
