"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  CalendarIcon,
  Printer,
  Download,
  ArrowRight,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  Package
} from "lucide-react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { PriceDisplay } from "@/components/dashboard/price-display"
import { useLanguage } from "@/components/providers/language-provider"

interface DeliveryItem {
  id: string
  orderNumber: string
  customerName: string
  phone: string
  address: string
  city: string
  deliveryCompany: string
  amount: number
  paymentMethod: "cod" | "paid"
  items: number
  notes?: string
}

const mockDeliveryItems: DeliveryItem[] = [
  {
    id: "1",
    orderNumber: "ORD-1001",
    customerName: "محمد أحمد",
    phone: "0501234567",
    address: "شارع الملك فهد، حي النخيل",
    city: "الرياض",
    deliveryCompany: "سمسا",
    amount: 450,
    paymentMethod: "cod",
    items: 3
  },
  {
    id: "2",
    orderNumber: "ORD-1002",
    customerName: "سارة محمد",
    phone: "0507654321",
    address: "شارع التحلية، حي السليمانية",
    city: "جدة",
    deliveryCompany: "أرامكس",
    amount: 320,
    paymentMethod: "paid",
    items: 2,
    notes: "الاتصال قبل التوصيل"
  },
  {
    id: "3",
    orderNumber: "ORD-1003",
    customerName: "خالد سعد",
    phone: "0509876543",
    address: "شارع الأمير سلطان، حي الروضة",
    city: "الرياض",
    deliveryCompany: "سمسا",
    amount: 180,
    paymentMethod: "cod",
    items: 1
  },
  {
    id: "4",
    orderNumber: "ORD-1004",
    customerName: "نورة علي",
    phone: "0503456789",
    address: "حي الملقا، طريق الملك سلمان",
    city: "الرياض",
    deliveryCompany: "زاجل",
    amount: 550,
    paymentMethod: "cod",
    items: 4,
    notes: "شقة رقم 5"
  },
  {
    id: "5",
    orderNumber: "ORD-1005",
    customerName: "عبدالله فهد",
    phone: "0506543210",
    address: "شارع الستين، حي النزهة",
    city: "الدمام",
    deliveryCompany: "DHL",
    amount: 290,
    paymentMethod: "paid",
    items: 2
  }
]

const deliveryCompanies = [
  { value: "all", label: "delivery.allCompanies" },
  { value: "smsa", label: "سمسا" },
  { value: "aramex", label: "أرامكس" },
  { value: "zajil", label: "زاجل" },
  { value: "dhl", label: "DHL" }
]

export default function DailyDeliverySheetPage() {
  const { t, language } = useLanguage()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedCompany, setSelectedCompany] = useState("all")
  const [items] = useState<DeliveryItem[]>(mockDeliveryItems)

  const filteredItems = selectedCompany === "all"
    ? items
    : items.filter(item =>
      item.deliveryCompany.toLowerCase().includes(selectedCompany.toLowerCase())
    )

  const totalCOD = filteredItems
    .filter(i => i.paymentMethod === "cod")
    .reduce((sum, i) => sum + i.amount, 0)

  const handlePrint = () => {
    window.print()
  }

  const handleExportPDF = () => {
    // In a real app, this would generate and download a PDF
    alert(t("delivery.pdfDownloadAlert"))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/delivery">
            <Button variant="ghost" size="icon">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{t("delivery.dailySheet")}</h1>
            <p className="text-muted-foreground">{t("delivery.dailySheetSubtitle")}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Date Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <CalendarIcon className="w-4 h-4" />
                {format(selectedDate, "EEEE، d MMMM yyyy", { locale: language === 'ar' ? ar : undefined })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Company Filter */}
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-40">
              <Truck className="w-4 h-4 ml-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {deliveryCompanies.map(company => (
                <SelectItem key={company.value} value={company.value}>
                  {company.value === "all" ? t(company.label) : company.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2 mr-auto">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4 ml-2" />
              {t("common.print")}
            </Button>
            <Button variant="outline" onClick={handleExportPDF}>
              <Download className="w-4 h-4 ml-2" />
              {t("common.exportPDF")}
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:hidden">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{filteredItems.length}</p>
                <p className="text-sm text-muted-foreground">{t("dashboard.totalOrders")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-warning-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{filteredItems.filter(i => i.paymentMethod === "cod").length}</p>
                <p className="text-sm text-muted-foreground">{t("payments.cod")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold"><PriceDisplay amount={totalCOD} /></p>
                <p className="text-sm text-muted-foreground">{t("delivery.totalExpectedCOD")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Print Header (only visible when printing) */}
      <div className="hidden print:block mb-6">
        <h1 className="text-2xl font-bold text-center">{t("delivery.dailySheet")}</h1>
        <p className="text-center text-muted-foreground">
          {format(selectedDate, "EEEE، d MMMM yyyy", { locale: language === 'ar' ? ar : undefined })}
        </p>
        <p className="text-center text-sm mt-2">
          {t("dashboard.totalOrders")}: {filteredItems.length} | {t("delivery.totalCOD")}: <PriceDisplay amount={totalCOD} />
        </p>
      </div>

      {/* Delivery Items */}
      <div className="space-y-3">
        {filteredItems.map((item, index) => (
          <Card key={item.id} className="print:break-inside-avoid">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Index Number */}
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 print:bg-gray-200">
                  <span className="font-bold text-sm">{index + 1}</span>
                </div>

                {/* Main Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{item.customerName}</span>
                    <Badge variant="outline">{item.orderNumber}</Badge>
                    <Badge variant={item.paymentMethod === "cod" ? "default" : "secondary"}>
                      {item.paymentMethod === "cod" ? "COD" : t("payments.paid")}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 shrink-0" />
                      <span dir="ltr">{item.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 shrink-0" />
                      <span>{item.deliveryCompany}</span>
                    </div>
                    <div className="flex items-start gap-2 sm:col-span-2">
                      <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{item.address}، {item.city}</span>
                    </div>
                  </div>

                  {item.notes && (
                    <p className="text-sm bg-muted p-2 rounded">
                      <span className="font-medium">{t("common.note")}: </span>
                      {item.notes}
                    </p>
                  )}
                </div>

                {/* Amount */}
                <div className="text-left sm:text-right shrink-0">
                  <p className="text-lg font-bold"><PriceDisplay amount={item.amount} /></p>
                  <p className="text-sm text-muted-foreground">{item.items} {t("orders.product")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Print Footer */}
      <div className="hidden print:block mt-8 pt-4 border-t">
        <p className="text-center text-sm text-muted-foreground">
          {t("delivery.printFooter")}
        </p>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .space-y-6, .space-y-6 * {
            visibility: visible;
          }
          .space-y-6 {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
        }
      `}</style>
    </div>
  )
}
