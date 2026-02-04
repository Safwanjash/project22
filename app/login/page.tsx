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
import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Moon,
  Sun,
  Globe,
  ArrowLeft,
  Lock,
  Mail,
  CheckCircle,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const { t, language, setLanguage, isRTL } = useLanguage()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

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

      setSuccess(true)
      // Redirect after brief success message
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } catch (err) {
      setError(t("login.invalidCredentials"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(var(--color-primary), 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(var(--color-primary), 0.6);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.6s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .input-focus {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .input-focus:focus {
          border-color: hsl(var(--primary));
          box-shadow: 0 0 0 3px rgba(var(--primary), 0.1);
        }

        .button-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .button-hover:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .button-hover:active:not(:disabled) {
          transform: translateY(0);
        }

        .card-shadow {
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
        }

        .dark .card-shadow {
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
      `}</style>

      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Header */}
      <div className={cn(
        "flex justify-between items-center p-4 fixed top-0 left-0 right-0 z-50",
        "bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-b border-slate-200 dark:border-slate-800"
      )}>
        <Link href="/" className={cn(
          "flex items-center gap-2 text-primary hover:text-primary/80 transition-colors animate-fade-in-up",
          isRTL && "flex-row-reverse"
        )}>
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">{t("common.back")}</span>
        </Link>

        <div className="flex gap-2 animate-fade-in-up">
          {/* Language Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                title="Change language"
                className="transition-all-smooth hover:scale-110"
              >
                <Globe className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? "start" : "end"}>
              <DropdownMenuItem
                onClick={() => setLanguage("ar")}
                className={language === "ar" ? "bg-slate-100 dark:bg-slate-800" : ""}
              >
                العربية
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage("en")}
                className={language === "en" ? "bg-slate-100 dark:bg-slate-800" : ""}
              >
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                title="Change theme"
                className="transition-all-smooth hover:scale-110"
              >
                {resolvedTheme === "dark" ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? "start" : "end"}>
              <DropdownMenuItem
                onClick={() => setTheme("light")}
                className={theme === "light" ? "bg-slate-100 dark:bg-slate-800" : ""}
              >
                {t("settings.lightMode")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("dark")}
                className={theme === "dark" ? "bg-slate-100 dark:bg-slate-800" : ""}
              >
                {t("settings.darkMode")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("system")}
                className={theme === "system" ? "bg-slate-100 dark:bg-slate-800" : ""}
              >
                {t("settings.systemMode")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Login Container */}
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Logo/Title Section */}
          <div className={cn(
            "text-center mb-10 space-y-2 animate-fade-in-up",
            "animation-delay-100"
          )}>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              {t("login.title")}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t("login.subtitle")}
            </p>
          </div>

          {/* Info Section */}
          <div className="text-center mb-8 p-6 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20 dark:border-primary/30 animate-slide-in-right">
            <p className="text-sm font-medium text-foreground mb-1">
              {t("login.welcome")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("login.tagline")}
            </p>
          </div>

          {/* Login Card */}
          <Card className={cn(
            "p-8 border-slate-200 dark:border-slate-800 card-shadow",
            "animate-fade-in-up backdrop-blur-sm bg-white/95 dark:bg-slate-900/95"
          )}>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className={cn(
                  "animate-shake border-destructive/50 bg-destructive/10",
                  "dark:bg-destructive/20 dark:border-destructive/50"
                )}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-destructive/90 dark:text-destructive/80">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Success Alert */}
              {success && (
                <Alert className="border-green-500/50 bg-green-500/10 dark:bg-green-500/20">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-600 dark:text-green-400">
                    {t("common.success")}
                  </AlertDescription>
                </Alert>
              )}

              {/* Email Field */}
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  {t("login.email")}
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder={t("login.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || success}
                  className={cn(
                    "h-11 px-4 input-focus",
                    "bg-slate-50 dark:bg-slate-800/50",
                    "border-slate-300 dark:border-slate-700",
                    "focus:bg-white dark:focus:bg-slate-800",
                    isRTL && "text-right"
                  )}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" />
                    {t("login.password")}
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className={cn(
                      "h-6 px-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-800",
                      "transition-all-smooth"
                    )}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    )}
                  </Button>
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("login.passwordPlaceholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading || success}
                  className={cn(
                    "h-11 px-4 input-focus",
                    "bg-slate-50 dark:bg-slate-800/50",
                    "border-slate-300 dark:border-slate-700",
                    "focus:bg-white dark:focus:bg-slate-800",
                    isRTL && "text-right"
                  )}
                />
              </div>

              {/* Forgot Password Link */}
              <div className="text-right pt-1">
                <Link
                  href="#"
                  className="text-sm text-primary hover:text-primary/80 transition-colors hover:underline underline-offset-2"
                >
                  {t("login.forgotPassword")}
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                size="lg"
                disabled={isLoading || success}
                className={cn(
                  "w-full h-12 mt-6 button-hover font-semibold text-base",
                  "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80",
                  success && "bg-green-600"
                )}
              >
                {success && <CheckCircle className="mr-2 h-5 w-5" />}
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {success ? t("common.success") : isLoading ? t("login.loggingIn") : t("login.loginBtn")}
              </Button>
            </form>

            {/* Contact Support Link */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
              <p className="text-sm text-muted-foreground">
                {t("login.contactSupport")}?{" "}
                <Link
                  href="#"
                  className="text-primary hover:text-primary/80 font-medium transition-colors hover:underline underline-offset-2"
                >
                  {t("home.support")}
                </Link>
              </p>
            </div>
          </Card>

          {/* Additional Info */}
          <div className="mt-8 text-center text-xs text-muted-foreground space-y-2">
            <p>
              {t("login.welcome")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
