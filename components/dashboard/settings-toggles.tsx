"use client"

import { Moon, Sun, Globe, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/providers/theme-provider"
import { useLanguage } from "@/components/providers/language-provider"
import { useCurrency } from "@/components/providers/currency-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="h-4 w-4 ml-2" />
          فاتح / Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="h-4 w-4 ml-2" />
          داكن / Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Globe className="h-4 w-4 ml-2" />
          النظام / System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 gap-2">
          <Globe className="h-4 w-4" />
          <span className="text-xs">{language === "ar" ? "عربي" : "EN"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t("common.language")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => setLanguage("ar")}
          className={language === "ar" ? "bg-accent" : ""}
        >
          <span className="ml-2">🇸🇦</span>
          العربية
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage("en")}
          className={language === "en" ? "bg-accent" : ""}
        >
          <span className="ml-2">🇺🇸</span>
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function CurrencyToggle() {
  const { currency, setCurrency, formatPrice } = useCurrency()
  const { t } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 gap-2">
          <DollarSign className="h-4 w-4" />
          <span className="text-xs">{currency === "ILS" ? "₪" : "$"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t("common.currency")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => setCurrency("ILS")}
          className={currency === "ILS" ? "bg-accent" : ""}
        >
          <span className="ml-2">₪</span>
          {t("currencies.ils")} (ILS)
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setCurrency("USD")}
          className={currency === "USD" ? "bg-accent" : ""}
        >
          <span className="ml-2">$</span>
          {t("currencies.usd")} (USD)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function SettingsBar() {
  return (
    <div className="flex items-center gap-1">
      <ThemeToggle />
      <LanguageToggle />
    </div>
  )
}
