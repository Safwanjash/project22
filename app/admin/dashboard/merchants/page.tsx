"use client"

import { useState } from "react"
import { useLanguage } from "@/components/providers/language-provider"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Search,
  MoreVertical,
  Eye,
  Lock,
  Unlock,
  Trash2,
  CheckCircle,
  XCircle,
  Store,
  Clock,
  AlertCircle,
  Download,
  Check,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type MerchantStatus = "active" | "pending" | "suspended"

interface Merchant {
  id: number
  name: string
  owner: string
  email: string
  phone: string
  orders: number
  revenue: number
  status: MerchantStatus
  joinDate: string
}

const initialMerchants: Merchant[] = [
  {
    id: 1,
    name: "Ahmed Electronics",
    owner: "Ahmed Al-Mazrouei",
    email: "ahmed@electronics.ae",
    phone: "+971501234567",
    orders: 2543,
    revenue: 125000,
    status: "active",
    joinDate: "2023-01-15",
  },
  {
    id: 2,
    name: "Fashion Forward",
    owner: "Fatima Al-Ketbi",
    email: "fatima@fashionforward.ae",
    phone: "+971509876543",
    orders: 1876,
    revenue: 98500,
    status: "active",
    joinDate: "2023-02-20",
  },
  {
    id: 3,
    name: "Home & Living",
    owner: "Mohammed Al-Dhaheri",
    email: "mohammed@homelivng.ae",
    phone: "+971501111111",
    orders: 1654,
    revenue: 87300,
    status: "active",
    joinDate: "2023-03-10",
  },
  {
    id: 4,
    name: "Beauty Pro",
    owner: "Layla Al-Marri",
    email: "layla@beautypro.ae",
    phone: "+971502222222",
    orders: 1432,
    revenue: 76500,
    status: "suspended",
    joinDate: "2023-04-05",
  },
  {
    id: 5,
    name: "Tech Hub",
    owner: "Ali Al-Mansoori",
    email: "ali@techhub.ae",
    phone: "+971503333333",
    orders: 3210,
    revenue: 189000,
    status: "active",
    joinDate: "2023-05-12",
  },
  {
    id: 6,
    name: "Gourmet Delights",
    owner: "Noor Al-Hashmi",
    email: "noor@gourmetdelights.ae",
    phone: "+971504444444",
    orders: 0,
    revenue: 0,
    status: "pending",
    joinDate: "2024-01-10",
  },
  {
    id: 7,
    name: "Sports Corner",
    owner: "Khalid Al-Shamsi",
    email: "khalid@sportscorner.ae",
    phone: "+971505555555",
    orders: 0,
    revenue: 0,
    status: "pending",
    joinDate: "2024-01-12",
  },
  {
    id: 8,
    name: "Kids World",
    owner: "Maryam Al-Suwaidi",
    email: "maryam@kidsworld.ae",
    phone: "+971506666666",
    orders: 0,
    revenue: 0,
    status: "pending",
    joinDate: "2024-01-14",
  },
]

export default function MerchantsPage() {
  const { t, isRTL } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [merchants, setMerchants] = useState<Merchant[]>(initialMerchants)
  const [statusFilter, setStatusFilter] = useState<"all" | MerchantStatus>("all")
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    type: "approve" | "reject" | "suspend" | "activate" | "delete" | null
    merchant: Merchant | null
  }>({ open: false, type: null, merchant: null })
  const [viewStoreDialog, setViewStoreDialog] = useState<{ open: boolean; merchant: Merchant | null }>({ open: false, merchant: null })

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const filteredMerchants = merchants.filter((merchant) => {
    const matchesSearch =
      merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || merchant.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: MerchantStatus) => {
    switch (status) {
      case "active":
        return <Badge variant="default">{t("admin.active")}</Badge>
      case "pending":
        return <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">{t("admin.pendingApproval")}</Badge>
      case "suspended":
        return <Badge variant="destructive">{t("admin.suspended")}</Badge>
    }
  }

  const handleConfirmAction = () => {
    if (!confirmDialog.merchant || !confirmDialog.type) return

    const { type, merchant } = confirmDialog

    switch (type) {
      case "approve":
        setMerchants(merchants.map(m =>
          m.id === merchant.id ? { ...m, status: "active" as MerchantStatus } : m
        ))
        showToast(`${t("admin.approve")}: ${merchant.name}`)
        break
      case "reject":
        setMerchants(merchants.filter(m => m.id !== merchant.id))
        showToast(`${t("admin.reject")}: ${merchant.name}`)
        break
      case "suspend":
        setMerchants(merchants.map(m =>
          m.id === merchant.id ? { ...m, status: "suspended" as MerchantStatus } : m
        ))
        showToast(`${t("admin.suspend")}: ${merchant.name}`)
        break
      case "activate":
        setMerchants(merchants.map(m =>
          m.id === merchant.id ? { ...m, status: "active" as MerchantStatus } : m
        ))
        showToast(`${t("admin.activate")}: ${merchant.name}`)
        break
      case "delete":
        setMerchants(merchants.filter(m => m.id !== merchant.id))
        showToast(`${t("common.delete")}: ${merchant.name}`)
        break
    }

    setConfirmDialog({ open: false, type: null, merchant: null })
  }

  const getDialogContent = () => {
    const { type, merchant } = confirmDialog
    if (!type || !merchant) return { title: "", description: "", buttonText: "", buttonVariant: "default" as const }

    switch (type) {
      case "approve":
        return {
          title: t("admin.approveMerchant"),
          description: t("admin.approveMerchantDesc").replace("{name}", merchant.name),
          buttonText: t("admin.approve"),
          buttonVariant: "default" as const,
        }
      case "reject":
        return {
          title: t("admin.rejectMerchant"),
          description: t("admin.rejectMerchantDesc").replace("{name}", merchant.name),
          buttonText: t("admin.reject"),
          buttonVariant: "destructive" as const,
        }
      case "suspend":
        return {
          title: t("admin.disableStore"),
          description: t("admin.suspendMerchantDesc").replace("{name}", merchant.name),
          buttonText: t("admin.suspend"),
          buttonVariant: "destructive" as const,
        }
      case "activate":
        return {
          title: t("admin.enableStore"),
          description: t("admin.activateMerchantDesc").replace("{name}", merchant.name),
          buttonText: t("admin.activate"),
          buttonVariant: "default" as const,
        }
      case "delete":
        return {
          title: t("common.delete"),
          description: `${t("confirm.delete")} ${merchant.name}?`,
          buttonText: t("common.delete"),
          buttonVariant: "destructive" as const,
        }
    }
  }

  const handleExport = () => {
    const headers = ["Store Name", "Owner", "Email", "Phone", "Orders", "Revenue", "Status", "Join Date"]
    const csvContent = [
      headers.join(","),
      ...merchants.map(merchant => [
        merchant.name,
        merchant.owner,
        merchant.email,
        merchant.phone,
        merchant.orders,
        merchant.revenue,
        merchant.status,
        merchant.joinDate
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `merchants_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
    showToast(t("common.export"))
  }

  const handleViewStore = (merchant: Merchant) => {
    setViewStoreDialog({ open: true, merchant })
  }

  const dialogContent = getDialogContent()

  const statusCounts = {
    all: merchants.length,
    active: merchants.filter(m => m.status === "active").length,
    pending: merchants.filter(m => m.status === "pending").length,
    suspended: merchants.filter(m => m.status === "suspended").length,
  }

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toast && (
        <div className={cn(
          "fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transition-all",
          toast.type === "success"
            ? "bg-green-600 text-white"
            : "bg-red-600 text-white"
        )}>
          <Check className="w-4 h-4" />
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t("admin.merchants")}</h1>
          <p className="text-muted-foreground">{t("admin.merchantsDesc")}</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          {t("common.export")}
        </Button>
      </div>

      {/* Status Tabs */}
      <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="space-x-2">
            <Store className="w-4 h-4" />
            <span>{t("common.all")} ({statusCounts.all})</span>
          </TabsTrigger>
          <TabsTrigger value="active" className="space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>{t("admin.active")} ({statusCounts.active})</span>
          </TabsTrigger>
          <TabsTrigger value="pending" className="space-x-2">
            <Clock className="w-4 h-4" />
            <span>{t("admin.pendingApproval")} ({statusCounts.pending})</span>
          </TabsTrigger>
          <TabsTrigger value="suspended" className="space-x-2">
            <AlertCircle className="w-4 h-4" />
            <span>{t("admin.suspended")} ({statusCounts.suspended})</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search */}
      <div className="relative">
        <Search className={cn(
          "absolute top-3 w-5 h-5 text-muted-foreground",
          isRTL ? "right-3" : "left-3"
        )} />
        <Input
          placeholder={t("common.search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={isRTL ? "pr-10 text-right" : "pl-10"}
        />
      </div>

      {/* Merchants Table */}
      <Card className="border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("admin.store")}</th>
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("admin.owner")}</th>
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("common.email")}</th>
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("orders.title")}</th>
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("reports.totalRevenue")}</th>
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("common.status")}</th>
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("admin.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredMerchants.map((merchant) => (
                <tr
                  key={merchant.id}
                  className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{merchant.name}</td>
                  <td className={cn("py-3 px-4 text-muted-foreground", isRTL ? "text-right" : "text-left")}>{merchant.owner}</td>
                  <td className={cn("py-3 px-4 text-muted-foreground", isRTL ? "text-right" : "text-left")}>{merchant.email}</td>
                  <td className={cn("py-3 px-4", isRTL ? "text-right" : "text-left")}>{merchant.orders.toLocaleString()}</td>
                  <td className={cn("py-3 px-4", isRTL ? "text-right" : "text-left")}>${merchant.revenue.toLocaleString()}</td>
                  <td className="py-3 px-4">{getStatusBadge(merchant.status)}</td>
                  <td className="py-3 px-4">
                    {merchant.status === "pending" ? (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => setConfirmDialog({ open: true, type: "approve", merchant })}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          {t("admin.approve")}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setConfirmDialog({ open: true, type: "reject", merchant })}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          {t("admin.reject")}
                        </Button>
                      </div>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align={isRTL ? "start" : "end"}>
                          <DropdownMenuItem onClick={() => handleViewStore(merchant)}>
                            <Eye className="w-4 h-4 mr-2" />
                            {t("admin.viewStore")}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {merchant.status === "active" ? (
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setConfirmDialog({ open: true, type: "suspend", merchant })}
                            >
                              <Lock className="w-4 h-4 mr-2" />
                              {t("admin.disableStore")}
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="text-green-600"
                              onClick={() => setConfirmDialog({ open: true, type: "activate", merchant })}
                            >
                              <Unlock className="w-4 h-4 mr-2" />
                              {t("admin.enableStore")}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setConfirmDialog({ open: true, type: "delete", merchant })}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {t("common.delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 border-slate-200 dark:border-slate-800">
          <p className="text-sm text-muted-foreground mb-2">{t("admin.totalMerchants")}</p>
          <p className="text-2xl font-bold text-primary">{merchants.length}</p>
        </Card>
        <Card className="p-6 border-slate-200 dark:border-slate-800">
          <p className="text-sm text-muted-foreground mb-2">{t("admin.active")}</p>
          <p className="text-2xl font-bold text-green-600">{statusCounts.active}</p>
        </Card>
        <Card className="p-6 border-slate-200 dark:border-slate-800">
          <p className="text-sm text-muted-foreground mb-2">{t("admin.pendingApproval")}</p>
          <p className="text-2xl font-bold text-amber-600">{statusCounts.pending}</p>
        </Card>
        <Card className="p-6 border-slate-200 dark:border-slate-800">
          <p className="text-sm text-muted-foreground mb-2">{t("admin.suspended")}</p>
          <p className="text-2xl font-bold text-red-600">{statusCounts.suspended}</p>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => !open && setConfirmDialog({ open: false, type: null, merchant: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogContent.title}</DialogTitle>
            <DialogDescription>{dialogContent.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog({ open: false, type: null, merchant: null })}>
              {t("common.cancel")}
            </Button>
            <Button variant={dialogContent.buttonVariant} onClick={handleConfirmAction}>
              {dialogContent.buttonText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Store Dialog */}
      <Dialog open={viewStoreDialog.open} onOpenChange={(open) => !open && setViewStoreDialog({ open: false, merchant: null })}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Store className="w-5 h-5" />
              {viewStoreDialog.merchant?.name}
            </DialogTitle>
            <DialogDescription>
              {t("admin.storeDetails")}
            </DialogDescription>
          </DialogHeader>
          {viewStoreDialog.merchant && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t("admin.owner")}</p>
                  <p className="font-medium">{viewStoreDialog.merchant.owner}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t("common.email")}</p>
                  <p className="font-medium">{viewStoreDialog.merchant.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t("common.phone")}</p>
                  <p className="font-medium">{viewStoreDialog.merchant.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t("common.status")}</p>
                  {getStatusBadge(viewStoreDialog.merchant.status)}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t("orders.title")}</p>
                  <p className="font-medium">{viewStoreDialog.merchant.orders.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t("reports.totalRevenue")}</p>
                  <p className="font-medium">${viewStoreDialog.merchant.revenue.toLocaleString()}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <p className="text-sm text-muted-foreground">{t("admin.joinedOn")}</p>
                <p className="font-medium">{viewStoreDialog.merchant.joinDate}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewStoreDialog({ open: false, merchant: null })}>
              {t("common.close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
