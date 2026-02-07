"use client"

import { useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/components/providers/language-provider"
import { useTheme } from "@/components/providers/theme-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
    Store,
    User,
    Mail,
    Phone,
    Lock,
    CheckCircle,
    ArrowRight,
    ArrowLeft,
    Moon,
    Sun,
    Globe,
    Loader2,
    AlertCircle
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export default function MerchantRegisterPage() {
    const { t, language, setLanguage, isRTL } = useLanguage()
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({
        storeName: "",
        ownerName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        description: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
        // Clear error when user types
        if (error) setError("")
    }

    const validateForm = (): boolean => {
        setError("")

        if (formData.password !== formData.confirmPassword) {
            setError(t("error.passwordMismatch") || "Passwords do not match")
            return false
        }

        if (formData.password.length < 6) {
            setError(t("error.passwordLength") || "Password must be at least 6 characters")
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsLoading(true)

        // Simulate API call
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000))
            setIsSubmitted(true)
        } catch (err) {
            setError(t("common.unexpectedError"))
        } finally {
            setIsLoading(false)
        }
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
                </div>

                <Card className="max-w-md w-full p-8 text-center space-y-6 border-slate-200 dark:border-slate-800 card-shadow animate-fade-in-up backdrop-blur-sm bg-white/95 dark:bg-slate-900/95">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto animate-bounce-slow">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-green-600 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                        {t("merchantRegister.success")}
                    </h1>
                    <p className="text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                        {t("merchantRegister.successDesc")}
                    </p>
                    <Button asChild className="w-full button-hover animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
                        <Link href="/">
                            {t("merchantRegister.backToHome")}
                        </Link>
                    </Button>

// ... inside the form ...

                    <h1 className="text-3xl font-bold tracking-tight">{t("merchantRegister.title")}</h1>
                    <p className="text-muted-foreground text-lg">
                        {t("merchantRegister.desc")}
                    </p>

// ... inputs ...
                    <Label htmlFor="storeName">{t("merchantRegister.storeName")}</Label>
// ...
                    <Label htmlFor="ownerName">{t("merchantRegister.ownerName")}</Label>
// ...
                    <Label htmlFor="password">{t("merchantRegister.password")}</Label>
// ...
                    <Label htmlFor="confirmPassword">{t("merchantRegister.confirmPassword")}</Label>
// ...
                    <Label htmlFor="description">{t("merchantRegister.description")}</Label>
// ...
                    {isLoading ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                        <>
                            {t("merchantRegister.submit")}
                            <ArrowRight className="ml-2 w-4 h-4 rtl:rotate-180" />
                        </>
                    )}
// ...
                    <span className="text-muted-foreground">
                        {t("merchantRegister.alreadyHaveAccount")}{" "}
                    </span>
                    <Link href="/login" className="font-semibold text-primary hover:underline underline-offset-4 transition-all">
                        {t("merchantRegister.signIn")}
                    </Link>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
            <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out; }
        .animate-slide-in-right { animation: slideInRight 0.6s ease-out; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .input-focus { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .input-focus:focus { border-color: hsl(var(--primary)); box-shadow: 0 0 0 3px rgba(var(--primary), 0.1); }
        .button-hover { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .button-hover:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); }
        .card-shadow { box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08); }
        .dark .card-shadow { box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); }
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
                    <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
                    <span className="text-sm font-medium">{t("common.back")}</span>
                </Link>

                <div className="flex gap-2 animate-fade-in-up">
                    {/* Language Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="transition-all-smooth hover:scale-110">
                                <Globe className="w-5 h-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align={isRTL ? "start" : "end"}>
                            <DropdownMenuItem onClick={() => setLanguage("ar")} className={language === "ar" ? "bg-slate-100 dark:bg-slate-800" : ""}>
                                العربية
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setLanguage("en")} className={language === "en" ? "bg-slate-100 dark:bg-slate-800" : ""}>
                                English
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Theme Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="transition-all-smooth hover:scale-110">
                                {resolvedTheme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align={isRTL ? "start" : "end"}>
                            <DropdownMenuItem onClick={() => setTheme("light")} className={theme === "light" ? "bg-slate-100 dark:bg-slate-800" : ""}>
                                {t("settings.lightMode")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")} className={theme === "dark" ? "bg-slate-100 dark:bg-slate-800" : ""}>
                                {t("settings.darkMode")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("system")} className={theme === "system" ? "bg-slate-100 dark:bg-slate-800" : ""}>
                                {t("settings.systemMode")}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="w-full max-w-2xl animate-fade-in-up">
                    <div className="text-center space-y-4 mb-8">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto mb-4 shadow-lg animate-float">
                            <Store className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">{t("merchantRegister.title")}</h1>
                        <p className="text-muted-foreground text-lg">
                            {t("merchantRegister.desc")}
                        </p>
                    </div>

                    <Card className={cn(
                        "p-8 border-slate-200 dark:border-slate-800 card-shadow",
                        "backdrop-blur-sm bg-white/95 dark:bg-slate-900/95"
                    )}>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <Alert variant="destructive" className="animate-shake">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="storeName">{t("merchantRegister.storeName")}</Label>
                                    <div className="relative">
                                        <Store className="absolute top-3 w-4 h-4 text-muted-foreground left-3 rtl:right-3 rtl:left-auto" />
                                        <Input
                                            id="storeName"
                                            name="storeName"
                                            required
                                            className="pl-10 rtl:pr-10 rtl:pl-3 input-focus bg-slate-50 dark:bg-slate-800/50"
                                            value={formData.storeName}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ownerName">{t("merchantRegister.ownerName")}</Label>
                                    <div className="relative">
                                        <User className="absolute top-3 w-4 h-4 text-muted-foreground left-3 rtl:right-3 rtl:left-auto" />
                                        <Input
                                            id="ownerName"
                                            name="ownerName"
                                            required
                                            className="pl-10 rtl:pr-10 rtl:pl-3 input-focus bg-slate-50 dark:bg-slate-800/50"
                                            value={formData.ownerName}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">{t("common.email")}</Label>
                                    <div className="relative">
                                        <Mail className="absolute top-3 w-4 h-4 text-muted-foreground left-3 rtl:right-3 rtl:left-auto" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            className="pl-10 rtl:pr-10 rtl:pl-3 input-focus bg-slate-50 dark:bg-slate-800/50"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">{t("common.phone")}</Label>
                                    <div className="relative">
                                        <Phone className="absolute top-3 w-4 h-4 text-muted-foreground left-3 rtl:right-3 rtl:left-auto" />
                                        <Input
                                            id="phone"
                                            name="phone"
                                            required
                                            className="pl-10 rtl:pr-10 rtl:pl-3 input-focus bg-slate-50 dark:bg-slate-800/50"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">{t("merchantRegister.password")}</Label>
                                    <div className="relative">
                                        <Lock className="absolute top-3 w-4 h-4 text-muted-foreground left-3 rtl:right-3 rtl:left-auto" />
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            className="pl-10 rtl:pr-10 rtl:pl-3 input-focus bg-slate-50 dark:bg-slate-800/50"
                                            value={formData.password}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">{t("merchantRegister.confirmPassword")}</Label>
                                    <div className="relative">
                                        <Lock className="absolute top-3 w-4 h-4 text-muted-foreground left-3 rtl:right-3 rtl:left-auto" />
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            required
                                            className="pl-10 rtl:pr-10 rtl:pl-3 input-focus bg-slate-50 dark:bg-slate-800/50"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">{t("merchantRegister.description")}</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    required
                                    className="min-h-[100px] input-focus bg-slate-50 dark:bg-slate-800/50"
                                    value={formData.description}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full button-hover bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        {t("merchantRegister.submit")}
                                        <ArrowRight className="ml-2 w-4 h-4 rtl:rotate-180" />
                                    </>
                                )}
                            </Button>

                            <div className="text-center text-sm pt-4 border-t border-slate-100 dark:border-slate-800">
                                <span className="text-muted-foreground">
                                    {t("merchantRegister.alreadyHaveAccount")}{" "}
                                </span>
                                <Link href="/login" className="font-semibold text-primary hover:underline underline-offset-4 transition-all">
                                    {t("merchantRegister.signIn")}
                                </Link>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    )
}
