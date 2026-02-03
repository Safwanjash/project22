"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Zap,
  User,
  Package,
  CreditCard,
  Check,
  Clock,
  History
} from "lucide-react"
import { customers, products } from "@/lib/mock-data"
import type { Customer, Product } from "@/lib/types"
import { PriceDisplay } from "@/components/dashboard/price-display"
import { useLanguage } from "@/components/providers/language-provider"

const mockCustomers = customers;
const mockProducts = products;

interface QuickOrderFormProps {
  onSubmit: (order: QuickOrderData) => void
  lastCustomer?: Customer
}

export interface QuickOrderData {
  customerId: string
  customerName: string
  customerPhone: string
  customerAddress: string
  customerCity: string
  productId: string
  productName: string
  variantId?: string
  variantDetails?: string
  quantity: number
  price: number
  paymentMethod: "cod" | "bank_transfer"
  notes?: string
}

export function QuickOrderForm({ onSubmit, lastCustomer }: QuickOrderFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<"customer" | "product" | "payment">("customer")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const { t, isRTL } = useLanguage()

  // Form data
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bank_transfer">("cod")
  const [notes, setNotes] = useState("")

  // Search states
  const [customerSearch, setCustomerSearch] = useState("")
  const [productSearch, setProductSearch] = useState("")

  const customerInputRef = useRef<HTMLInputElement>(null)

  // Filter customers and products
  const filteredCustomers = mockCustomers.filter(c =>
    c.name.includes(customerSearch) || c.phone.includes(customerSearch)
  ).slice(0, 5)

  const filteredProducts = mockProducts.filter(p =>
    p.name.includes(productSearch)
  ).slice(0, 5)

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setStep("customer")
      setSelectedCustomer(lastCustomer || null)
      setSelectedProduct(null)
      setSelectedVariant(null)
      setQuantity(1)
      setPaymentMethod("cod")
      setNotes("")
      setCustomerSearch("")
      setProductSearch("")
      setStartTime(Date.now())

      // Focus customer input
      setTimeout(() => customerInputRef.current?.focus(), 100)
    }
  }, [isOpen, lastCustomer])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === "Enter" && !e.shiftKey) {
        if (step === "customer" && selectedCustomer) {
          e.preventDefault()
          setStep("product")
        } else if (step === "product" && selectedProduct) {
          // Check if variant product requires variant selection
          if (selectedProduct.type === "variant" && !selectedVariant) {
            return // Don't proceed without variant
          }
          e.preventDefault()
          setStep("payment")
        } else if (step === "payment") {
          e.preventDefault()
          handleSubmit()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, step, selectedCustomer, selectedProduct])

  const handleSubmit = async () => {
    if (!selectedCustomer || !selectedProduct) return

    setIsSubmitting(true)

    const orderData: QuickOrderData = {
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerPhone: selectedCustomer.phone,
      customerAddress: selectedCustomer.address,
      customerCity: selectedCustomer.city,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      variantId: selectedVariant || undefined,
      variantDetails: selectedVariant ? (() => {
        const variant = selectedProduct.variants?.find(v => v.id === selectedVariant)
        return variant ? `${t("products.size")}: ${variant.size}, ${t("products.color")}: ${variant.color}` : undefined
      })() : undefined,
      quantity,
      price: (() => {
        if (selectedProduct.type === "variant" && selectedVariant) {
          const variant = selectedProduct.variants?.find(v => v.id === selectedVariant)
          return (variant?.price || selectedProduct.price) * quantity
        }
        return selectedProduct.price * quantity
      })(),
      paymentMethod,
      notes: notes || undefined
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    onSubmit(orderData)
    setIsSubmitting(false)
    setIsOpen(false)
  }

  const totalPrice = selectedProduct ? selectedProduct.price * quantity : 0
  const elapsedTime = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Zap className="w-4 h-4" />
          {t("orders.quickOrder")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              {t("orders.createQuickOrder")}
            </DialogTitle>
            <Badge variant="outline" className="gap-1">
              <Clock className="w-3 h-3" />
              {elapsedTime}{t("common.s")}
            </Badge>
          </div>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 py-2">
          {["customer", "product", "payment"].map((s, index) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${step === s
                  ? "bg-primary text-primary-foreground"
                  : (["customer", "product", "payment"].indexOf(step) > index)
                    ? "bg-success text-success-foreground"
                    : "bg-muted text-muted-foreground"
                }
              `}>
                {["customer", "product", "payment"].indexOf(step) > index ? (
                  <Check className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              {index < 2 && (
                <div className={`flex-1 h-0.5 mx-2 ${["customer", "product", "payment"].indexOf(step) > index
                  ? "bg-success"
                  : "bg-muted"
                  }`} />
              )}
            </div>
          ))}
        </div>

        <div className="space-y-4 py-4">
          {/* Step 1: Customer */}
          {step === "customer" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">{t("orders.selectCustomer")}</h3>
              </div>

              {lastCustomer && !selectedCustomer && (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 bg-transparent"
                  onClick={() => setSelectedCustomer(lastCustomer)}
                >
                  <History className="w-4 h-4" />
                  {t("orders.lastCustomer")}: {lastCustomer.name}
                </Button>
              )}

              <Input
                ref={customerInputRef}
                placeholder={t("customers.searchPlaceholder")}
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
              />

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filteredCustomers.map(customer => (
                  <button
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer)}
                    className={`w-full p-3 rounded-lg ${isRTL ? "text-right" : "text-left"} transition-colors ${selectedCustomer?.id === customer.id
                      ? "bg-primary/10 border border-primary"
                      : "bg-muted/50 hover:bg-muted"
                      }`}
                  >
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.phone}</p>
                  </button>
                ))}
              </div>

              <Button
                className="w-full"
                disabled={!selectedCustomer}
                onClick={() => setStep("product")}
              >
                {t("common.next")}: {t("orders.selectProduct")}
              </Button>
            </div>
          )}

          {/* Step 2: Product */}
          {step === "product" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">{t("orders.selectProduct")}</h3>
              </div>

              <Input
                placeholder={t("products.searchPlaceholder")}
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                autoFocus
              />

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filteredProducts.map(product => (
                  <button
                    key={product.id}
                    onClick={() => {
                      setSelectedProduct(product)
                      setSelectedVariant(null)
                    }}
                    className={`w-full p-3 rounded-lg ${isRTL ? "text-right" : "text-left"} transition-colors ${selectedProduct?.id === product.id
                      ? "bg-primary/10 border border-primary"
                      : "bg-muted/50 hover:bg-muted"
                      }`}
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-medium">{product.name}</p>
                      <p className="font-semibold"><PriceDisplay amount={product.price} /></p>
                    </div>
                  </button>
                ))}
              </div>

              {selectedProduct && selectedProduct.type === "variant" && selectedProduct.variants && (
                <div className="space-y-3 p-3 border rounded-lg bg-muted/30">
                  <Label>{t("products.selectVariant")}</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {selectedProduct.variants
                      .filter(v => v.isActive)
                      .map(variant => (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => setSelectedVariant(variant.id)}
                          className={`p-2 rounded-lg text-sm transition-colors ${isRTL ? "text-right" : "text-left"} ${selectedVariant === variant.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-background hover:bg-muted border"
                            }`}
                        >
                          <p className="font-medium">{variant.size} - {variant.color}</p>
                          {variant.price && variant.price !== selectedProduct.price && (
                            <p className="text-xs"><PriceDisplay amount={variant.price} /></p>
                          )}
                        </button>
                      ))}
                  </div>
                  {selectedProduct.variants.filter(v => v.isActive).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      {t("products.noVariantsAvailable")}
                    </p>
                  )}
                </div>
              )}

              {selectedProduct && (
                <div className="flex items-center gap-3">
                  <Label>{t("common.quantity")}:</Label>
                  <Input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-20"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("customer")}>
                  {t("common.back")}
                </Button>
                <Button
                  className="flex-1"
                  disabled={!selectedProduct || (selectedProduct.type === "variant" && !selectedVariant)}
                  onClick={() => setStep("payment")}
                >
                  {t("common.next")}: {t("orders.paymentMethod")}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === "payment" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">{t("orders.orderSummary")}</h3>
              </div>

              {/* Order Summary */}
              <Card>
                <CardContent className="pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("orders.customer")}:</span>
                    <span className="font-medium">{selectedCustomer?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("orders.product")}:</span>
                    <span className="font-medium">{selectedProduct?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("common.quantity")}:</span>
                    <span className="font-medium">{quantity}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-semibold">{t("common.total")}:</span>
                    <span className="font-bold text-primary"><PriceDisplay amount={totalPrice} /></span>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Label>{t("orders.paymentMethod")}</Label>
                <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as "cod" | "bank_transfer")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cod">{t("payments.cod")}</SelectItem>
                    <SelectItem value="bank_transfer">{t("payments.bankTransfer")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t("common.notes")} ({t("common.optional")})</Label>
                <Textarea
                  placeholder={t("orders.orderNotesPlaceholder")}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("product")}>
                  {t("common.back")}
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t("common.loading") : t("orders.createOrderBtn")}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Keyboard Hint */}
        <p className="text-xs text-center text-muted-foreground">
          {t("orders.quickOrderHint")}
        </p>
      </DialogContent>
    </Dialog>
  )
}
