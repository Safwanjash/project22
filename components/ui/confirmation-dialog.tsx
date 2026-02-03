"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertTriangle, Trash2, XCircle, RotateCcw, CheckCircle } from "lucide-react"

interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  type?: "danger" | "warning" | "info"
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  isLoading?: boolean
}

const typeConfig = {
  danger: {
    icon: Trash2,
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
    buttonVariant: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
  },
  warning: {
    icon: AlertTriangle,
    iconBg: "bg-warning/10",
    iconColor: "text-warning-foreground",
    buttonVariant: "bg-warning text-warning-foreground hover:bg-warning/90"
  },
  info: {
    icon: CheckCircle,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    buttonVariant: "bg-primary text-primary-foreground hover:bg-primary/90"
  }
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  type = "danger",
  title,
  description,
  confirmLabel = "تأكيد",
  cancelLabel = "إلغاء",
  isLoading = false
}: ConfirmationDialogProps) {
  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-full ${config.iconBg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-6 h-6 ${config.iconColor}`} />
            </div>
            <div>
              <AlertDialogTitle className="text-right">{title}</AlertDialogTitle>
              <AlertDialogDescription className="text-right mt-2">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row-reverse gap-2 sm:gap-2">
          <AlertDialogAction 
            onClick={onConfirm}
            className={config.buttonVariant}
            disabled={isLoading}
          >
            {isLoading ? "جاري التنفيذ..." : confirmLabel}
          </AlertDialogAction>
          <AlertDialogCancel disabled={isLoading}>
            {cancelLabel}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Pre-configured confirmation dialogs
export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  itemName,
  isLoading
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  itemName: string
  isLoading?: boolean
}) {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      type="danger"
      title={`حذف ${itemName}`}
      description={`هل أنت متأكد من حذف ${itemName}؟ لا يمكن التراجع عن هذا الإجراء.`}
      confirmLabel="حذف"
      isLoading={isLoading}
    />
  )
}

export function StatusChangeDialog({
  open,
  onOpenChange,
  onConfirm,
  fromStatus,
  toStatus,
  isLoading
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  fromStatus: string
  toStatus: string
  isLoading?: boolean
}) {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      type="warning"
      title="تغيير حالة الطلب"
      description={`سيتم تغيير حالة الطلب من "${fromStatus}" إلى "${toStatus}". هل تريد المتابعة؟`}
      confirmLabel="تأكيد التغيير"
      isLoading={isLoading}
    />
  )
}
