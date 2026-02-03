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
  Lock,
  Trash2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export default function UsersPage() {
  const { t, isRTL } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")

  const users = [
    {
      id: 1,
      name: "Ahmed Al-Mazrouei",
      email: "ahmed@electronics.ae",
      role: "owner",
      status: "active",
      lastActive: "2 hours ago",
      joinDate: "2023-01-15",
    },
    {
      id: 2,
      name: "Fatima Al-Ketbi",
      email: "fatima@fashionforward.ae",
      role: "owner",
      status: "active",
      lastActive: "1 hour ago",
      joinDate: "2023-02-20",
    },
    {
      id: 3,
      name: "Mohammed Al-Dhaheri",
      email: "mohammed@homeliving.ae",
      role: "staff",
      status: "active",
      lastActive: "30 minutes ago",
      joinDate: "2023-03-10",
    },
    {
      id: 4,
      name: "Layla Al-Marri",
      email: "layla@beautypro.ae",
      role: "owner",
      status: "inactive",
      lastActive: "5 days ago",
      joinDate: "2023-04-05",
    },
    {
      id: 5,
      name: "Ali Al-Mansoori",
      email: "ali@techhub.ae",
      role: "owner",
      status: "active",
      lastActive: "Just now",
      joinDate: "2023-05-12",
    },
    {
      id: 6,
      name: "Noor Al-Hashmi",
      email: "noor@systems.ae",
      role: "staff",
      status: "active",
      lastActive: "20 minutes ago",
      joinDate: "2023-06-08",
    },
  ]

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleLabel = (role: string) => {
    if (role === "owner") return t("roles.owner")
    if (role === "staff") return t("roles.staff")
    return role
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t("admin.users")}</h1>
          <p className="text-muted-foreground">{t("admin.usersDesc")}</p>
        </div>
        <Button>{t("common.add")} {t("admin.users")}</Button>
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

      {/* Users Table */}
      <Card className="border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("common.name")}</th>
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("common.email")}</th>
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("roles.role")}</th>
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("common.status")}</th>
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("users.lastActive")}</th>
                <th className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{t("admin.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className={cn("py-3 px-4 font-medium", isRTL ? "text-right" : "text-left")}>{user.name}</td>
                  <td className={cn("py-3 px-4 text-muted-foreground", isRTL ? "text-right" : "text-left")}>{user.email}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {user.role === "owner" && (
                        <Shield className="w-4 h-4 text-primary" />
                      )}
                      <span>{getRoleLabel(user.role)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={user.status === "active" ? "default" : "secondary"}
                    >
                      {user.status === "active"
                        ? t("common.active")
                        : t("users.inactive")}
                    </Badge>
                  </td>
                  <td className={cn("py-3 px-4 text-muted-foreground text-xs", isRTL ? "text-right" : "text-left")}>{user.lastActive}</td>
                  <td className="py-3 px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align={isRTL ? "start" : "end"}>
                        <DropdownMenuItem>
                          <Shield className="w-4 h-4 mr-2" />
                          {t("common.edit")}
                        </DropdownMenuItem>
                        {user.status === "active" ? (
                          <DropdownMenuItem className="text-destructive">
                            <Lock className="w-4 h-4 mr-2" />
                            {t("users.disableUser")}
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-green-600">
                            <Shield className="w-4 h-4 mr-2" />
                            {t("users.enableUser")}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive">
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
          <p className="text-sm text-muted-foreground mb-2">{t("admin.activeUsers")}</p>
          <p className="text-2xl font-bold text-primary">
            {users.filter(u => u.status === "active").length}
          </p>
          <p className="text-xs text-green-600 mt-2">All active users</p>
        </Card>
        <Card className="p-6 border-slate-200 dark:border-slate-800">
          <p className="text-sm text-muted-foreground mb-2">{t("roles.owners")}</p>
          <p className="text-2xl font-bold text-primary">
            {users.filter(u => u.role === "owner").length}
          </p>
        </Card>
        <Card className="p-6 border-slate-200 dark:border-slate-800">
          <p className="text-sm text-muted-foreground mb-2">{t("roles.staffMembers")}</p>
          <p className="text-2xl font-bold text-primary">
            {users.filter(u => u.role === "staff").length}
          </p>
        </Card>
        <Card className="p-6 border-slate-200 dark:border-slate-800">
          <p className="text-sm text-muted-foreground mb-2">{t("common.total")}</p>
          <p className="text-2xl font-bold text-primary">{users.length}</p>
          <p className="text-xs text-muted-foreground mt-2">{t("common.total")} {t("admin.users")}</p>
        </Card>
      </div>
    </div>
  )
}
