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
  Zap,
  Shield,
  Smile,
  Store,
  Smartphone,
  TrendingUp,
  Package,
  Menu
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export default function HomePage() {
  const { t, language, setLanguage } = useLanguage()
  const { theme, setTheme, resolvedTheme } = useTheme()

  const features = [
    {
      icon: ShoppingCart,
      title: t("home.orderManagement"),
      description: t("home.orderManagementDesc"),
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      title: t("home.customerTracking"),
      description: t("home.customerTrackingDesc"),
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Truck,
      title: t("home.deliveryManagement"),
      description: t("home.deliveryManagementDesc"),
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: CreditCard,
      title: t("home.paymentSupport"),
      description: t("home.paymentSupportDesc"),
      color: "from-orange-500 to-red-500",
    },
    {
      icon: BarChart3,
      title: t("home.reports"),
      description: t("home.reportsDesc"),
      color: "from-indigo-500 to-blue-500",
    },
  ]

  const steps = [
    {
      number: "1",
      title: t("home.step1"),
      description: t("home.step1Desc"),
      icon: Smile,
    },
    {
      number: "2",
      title: t("home.step2"),
      description: t("home.step2Desc"),
      icon: ShoppingCart,
    },
    {
      number: "3",
      title: t("home.step3"),
      description: t("home.step3Desc"),
      icon: Zap,
    },
    {
      number: "4",
      title: t("home.step4"),
      description: t("home.step4Desc"),
      icon: BarChart3,
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
      icon: Smile,
    },
    {
      title: t("home.reliability"),
      description: t("home.reliabilityDesc"),
      icon: Shield,
    },
    {
      title: t("home.localFocus"),
      description: t("home.localFocusDesc"),
      icon: Zap,
    },
  ]

  const testimonials = [
    {
      quote: t("home.testimonial1"),
      author: t("home.testimonial1Author"),
      rating: 5,
    },
    {
      quote: t("home.testimonial2"),
      author: t("home.testimonial2Author"),
      rating: 5,
    },
    {
      quote: t("home.testimonial3"),
      author: t("home.testimonial3Author"),
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
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

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
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

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
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

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(var(--color-primary), 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(var(--color-primary), 0.6);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.6s ease-out;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.6s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .group-hover\\:scale-105:hover {
          transform: scale(1.05);
        }

        .transition-all-smooth {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover {
          transition: all 0.3s ease;
        }

        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .dark .card-hover:hover {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .feature-icon {
          transition: all 0.3s ease;
        }

        .feature-card:hover .feature-icon {
          transform: scale(1.2) rotate(5deg);
        }

        .section-divider {
          background: linear-gradient(to right, transparent, currentColor, transparent);
          opacity: 0.1;
          height: 1px;
          margin: 4rem 0;
        }

        .gradient-text {
          background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary animate-fade-in-up">
            {t("home.title")}
          </div>
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

            <Button
              variant="default"
              asChild
              className="hidden sm:inline-flex transition-all-smooth hover:scale-105"
            >
              <Link href="/merchant-register">{t("registerStore")}</Link>
            </Button>
            <Button
              variant="ghost"
              asChild
              className="hidden sm:inline-flex transition-all-smooth hover:bg-primary hover:text-primary-foreground"
            >
              <Link href="/login">{t("home.signIn")}</Link>
            </Button>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col gap-6 py-4">
                    <div className="flex items-center gap-2 px-2">
                      <Store className="w-6 h-6 text-primary" />
                      <span className="text-xl font-bold">{t("home.title")}</span>
                    </div>
                    <nav className="flex flex-col gap-4">
                      {["features", "howItWorks", "testimonials"].map((item) => (
                        <a
                          key={item}
                          href={`#${item}`}
                          className="block px-2 py-1 text-lg font-medium hover:text-primary transition-colors"
                        >
                          {t(`home.${item}`)}
                        </a>
                      ))}
                      <Link
                        href="/login"
                        className="block px-2 py-1 text-lg font-medium hover:text-primary transition-colors"
                      >
                        {t("home.signIn")}
                      </Link>
                      <Link
                        href="/merchant-register"
                        className="block px-2 py-1 text-lg font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        {t("registerStore")}
                      </Link>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
        </div>

        <div className="text-center space-y-8">
          <div className="space-y-4 animate-fade-in-up">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              {t("home.heroHeading")}
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t("home.heroSubheading")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <Button
              size="lg"
              className="relative overflow-hidden group transition-all-smooth hover:scale-105"
              asChild
            >
              <Link href="/login">
                {t("home.getStarted")}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="transition-all-smooth hover:scale-105 hover:border-primary hover:bg-primary/5"
            >
              {t("home.requestDemo")}
            </Button>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-6xl mx-auto"></div>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">{t("home.features")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("home.tagline")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <Card
                key={idx}
                className="feature-card card-hover p-8 border-slate-200 dark:border-slate-800 relative overflow-hidden group cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br",
                  feature.color
                )}></div>

                <div className="relative z-10 space-y-4">
                  <div className="feature-icon p-3 w-fit rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      <div className="section-divider max-w-6xl mx-auto"></div>

      {/* How It Works Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-slate-100/50 to-slate-200/30 dark:from-slate-800/30 dark:to-slate-800/10 rounded-2xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">{t("home.howItWorks")}</h2>
          <p className="text-muted-foreground text-lg">
            {t("home.tagline")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector Line */}
          <div className="hidden lg:block absolute top-6 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

          {steps.map((step, idx) => {
            const StepIcon = step.icon
            return (
              <div
                key={idx}
                className="text-center relative animate-fade-in-up group"
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-lg group-hover:bg-primary/40 transition-all"></div>
                  <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center font-bold text-xl shadow-lg group-hover:shadow-primary/50 transition-all">
                    {step.number}
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      <div className="section-divider max-w-6xl mx-auto"></div>

      {/* Target Market Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">{t("home.targetMarket")}</h2>
          <p className="text-muted-foreground text-lg">
            {t("home.tagline")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {targetMarkets.map((market, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-6 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary/50 card-hover group transition-all-smooth animate-fade-in-up cursor-pointer"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <span className="font-medium text-lg group-hover:text-primary transition-colors">
                {market}
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider max-w-6xl mx-auto"></div>

      {/* Trust Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">{t("home.trust")}</h2>
          <p className="text-muted-foreground text-lg">
            {t("home.tagline")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustReasons.map((reason, idx) => {
            const ReasonIcon = reason.icon
            return (
              <Card
                key={idx}
                className="card-hover p-8 text-center border-slate-200 dark:border-slate-800 group cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <ReasonIcon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-3 group-hover:text-primary transition-colors">
                  {reason.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {reason.description}
                </p>
              </Card>
            )
          })}
        </div>
      </section>

      <div className="section-divider max-w-6xl mx-auto"></div>

      {/* Testimonials Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-slate-100/50 to-slate-200/30 dark:from-slate-800/30 dark:to-slate-800/10 rounded-2xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">{t("home.testimonials")}</h2>
          <p className="text-muted-foreground text-lg">
            {t("home.tagline")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <Card
              key={idx}
              className="card-hover p-8 border-slate-200 dark:border-slate-800 flex flex-col cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-muted-foreground mb-6 flex-grow leading-relaxed italic">
                "{testimonial.quote}"
              </p>
              <p className="font-semibold text-sm text-primary">
                {testimonial.author}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <div className="section-divider max-w-6xl mx-auto"></div>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-fade-in-up">
        <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground rounded-2xl p-12 sm:p-16 text-center space-y-8 shadow-2xl hover:shadow-primary/50 transition-shadow relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-0"></div>
          <div className="relative z-10">
            <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
              {t("home.footerDesc")}
            </h2>
            <Button
              size="lg"
              variant="secondary"
              className="gap-2 group transition-all-smooth hover:scale-105 animate-bounce-slow"
              asChild
            >
              <Link href="/login">
                {t("home.getStarted")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="animate-fade-in-up">
              <h4 className="font-bold text-lg mb-4">{t("home.footer")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors hover:translate-x-1 inline-block transition-transform"
                  >
                    {t("home.support")}
                  </a>
                </li>
              </ul>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <h4 className="font-bold text-lg mb-4">{t("common.dashboard")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/login"
                    className="hover:text-primary transition-colors hover:translate-x-1 inline-block transition-transform"
                  >
                    {t("home.signIn")}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <h4 className="font-bold text-lg mb-4">{t("common.legal")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors hover:translate-x-1 inline-block transition-transform"
                  >
                    {t("home.privacy")}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors hover:translate-x-1 inline-block transition-transform"
                  >
                    {t("home.terms")}
                  </a>
                </li>
              </ul>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <h4 className="font-bold text-lg mb-4">{t("home.title")}</h4>
              <p className="text-sm text-muted-foreground">
                {t("home.tagline")}
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground gap-4 animate-fade-in-up">
            <p>{t("home.copyright")} © 2024</p>
            <p>{t("home.title")}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
