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
  Shield,
  ShieldCheck,
  Lock,
  Unlock,
  Trash2,
  UserPlus,
  Mail,
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type AdminRole = "super_admin" | "admin" | "support" | "viewer"

interface PlatformAdmin {
  id: number
  name: string
  email: string
  role: AdminRole
  status: "active" | "inactive"
  lastActive: string
  joinDate: string
}

const initialAdmins: PlatformAdmin[] = [
  {
    id: 1,
    name: "Mohammed Al-Rashid",
    email: "mohammed@platform.ae",
    role: "super_admin",
    status: "active",
    lastActive: "Just now",
    joinDate: "2022-06-01",
  },
  {
    id: 2,
    name: "Sara Al-Ketbi",
    email: "sara@platform.ae",
    role: "admin",
    status: "active",
    lastActive: "2 hours ago",
    joinDate: "2023-01-15",
  },
  {
    id: 3,
    name: "Ahmed Hassan",
    email: "ahmed@platform.ae",
    role: "support",
    status: "active",
    lastActive: "30 minutes ago",
    joinDate: "2023-03-20",
  },
  {
    id: 4,
    name: "Fatima Al-Mazrouei",
    email: "fatima@platform.ae",
    role: "support",
    status: "active",
    lastActive: "1 hour ago",
    joinDate: "2023-05-10",
  },
  {
    id: 5,
    name: "Khalid Al-Mansoori",
    email: "khalid@platform.ae",
    role: "viewer",
    status: "inactive",
    lastActive: "5 days ago",
    joinDate: "2023-08-25",
  },
  {
    id: 6,
    name: "Noura Al-Shamsi",
    email: "noura@platform.ae",
    role: "admin",
    status: "active",
    lastActive: "15 minutes ago",
    joinDate: "2023-11-01",
  },
]

export default function UsersPage() {
  const { t, isRTL } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [admins, setAdmins] = useState<PlatformAdmin[]>(initialAdmins)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<AdminRole>("admin")
  const [inviteName, setInviteName] = useState("")
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [changeRoleDialog, setChangeRoleDialog] = useState<{ open: boolean; admin: PlatformAdmin | null }>({ open: false, admin: null })
  const [newRole, setNewRole] = useState<AdminRole>("admin")
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    type: "disable" | "enable" | "delete" | null
    admin: PlatformAdmin | null
  }>({ open: false, type: null, admin: null })

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleLabel = (role: AdminRole) => {
    switch (role) {
      case "super_admin":
        return t("admin.superAdmin")
      case "admin":
        return t("admin.adminRole")
      case "support":
        return t("admin.supportRole")
      case "viewer":
        return t("admin.viewerRole")
      default:
        return role
    }
  }

  const getRoleBadgeVariant = (role: AdminRole) => {
    switch (role) {
      case "super_admin":
        return "default"
      case "admin":
        return "default"
      case "support":
        return "secondary"
      case "viewer":
        return "outline"
      default:
        return "secondary"
    }
  }

  const handleInvite = () => {
    if (!inviteEmail || !inviteName) return

    const newAdmin: PlatformAdmin = {
      id: Math.max(...admins.map(a => a.id)) + 1,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      status: "active",
      lastActive: "Just invited",
      joinDate: new Date().toISOString().split("T")[0],
    }

    setAdmins([...admins, newAdmin])
    setInviteDialogOpen(false)
    setInviteEmail("")
    setInviteName("")
    setInviteRole("admin")
    showToast(`${t("admin.inviteAdmin")}: ${inviteName}`)
  }

  const handleChangeRole = () => {
    if (!changeRoleDialog.admin) return

    setAdmins(admins.map(admin =>
      admin.id === changeRoleDialog.admin!.id
        ? { ...admin, role: newRole }
        : admin
    ))
    setChangeRoleDialog({ open: false, admin: null })
    showToast(`${t("admin.changeRole")}: ${changeRoleDialog.admin.name} → ${getRoleLabel(newRole)}`)
  }

  const handleConfirmAction = () => {
    if (!confirmDialog.admin || !confirmDialog.type) return

    switch (confirmDialog.type) {
      case "disable":
        setAdmins(admins.map(admin =>
          admin.id === confirmDialog.admin!.id
            ? { ...admin, status: "inactive" }
            : admin
        ))
        showToast(`${t("common.disable")}: ${confirmDialog.admin.name}`)
        break
      case "enable":
        setAdmins(admins.map(admin =>
          admin.id === confirmDialog.admin!.id
            ? { ...admin, status: "active" }
            : admin
        ))
        showToast(`${t("common.enable")}: ${confirmDialog.admin.name}`)
        break
      case "delete":
        setAdmins(admins.filter(admin => admin.id !== confirmDialog.admin!.id))
        showToast(`${t("common.delete")}: ${confirmDialog.admin.name}`)
        break
    }

    setConfirmDialog({ open: false, type: null, admin: null })
  }

  const handleExport = () => {
    const headers = ["Name", "Email", "Role", "Status", "Last Active", "Join Date"]
    const csvContent = [
      headers.join(","),
      ...admins.map(admin => [
        admin.name,
        admin.email,
        admin.role,
        admin.status,
        admin.lastActive,
        admin.joinDate
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `platform_admins_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
    showToast(t("common.export"))
  }

  const getConfirmDialogContent = () => {
    const { type, admin } = confirmDialog
    if (!type || !admin) return { title: "", description: "", buttonText: "", buttonVariant: "default" as const }

    switch (type) {
      case "disable":
        return {
          title: t("common.disableUser"),
          description: t("common.disableUserDesc"),
          buttonText: t("common.disable"),
          buttonVariant: "destructive" as const,
        }
      case "enable":
        return {
          title: t("common.enableUser"),
          description: t("common.enableUserDesc"),
          buttonText: t("common.enable"),
          buttonVariant: "default" as const,
        }
      case "delete":
        return {
          title: t("users.deleteUser"),
          description: t("users.confirmDelete"),
          buttonText: t("common.delete"),
          buttonVariant: "destructive" as const,
        }
    }
  }

  const confirmDialogContent = getConfirmDialogContent()

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
          <h1 className="text-3xl font-bold">{t("admin.platformAdmins")}</h1>
          <p className="text-muted-foreground">{t("admin.platformAdminsDesc")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            {t("common.export")}
          </Button>
          <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                {t("admin.inviteAdmin")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("admin.inviteAdmin")}</DialogTitle>
                <DialogDescription>
                  {t("admin.inviteAdminDesc")}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("common.name")}</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("common.email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">{t("admin.role")}</Label>
                  <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as AdminRole)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">{t("admin.adminRole")}</SelectItem>
                      <SelectItem value="support">{t("admin.supportRole")}</SelectItem>
                      <SelectItem value="viewer">{t("admin.viewerRole")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                  {t("common.cancel")}
                </Button>
                <Button onClick={handleInvite} disabled={!inviteEmail || !inviteName}>
                  <Mail className="w-4 h-4 mr-2" />
                  {t("admin.sendInvite")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

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

      {/* Admins Table */}
      <Card className="border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("common.name")}</th>
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("common.email")}</th>
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("admin.role")}</th>
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("common.status")}</th>
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("users.lastActive")}</th>
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("admin.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((admin) => (
                <tr
                  key={admin.id}
                  className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>
                    <div className="flex items-center gap-2">
                      {admin.role === "super_admin" && (
                        <ShieldCheck className="w-4 h-4 text-primary" />
                      )}
                      {admin.name}
                    </div>
                  </td>
                  <td className={cn("py-3 px-4 text-muted-foreground", isRTL ? "text-right" : "text-left")}>{admin.email}</td>
                  <td className="py-3 px-4">
                    <Badge variant={getRoleBadgeVariant(admin.role) as any}>
                      {getRoleLabel(admin.role)}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={admin.status === "active" ? "default" : "secondary"}
                    >
                      {admin.status === "active"
                        ? t("common.active")
                        : t("users.inactive")}
                    </Badge>
                  </td>
                  <td className={cn("py-3 px-4 text-muted-foreground text-xs", isRTL ? "text-right" : "text-left")}>{admin.lastActive}</td>
                  <td className="py-3 px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={admin.role === "super_admin"}>
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align={isRTL ? "start" : "end"}>
                        <DropdownMenuItem onClick={() => {
                          setNewRole(admin.role)
                          setChangeRoleDialog({ open: true, admin })
                        }}>
                          <Shield className="w-4 h-4 mr-2" />
                          {t("admin.changeRole")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {admin.status === "active" ? (
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setConfirmDialog({ open: true, type: "disable", admin })}
                          >
                            <Lock className="w-4 h-4 mr-2" />
                            {t("common.disableUser")}
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="text-green-600"
                            onClick={() => setConfirmDialog({ open: true, type: "enable", admin })}
                          >
                            <Unlock className="w-4 h-4 mr-2" />
                            {t("common.enableUser")}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setConfirmDialog({ open: true, type: "delete", admin })}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {t("common.delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
          <p className="text-sm text-muted-foreground mb-2">{t("common.total")} {t("admin.platformAdmins")}</p>
          <p className="text-2xl font-bold text-primary">{admins.length}</p>
        </Card>
        <Card className="p-6 border-slate-200 dark:border-slate-800">
          <p className="text-sm text-muted-foreground mb-2">{t("admin.superAdmin")}</p>
          <p className="text-2xl font-bold text-primary">
            {admins.filter(a => a.role === "super_admin").length}
          </p>
        </Card>
        <Card className="p-6 border-slate-200 dark:border-slate-800">
          <p className="text-sm text-muted-foreground mb-2">{t("admin.adminRole")} & {t("admin.supportRole")}</p>
          <p className="text-2xl font-bold text-primary">
            {admins.filter(a => a.role === "admin" || a.role === "support").length}
          </p>
        </Card>
        <Card className="p-6 border-slate-200 dark:border-slate-800">
          <p className="text-sm text-muted-foreground mb-2">{t("common.active")}</p>
          <p className="text-2xl font-bold text-green-600">
            {admins.filter(a => a.status === "active").length}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {admins.filter(a => a.status === "inactive").length} {t("users.inactive")}
          </p>
        </Card>
      </div>

      {/* Change Role Dialog */}
      <Dialog open={changeRoleDialog.open} onOpenChange={(open) => !open && setChangeRoleDialog({ open: false, admin: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("admin.changeRole")}</DialogTitle>
            <DialogDescription>
              {changeRoleDialog.admin?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="newRole">{t("admin.role")}</Label>
            <Select value={newRole} onValueChange={(v) => setNewRole(v as AdminRole)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">{t("admin.adminRole")}</SelectItem>
                <SelectItem value="support">{t("admin.supportRole")}</SelectItem>
                <SelectItem value="viewer">{t("admin.viewerRole")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangeRoleDialog({ open: false, admin: null })}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleChangeRole}>
              {t("common.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Action Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => !open && setConfirmDialog({ open: false, type: null, admin: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmDialogContent.title}</DialogTitle>
            <DialogDescription>{confirmDialogContent.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog({ open: false, type: null, admin: null })}>
              {t("common.cancel")}
            </Button>
            <Button variant={confirmDialogContent.buttonVariant} onClick={handleConfirmAction}>
              {confirmDialogContent.buttonText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
