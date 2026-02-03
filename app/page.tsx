"use client"

import Link from "next/link"
import { useLanguage } from "@/components/providers/language-provider"
import { useTheme } from "@/components/providers/theme-provider"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ShoppingCart,
  Users,
  Truck,
  BarChart3,
  CreditCard,
  ArrowRight,
  Check,
  Moon,
  Sun,
  Globe,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function HomePage() {
  const { t, language, setLanguage } = useLanguage()
  const { theme, setTheme, resolvedTheme } = useTheme()

  const features = [
    {
      icon: ShoppingCart,
      title: t("home.orderManagement"),
      description: t("home.orderManagementDesc"),
    },
    {
      icon: Users,
      title: t("home.customerTracking"),
      description: t("home.customerTrackingDesc"),
    },
    {
      icon: Truck,
      title: t("home.deliveryManagement"),
      description: t("home.deliveryManagementDesc"),
    },
    {
      icon: CreditCard,
      title: t("home.paymentSupport"),
      description: t("home.paymentSupportDesc"),
    },
    {
      icon: BarChart3,
      title: t("home.reports"),
      description: t("home.reportsDesc"),
    },
  ]

  const steps = [
    {
      number: "1",
      title: t("home.step1"),
      description: t("home.step1Desc"),
    },
    {
      number: "2",
      title: t("home.step2"),
      description: t("home.step2Desc"),
    },
    {
      number: "3",
      title: t("home.step3"),
      description: t("home.step3Desc"),
    },
    {
      number: "4",
      title: t("home.step4"),
      description: t("home.step4Desc"),
    },
  ]

  const targetMarkets = [
    t("home.instagramSellers"),
    t("home.whatsappMerchants"),
    t("home.localStores"),
  ]

  const trustReasons = [
    {
      title: t("home.simplicity"),
      description: t("home.simplicityDesc"),
    },
    {
      title: t("home.reliability"),
      description: t("home.reliabilityDesc"),
    },
    {
      title: t("home.localFocus"),
      description: t("home.localFocusDesc"),
    },
  ]

  const testimonials = [
    {
      quote: t("home.testimonial1"),
      author: t("home.testimonial1Author"),
    },
    {
      quote: t("home.testimonial2"),
      author: t("home.testimonial2Author"),
    },
    {
      quote: t("home.testimonial3"),
      author: t("home.testimonial3Author"),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">
            {t("home.title")}
          </div>
          <div className="flex gap-2">
            {/* Language Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" title="Change language">
                  <Globe className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
                <Button variant="ghost" size="icon" title="Change theme">
                  {resolvedTheme === "dark" ? (
                    <Moon className="w-5 h-5" />
                  ) : (
                    <Sun className="w-5 h-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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

            <Button variant="ghost" asChild>
              <Link href="/login">{t("home.signIn")}</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              {t("home.heroHeading")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t("home.heroSubheading")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/login">{t("home.getStarted")}</Link>
            </Button>
            <Button size="lg" variant="outline">
              {t("home.requestDemo")}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t("home.features")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("home.tagline")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <Card
                key={idx}
                className="p-6 hover:shadow-lg transition-shadow border-slate-200 dark:border-slate-800"
              >
                <Icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            )
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-slate-100/50 dark:bg-slate-800/20 rounded-lg my-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t("home.howItWorks")}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Target Market Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t("home.targetMarket")}</h2>
          <p className="text-muted-foreground">
            {t("home.tagline")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {targetMarkets.map((market, idx) => (
            <div key={idx} className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
              <Check className="w-6 h-6 text-green-600 flex-shrink-0" />
              <span className="font-medium">{market}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t("home.trust")}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustReasons.map((reason, idx) => (
            <Card
              key={idx}
              className="p-8 text-center border-slate-200 dark:border-slate-800"
            >
              <h3 className="font-semibold text-lg mb-3">{reason.title}</h3>
              <p className="text-muted-foreground">{reason.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-slate-100/50 dark:bg-slate-800/20 rounded-lg my-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t("home.testimonials")}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <Card
              key={idx}
              className="p-6 border-slate-200 dark:border-slate-800 flex flex-col"
            >
              <p className="text-muted-foreground mb-4 flex-grow">
                "{testimonial.quote}"
              </p>
              <p className="font-medium text-sm">{testimonial.author}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-primary text-primary-foreground rounded-lg p-12 text-center space-y-6">
          <h2 className="text-3xl font-bold">{t("home.footerDesc")}</h2>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/login">{t("home.getStarted")}</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">{t("home.footer")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    {t("home.support")}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t("common.dashboard")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/login" className="hover:text-foreground">
                    {t("home.signIn")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t("common.legal")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    {t("home.privacy")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    {t("home.terms")}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t("home.title")}</h4>
              <p className="text-sm text-muted-foreground">
                {t("home.tagline")}
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>{t("home.copyright")} © 2024</p>
            <p>{t("home.title")}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
