"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { StatusBadge, type OrderStatus } from "@/components/dashboard/status-badge"
import { orders } from "@/lib/mock-data"
import {
  ArrowRight,
  User,
  Phone,
  MapPin,
  Truck,
  CreditCard,
  FileText,
  Clock,
} from "lucide-react"
import { WhatsAppShare } from "@/components/dashboard/whatsapp-share"
import { OrderTimeline, generateSampleTimeline } from "@/components/dashboard/order-timeline"
import { ReturnCancelModal } from "@/components/dashboard/return-cancel-modal"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import type { Order } from "@/lib/types"
import { PriceDisplay } from "@/components/dashboard/price-display"
import { useLanguage } from "@/components/providers/language-provider"

function getOrderById(id: string) {
  return orders.find((o) => o.id === id)
}

export default function OrderDetailsPage() {
  const params = useParams()
  const id = params.id as string
  const order = getOrderById(id)

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">الطلب غير موجود</p>
      </div>
    )
  }

  return <OrderDetailsContent order={order} />
}

function OrderDetailsContent({ order }: { order: NonNullable<ReturnType<typeof getOrderById>> }) {
  const { t } = useLanguage()
  const [status, setStatus] = useState<OrderStatus>(order.status)
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showStatusConfirm, setShowStatusConfirm] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null)

  const timelineEvents = generateSampleTimeline(order.orderNumber)

  // Create Order object for WhatsApp sharing
  const orderForWhatsApp: Order = order

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === "returned") {
      setShowReturnModal(true)
    } else if (newStatus === "canceled") {
      setShowCancelModal(true)
    } else {
      setPendingStatus(newStatus as OrderStatus)
      setShowStatusConfirm(true)
    }
  }

  const confirmStatusChange = () => {
    if (pendingStatus) {
      setStatus(pendingStatus)
      setPendingStatus(null)
    }
    setShowStatusConfirm(false)
  }

  const handleReturnConfirm = (reason: string, notes: string) => {
    setStatus("returned")
    setShowReturnModal(false)
    // In a real app, you would save the reason and notes
  }

  const handleCancelConfirm = (reason: string, notes: string) => {
    setStatus("canceled")
    setShowCancelModal(false)
    // In a real app, you would save the reason and notes
  }

  const statusTimeline: { status: OrderStatus; label: string; date?: string }[] = [
    { status: "new", label: t("status.new"), date: new Date(order.createdAt).toLocaleDateString("ar-SA") },
    { status: "processing", label: t("status.processing") },
    { status: "with_delivery", label: t("status.with_delivery") },
    { status: "delivered", label: t("status.delivered") },
  ]

  const statusOrder: OrderStatus[] = ["new", "processing", "with_delivery", "delivered"]
  const currentStatusIndex = statusOrder.indexOf(status)

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/orders">
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
            <p className="text-muted-foreground">
              {t("orders.orderDetails")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <WhatsAppShare order={orderForWhatsApp} storeName="متجري" />
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">{t("status.new")}</SelectItem>
              <SelectItem value="processing">{t("status.processing")}</SelectItem>
              <SelectItem value="with_delivery">{t("status.with_delivery")}</SelectItem>
              <SelectItem value="delivered">{t("status.delivered")}</SelectItem>
              <SelectItem value="returned">{t("status.returned")}</SelectItem>
              <SelectItem value="canceled">{t("status.canceled")}</SelectItem>
            </SelectContent>
          </Select>
          <StatusBadge status={status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                {t("orders.customerInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("common.name")}</p>
                    <p className="font-medium">{order.customer.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("common.phone")}</p>
                    <p className="font-medium" dir="ltr">{order.customer.phone}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("common.address")}</p>
                  <p className="font-medium">{order.customer.address}</p>
                  <p className="text-sm text-muted-foreground">{order.customer.city}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">{t("orders.itemsOrdered")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <span className="text-lg font-bold text-muted-foreground">
                          {item.quantity}x
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          <PriceDisplay amount={item.price} /> للقطعة
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">
                      <PriceDisplay amount={item.price * item.quantity} />
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t("common.notes")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">{t("orders.orderSummary")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("common.subtotal")}</span>
                <span><PriceDisplay amount={order.subtotal} /></span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("reports.deliveryCosts")}</span>
                <span><PriceDisplay amount={order.deliveryCost} /></span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>{t("common.total")}</span>
                <span><PriceDisplay amount={order.total} /></span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                {t("orders.paymentInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{t("orders.paymentMethod")}</span>
                <span className="font-medium">
                  {order.paymentMethod === "cod"
                    ? t("payments.cod")
                    : t("payments.bankTransfer")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">حالة الدفع</span>
                <StatusBadge status={order.paymentStatus} type="payment" />
              </div>
            </CardContent>
          </Card>

          {/* Delivery Info */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="h-5 w-5" />
                {t("orders.deliveryInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{t("orders.deliveryCompany")}</span>
                <span className="font-medium">
                  {order.deliveryCompany?.name || "غير محدد"}
                </span>
              </div>
              {order.deliveryCompany && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t("common.phone")}</span>
                  <span className="font-medium" dir="ltr">
                    {order.deliveryCompany.phone}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {t("orders.orderTimeline")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statusTimeline.map((item, index) => {
                  const isCompleted = statusOrder.indexOf(item.status) <= currentStatusIndex
                  const isCurrent = item.status === status

                  return (
                    <div key={item.status} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${isCompleted ? "bg-primary" : "bg-muted"
                            }`}
                        />
                        {index < statusTimeline.length - 1 && (
                          <div
                            className={`w-0.5 h-8 ${isCompleted && index < currentStatusIndex
                              ? "bg-primary"
                              : "bg-muted"
                              }`}
                          />
                        )}
                      </div>
                      <div className="pb-4">
                        <p
                          className={`font-medium ${isCurrent ? "text-primary" : ""
                            }`}
                        >
                          {item.label}
                        </p>
                        {item.date && (
                          <p className="text-sm text-muted-foreground">
                            {item.date}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Activity Log - New Timeline Component */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t("orders.orderHistory")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTimeline events={timelineEvents} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Return Modal */}
      <ReturnCancelModal
        open={showReturnModal}
        onOpenChange={setShowReturnModal}
        onConfirm={handleReturnConfirm}
        type="return"
      />

      {/* Cancel Modal */}
      <ReturnCancelModal
        open={showCancelModal}
        onOpenChange={setShowCancelModal}
        onConfirm={handleCancelConfirm}
        type="cancel"
      />

      {/* Status Change Confirmation */}
      <ConfirmationDialog
        open={showStatusConfirm}
        onOpenChange={setShowStatusConfirm}
        onConfirm={confirmStatusChange}
        type="warning"
        title={t("orders.changeStatus")}
        description={t("orders.confirmStatusChange")}
        confirmLabel={t("common.confirm")}
      />
    </div>
  )
}
