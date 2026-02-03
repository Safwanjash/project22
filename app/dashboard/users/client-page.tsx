"use client"

import { useState, useActionState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Plus,
    Search,
    MoreVertical,
    Shield,
    User as UserIcon,
    Edit,
    UserX,
    UserCheck,
    Mail,
    Phone,
    Loader2
} from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { createUser, updateUser, toggleUserStatus } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/components/providers/language-provider"
import type { User } from "@/lib/types"

interface UsersClientPageProps {
    initialUsers: User[]
}

const initialState = {
    success: false,
    message: "",
    errors: undefined
}

// removed roleLabels and roleDescriptions arrays

export default function UsersClientPage({ initialUsers }: UsersClientPageProps) {
    const { t, isRTL } = useLanguage()
    const { toast } = useToast()
    const [users, setUsers] = useState<User[]>(initialUsers)
    const [searchQuery, setSearchQuery] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [statusUser, setStatusUser] = useState<User | null>(null)

    useEffect(() => {
        setUsers(initialUsers)
    }, [initialUsers])

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone?.includes(searchQuery)
    )

    // Create Action
    const [createState, createAction, isCreating] = useActionState(createUser, initialState)

    useEffect(() => {
        if (createState.success) {
            setIsAddDialogOpen(false)
            toast({ title: t("common.success"), description: createState.message, variant: "default" })
        } else if (createState.message) {
            toast({ title: t("common.error"), description: createState.message, variant: "destructive" })
        }
    }, [createState, toast])

    // Update Action
    const [updateState, updateAction, isUpdating] = useActionState(updateUser, initialState)

    useEffect(() => {
        if (updateState.success) {
            setEditingUser(null)
            toast({ title: t("common.success"), description: updateState.message, variant: "default" })
        } else if (updateState.message) {
            toast({ title: t("common.error"), description: updateState.message, variant: "destructive" })
        }
    }, [updateState, toast])

    const handleToggleStatus = async () => {
        if (!statusUser) return
        const result = await toggleUserStatus(statusUser.id)
        if (result.success) {
            toast({ title: t("common.success"), description: result.message })
            setStatusUser(null)
        } else {
            toast({ title: t("common.error"), description: result.message, variant: "destructive" })
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">{t("settings.users")}</h1>
                    <p className="text-muted-foreground">{t("settings.usersDesc")}</p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                            {t("settings.addUser")}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t("settings.addUser")}</DialogTitle>
                            <DialogDescription>
                                {t("settings.addUserDesc")}
                            </DialogDescription>
                        </DialogHeader>
                        <form action={createAction} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>{t("customers.customerName")} *</Label>
                                <Input name="name" placeholder={t("customers.customerName")} />
                                {createState.errors?.name && <p className="text-sm text-red-500">{createState.errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>{t("common.email")} *</Label>
                                <Input name="email" type="email" placeholder="email@example.com" dir="ltr" />
                                {createState.errors?.email && <p className="text-sm text-red-500">{createState.errors.email}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>{t("common.phone")}</Label>
                                <Input name="phone" placeholder="05xxxxxxxx" dir="ltr" />
                            </div>
                            <div className="space-y-2">
                                <Label>{t("roles.role")} *</Label>
                                <Select name="role" defaultValue="staff">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="owner">
                                            <div className="flex items-center gap-2">
                                                <Shield className="w-4 h-4" />
                                                {t("roles.owner")}
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="staff">
                                            <div className="flex items-center gap-2">
                                                <UserIcon className="w-4 h-4" />
                                                {t("roles.staff")}
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {createState.errors?.role && <p className="text-sm text-red-500">{createState.errors.role}</p>}
                            </div>
                            <Button className="w-full" disabled={isCreating}>
                                {isCreating ? <Loader2 className="animate-spin" /> : t("settings.addUser")}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Role Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{users.filter(u => u.role === "owner").length}</p>
                                <p className="text-sm text-muted-foreground">{t("roles.owners")}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-info/10 flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-info" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{users.filter(u => u.role === "staff").length}</p>
                                <p className="text-sm text-muted-foreground">{t("roles.staffMembers")}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                                <UserCheck className="w-5 h-5 text-success" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{users.filter(u => u.status === "active").length}</p>
                                <p className="text-sm text-muted-foreground">{t("products.active")}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className={isRTL ? "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" : "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"} />
                <Input
                    placeholder={t("common.searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={isRTL ? "pr-10" : "pl-10"}
                />
            </div>

            {/* Users List */}
            {filteredUsers.length === 0 ? (
                <EmptyState
                    type="users"
                    onAction={() => setIsAddDialogOpen(true)}
                />
            ) : (
                <div className="space-y-3">
                    {filteredUsers.map((user) => (
                        <Card key={user.id}>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                                        {user.role === "owner" ? (
                                            <Shield className="w-6 h-6 text-primary" />
                                        ) : (
                                            <UserIcon className="w-6 h-6 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-semibold">{user.name}</h3>
                                            <Badge variant={user.role === "owner" ? "default" : "secondary"}>
                                                {user.role === "owner" ? t("roles.owner") : t("roles.staff")}
                                            </Badge>
                                            <Badge variant={user.status === "active" ? "outline" : "destructive"}>
                                                {user.status === "active" ? t("products.active") : t("products.inactive")}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                                            <span className="flex items-center gap-1">
                                                <Mail className="w-3 h-3" />
                                                {user.email}
                                            </span>
                                            {user.phone && (
                                                <span className="flex items-center gap-1">
                                                    <Phone className="w-3 h-3" />
                                                    {user.phone}
                                                </span>
                                            )}
                                        </div>
                                        {user.lastActive && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {t("common.lastActive")}: {user.lastActive}
                                            </p>
                                        )}
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => setEditingUser(user)}>
                                                <Edit className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                                                {t("common.edit")}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => setStatusUser(user)}
                                                className={user.status === "active" ? "text-destructive" : "text-success"}
                                            >
                                                {user.status === "active" ? (
                                                    <>
                                                        <UserX className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                                                        {t("common.disable")}
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserCheck className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                                                        {t("common.enable")}
                                                    </>
                                                )}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("common.edit")}</DialogTitle>
                    </DialogHeader>
                    {editingUser && (
                        <form action={updateAction} className="space-y-4 py-4">
                            <input type="hidden" name="id" value={editingUser.id} />
                            <div className="space-y-2">
                                <Label>{t("customers.customerName")}</Label>
                                <Input name="name" defaultValue={editingUser.name} />
                                {editingUser.id === editingUser?.id && updateState.errors?.name && <p className="text-sm text-red-500">{updateState.errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>{t("common.email")}</Label>
                                <Input name="email" type="email" defaultValue={editingUser.email} dir="ltr" />
                                {editingUser.id === editingUser?.id && updateState.errors?.email && <p className="text-sm text-red-500">{updateState.errors.email}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>{t("common.phone")}</Label>
                                <Input name="phone" defaultValue={editingUser.phone} dir="ltr" />
                            </div>
                            <div className="space-y-2">
                                <Label>{t("roles.role")}</Label>
                                <Select name="role" defaultValue={editingUser.role}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="owner">{t("roles.owner")}</SelectItem>
                                        <SelectItem value="staff">{t("roles.staff")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter className="flex-row-reverse gap-2">
                                <Button type="submit" disabled={isUpdating}>
                                    {isUpdating ? <Loader2 className="animate-spin" /> : t("common.save")}
                                </Button>
                                <Button variant="outline" type="button" onClick={() => setEditingUser(null)}>
                                    {t("common.cancel")}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Disable/Enable Confirmation */}
            <ConfirmationDialog
                open={!!statusUser}
                onOpenChange={(open) => !open && setStatusUser(null)}
                onConfirm={handleToggleStatus}
                type={statusUser?.status === "active" ? "warning" : "info"}
                title={statusUser?.status === "active" ? t("common.disableUser") : t("common.enableUser")}
                description={
                    statusUser?.status === "active"
                        ? `${t("common.disableUserDesc")} "${statusUser?.name}".`
                        : `${t("common.enableUserDesc")} "${statusUser?.name}".`
                }
                confirmLabel={statusUser?.status === "active" ? t("common.disable") : t("common.enable")}
            />
        </div>
    )
}
