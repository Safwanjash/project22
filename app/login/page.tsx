"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/providers/language-provider"
import { useTheme } from "@/components/providers/theme-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { AlertCircle, Eye, EyeOff, Loader2, Moon, Sun, Globe } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function LoginPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const validateForm = (): boolean => {
    setError("")

    if (!email.trim()) {
      setError(t("login.emptyEmail"))
      return false
    }

    if (!password.trim()) {
      setError(t("login.emptyPassword"))
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, redirect to dashboard
      // In a real app, you would validate credentials against a backend
      router.push("/dashboard")
    } catch (err) {
      setError(t("login.invalidCredentials"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{t("login.title")}</h1>
          <p className="text-muted-foreground">{t("login.subtitle")}</p>
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-foreground font-medium mb-1">
              {t("login.welcome")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("login.tagline")}
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="p-8 border-slate-200 dark:border-slate-700 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">{t("login.email")}</Label>
              <Input
                id="email"
                type="text"
                placeholder={t("login.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="h-11"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t("login.password")}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="h-6 px-2 text-xs"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={t("login.passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-11"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                href="#"
                className="text-sm text-primary hover:underline"
              >
                {t("login.forgotPassword")}
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full h-11"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? t("login.loggingIn") : t("login.loginBtn")}
            </Button>
          </form>

          {/* Contact Support Link */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
            <p className="text-sm text-muted-foreground">
              {t("login.contactSupport")}?{" "}
              <Link href="#" className="text-primary hover:underline">
                {t("common.back")}
              </Link>
            </p>
          </div>
        </Card>

        {/* Back to Home Link */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-sm text-primary hover:underline flex items-center justify-center gap-2"
          >
            <span>←</span>
            {t("common.back")}
          </Link>
        </div>
      </div>
    </div>
  )
}
