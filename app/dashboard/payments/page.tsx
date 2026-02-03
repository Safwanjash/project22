"use client"

import { useState } from "react"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { StatCard } from "@/components/dashboard/stat-card"
import { orders } from "@/lib/mock-data"
import {
  Search,
  CreditCard,
  Banknote,
  CheckCircle,
  Clock,
  Upload,
  ImageIcon,
} from "lucide-react"
import { PriceDisplay } from "@/components/dashboard/price-display"
import { useLanguage } from "@/components/providers/language-provider"

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [paymentFilter, setPaymentFilter] = useState<string>("all")
  const { t, isRTL } = useLanguage()

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesPayment =
      paymentFilter === "all" || order.paymentStatus === paymentFilter

    return matchesSearch && matchesPayment
  })

  // Calculate stats
  const paidOrders = orders.filter((o) => o.paymentStatus === "paid")
  const unpaidOrders = orders.filter((o) => o.paymentStatus === "unpaid")
  const totalPaid = paidOrders.reduce((sum, o) => sum + o.total, 0)
  const totalUnpaid = unpaidOrders.reduce((sum, o) => sum + o.total, 0)
  const codOrders = orders.filter((o) => o.paymentMethod === "cod").length
  const bankOrders = orders.filter((o) => o.paymentMethod === "bank_transfer").length

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{t("nav.payments")}</h1>
        <p className="text-muted-foreground">{t("nav.paymentsDesc")}</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("payments.paid")}
          value={<PriceDisplay amount={totalPaid} />}
          icon={CheckCircle}
          iconClassName="bg-success/10 text-success"
        />
        <StatCard
          title={t("status.unpaid")}
          value={<PriceDisplay amount={totalUnpaid} />}
          icon={Clock}
          iconClassName="bg-warning/10 text-warning"
        />
        <StatCard
          title={t("payments.cod")}
          value={codOrders}
          icon={Banknote}
          iconClassName="bg-info/10 text-info"
        />
        <StatCard
          title={t("payments.bankTransfer")}
          value={bankOrders}
          icon={CreditCard}
          iconClassName="bg-primary/10 text-primary"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className={isRTL ? "absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" : "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"} />
              <Input
                placeholder={t("payments.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={isRTL ? "pr-10" : "pl-10"}
              />
            </div>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t("filters.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filters.allStatuses")}</SelectItem>
                <SelectItem value="paid">{t("status.paid")}</SelectItem>
                <SelectItem value="unpaid">{t("status.unpaid")}</SelectItem>
                <SelectItem value="partial">{t("status.partial_return")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">
            {t("payments.history")} ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={isRTL ? "text-right" : "text-left"}>{t("orders.orderNumber")}</TableHead>
                  <TableHead className={isRTL ? "text-right" : "text-left"}>{t("orders.customer")}</TableHead>
                  <TableHead className={isRTL ? "text-right" : "text-left"}>{t("orders.paymentMethod")}</TableHead>
                  <TableHead className={isRTL ? "text-right" : "text-left"}>{t("orders.total")}</TableHead>
                  <TableHead className={isRTL ? "text-right" : "text-left"}>{t("filters.status")}</TableHead>
                  <TableHead className={isRTL ? "text-right" : "text-left"}>{t("payments.proof")}</TableHead>
                  <TableHead className="w-32"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className={`font-medium text-xs font-mono ${isRTL ? "text-right" : "text-left"}`}>
                      #{order.orderNumber}
                    </TableCell>
                    <TableCell className={isRTL ? "text-right" : "text-left"}>{order.customer.name}</TableCell>
                    <TableCell className={isRTL ? "text-right" : "text-left"}>
                      <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                        {order.paymentMethod === "cod" ? (
                          <>
                            <Banknote className="h-4 w-4 text-muted-foreground" />
                            <span>{t("payments.cod")}</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <span>{t("payments.bankTransfer")}</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className={`font-semibold ${isRTL ? "text-right" : "text-left"}`}>
                      <PriceDisplay amount={order.total} />
                    </TableCell>
                    <TableCell className={isRTL ? "text-right" : "text-left"}>
                      <StatusBadge status={order.paymentStatus} type="payment" />
                    </TableCell>
                    <TableCell className={isRTL ? "text-right" : "text-left"}>
                      {order.paymentProof ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="gap-2">
                              <ImageIcon className="h-4 w-4" />
                              {t("common.view")}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{t("payments.proof")}</DialogTitle>
                            </DialogHeader>
                            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                              <ImageIcon className="h-12 w-12 text-muted-foreground" />
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {order.paymentStatus === "unpaid" && (
                          <>
                            <Button variant="outline" size="sm">
                              {t("status.paid")}
                            </Button>
                            {order.paymentMethod === "bank_transfer" && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Upload className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>{t("payments.uploadProof")}</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                      <p className="text-sm text-muted-foreground">
                                        {t("payments.dragAndDrop")}
                                      </p>
                                    </div>
                                    <Button className="w-full">{t("payments.uploadBtn")}</Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-muted-foreground">{t("common.noData")}</p>
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
