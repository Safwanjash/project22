"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Check, MessageCircle, ExternalLink } from "lucide-react"
import type { Order } from "@/lib/types"
import { useCurrency } from "@/components/providers/currency-provider"
import { useLanguage } from "@/components/providers/language-provider"

interface WhatsAppShareProps {
  order: Order
  storeName?: string
}

export function formatOrderForWhatsApp(
  order: Order,
  storeName: string,
  formatPrice: (amount: number) => string,
  t: (key: string) => string,
  isRTL: boolean
): string {
  const statusLabels: Record<string, string> = {
    new: t("status.new"),
    processing: t("status.processing"),
    with_delivery: t("status.with_delivery"),
    delivered: t("status.delivered"),
    returned: t("status.returned"),
    cancelled: t("status.canceled")
  }

  const paymentLabels: Record<string, string> = {
    cod: t("payments.cod"),
    bank_transfer: t("payments.bankTransfer"),
    paid: t("status.paid")
  }



  let message = `*${storeName}*\n`
  message += `━━━━━━━━━━━━━━\n`
  message += `*${t("whatsapp.orderNum")}:* #${order.orderNumber}\n`

  const dateStr = order.createdAt instanceof Date
    ? order.createdAt.toLocaleDateString(isRTL ? "ar-SA" : "en-US")
    : new Date(order.createdAt).toLocaleDateString(isRTL ? "ar-SA" : "en-US")

  message += `*${t("whatsapp.date")}:* ${dateStr}\n`
  message += `*${t("whatsapp.status")}:* ${statusLabels[order.status] || order.status}\n`
  message += `━━━━━━━━━━━━━━\n\n`

  message += `*${t("whatsapp.customerData")}:*\n`
  message += `${t("whatsapp.customerName")}: ${order.customer.name}\n`
  message += `${t("whatsapp.customerPhone")}: ${order.customer.phone}\n`
  message += `${t("whatsapp.customerAddress")}: ${order.customer.address}، ${order.customer.city}\n\n`

  message += `*${t("whatsapp.products")}:*\n`
  order.items.forEach((item, index) => {
    message += `${index + 1}. ${item.productName} × ${item.quantity} = ${formatPrice(item.price * item.quantity)}\n`
  })

  message += `\n━━━━━━━━━━━━━━\n`
  message += `*${t("whatsapp.total")}:* ${formatPrice(order.total)}\n`
  message += `*${t("whatsapp.payment")}:* ${paymentLabels[order.paymentMethod] || order.paymentMethod}\n`

  if (order.deliveryCompany) {
    const deliveryName = typeof order.deliveryCompany === 'object' ? order.deliveryCompany.name : order.deliveryCompany
    message += `*${t("whatsapp.delivery")}:* ${deliveryName}\n`
  }

  if (order.notes) {
    message += `\n*${t("whatsapp.notes")}:* ${order.notes}\n`
  }

  message += `\n${t("whatsapp.thanks")}`

  return message
}

export function WhatsAppShare({ order, storeName }: WhatsAppShareProps) {
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { formatPrice } = useCurrency()
  const { t, isRTL } = useLanguage()

  const finalStoreName = storeName || t("common.storeName")
  const message = formatOrderForWhatsApp(order, finalStoreName, formatPrice, t, isRTL)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleSendToCustomer = () => {
    const encodedMessage = encodeURIComponent(message)
    // Basic phone cleaning
    const cleanPhone = order.customer.phone.replace(/\D/g, "")
    // Default to +966 if logic is needed, but for now just use what's there
    window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, "_blank")
  }

  const handleOpenWhatsApp = () => {
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank")
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <MessageCircle className="w-4 h-4" />
          {t("whatsapp.shareWhatsApp")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">{t("whatsapp.shareWhatsApp")}</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="gap-1"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-success" />
                  {t("whatsapp.copied")}
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  {t("whatsapp.copy")}
                </>
              )}
            </Button>
          </div>

          <Textarea
            value={message}
            readOnly
            className="h-48 text-xs font-mono resize-none"
            dir={isRTL ? "rtl" : "ltr"}
          />

          <div className="flex flex-col gap-2">
            <Button onClick={handleSendToCustomer} className="w-full gap-2">
              <MessageCircle className="w-4 h-4" />
              {t("whatsapp.sendToCustomer")}
              <ExternalLink className="w-3 h-3" />
            </Button>
            <Button variant="outline" onClick={handleOpenWhatsApp} className="w-full gap-2 bg-transparent">
              <MessageCircle className="w-4 h-4" />
              {t("whatsapp.open")}
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Quick copy button for order summary
export function CopyOrderSummary({ order, storeName }: WhatsAppShareProps) {
  const [copied, setCopied] = useState(false)
  const { formatPrice } = useCurrency()
  const { t, isRTL } = useLanguage()

  const finalStoreName = storeName || t("common.storeName")
  const message = formatOrderForWhatsApp(order, finalStoreName, formatPrice, t, isRTL)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="gap-2"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-success" />
          {t("whatsapp.copied")}
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          {t("whatsapp.orderSummary")}
        </>
      )}
    </Button>
  )
}
