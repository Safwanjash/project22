"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { XCircle, RotateCcw } from "lucide-react"

interface ReturnCancelModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (reason: string, notes: string) => void
  type: "return" | "cancel"
  isLoading?: boolean
}

const returnReasons = [
  { value: "customer_refused", label: "رفض العميل الاستلام" },
  { value: "wrong_address", label: "عنوان خاطئ" },
  { value: "customer_not_available", label: "العميل غير متواجد" },
  { value: "damaged_product", label: "منتج تالف" },
  { value: "wrong_product", label: "منتج خاطئ" },
  { value: "customer_changed_mind", label: "تغيير رأي العميل" },
  { value: "other", label: "سبب آخر" }
]

const cancelReasons = [
  { value: "customer_request", label: "طلب العميل" },
  { value: "out_of_stock", label: "نفاد المخزون" },
  { value: "pricing_error", label: "خطأ في السعر" },
  { value: "duplicate_order", label: "طلب مكرر" },
  { value: "fraud_suspected", label: "اشتباه احتيال" },
  { value: "other", label: "سبب آخر" }
]

export function ReturnCancelModal({
  open,
  onOpenChange,
  onConfirm,
  type,
  isLoading = false
}: ReturnCancelModalProps) {
  const [reason, setReason] = useState("")
  const [notes, setNotes] = useState("")

  const reasons = type === "return" ? returnReasons : cancelReasons
  const Icon = type === "return" ? RotateCcw : XCircle
  const title = type === "return" ? "تسجيل إرجاع الطلب" : "إلغاء الطلب"
  const description = type === "return" 
    ? "يرجى تحديد سبب الإرجاع. سيتم تسجيل هذا في سجل الطلب."
    : "يرجى تحديد سبب الإلغاء. لا يمكن التراجع عن هذا الإجراء."

  const handleConfirm = () => {
    onConfirm(reason, notes)
    setReason("")
    setNotes("")
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setReason("")
      setNotes("")
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              type === "return" ? "bg-warning/10" : "bg-destructive/10"
            }`}>
              <Icon className={`w-5 h-5 ${
                type === "return" ? "text-warning-foreground" : "text-destructive"
              }`} />
            </div>
            <div>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription className="mt-1">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>سبب {type === "return" ? "الإرجاع" : "الإلغاء"} *</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="اختر السبب" />
              </SelectTrigger>
              <SelectContent>
                {reasons.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>ملاحظات إضافية (اختياري)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أضف أي ملاحظات إضافية..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex-row-reverse gap-2 sm:gap-2">
          <Button
            onClick={handleConfirm}
            disabled={!reason || isLoading}
            variant={type === "return" ? "default" : "destructive"}
          >
            {isLoading ? "جاري التنفيذ..." : "تأكيد"}
          </Button>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isLoading}>
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
