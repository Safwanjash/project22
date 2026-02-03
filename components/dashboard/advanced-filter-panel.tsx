"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import {
  ChevronDown,
  Filter,
  X,
  Save,
  CalendarIcon,
  Bookmark,
  Check
} from "lucide-react"
import { format } from "date-fns"
import { ar, enUS } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/providers/language-provider"

export interface FilterValues {
  dateFrom?: Date
  dateTo?: Date
  status?: string
  deliveryCompany?: string
  paymentMethod?: string
  customer?: string
}

export interface SavedFilter {
  id: string
  name: string
  filters: FilterValues
}

interface AdvancedFilterPanelProps {
  onFilterChange: (filters: FilterValues) => void
  onSaveFilter?: (name: string, filters: FilterValues) => void
  savedFilters?: SavedFilter[]
  onApplySavedFilter?: (filter: SavedFilter) => void
  statusOptions?: { value: string; label: string }[]
  deliveryCompanies?: { value: string; label: string }[]
  paymentMethods?: { value: string; label: string }[]
}

export function AdvancedFilterPanel({
  onFilterChange,
  onSaveFilter,
  savedFilters = [],
  onApplySavedFilter,
  statusOptions,
  deliveryCompanies,
  paymentMethods
}: AdvancedFilterPanelProps) {
  const { t, language } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<FilterValues>({})
  const [saveFilterName, setSaveFilterName] = useState("")
  const [showSaveInput, setShowSaveInput] = useState(false)

  const dateLocale = language === "ar" ? ar : enUS

  const defaultStatusOptions = [
    { value: "new", label: t("status.new") },
    { value: "processing", label: t("status.processing") },
    { value: "with_delivery", label: t("status.with_delivery") },
    { value: "delivered", label: t("status.delivered") },
    { value: "returned", label: t("status.returned") },
    { value: "cancelled", label: t("status.canceled") }
  ]

  const defaultDeliveryCompanies = [
    { value: "smsa", label: "SMSA" },
    { value: "aramex", label: "Aramex" },
    { value: "dhl", label: "DHL" },
    { value: "zajil", label: "Zajil" }
  ]

  const defaultPaymentMethods = [
    { value: "cod", label: t("payments.cod") },
    { value: "bank_transfer", label: t("payments.bankTransfer") },
    { value: "paid", label: t("status.paid") }
  ]

  const currentStatusOptions = statusOptions || defaultStatusOptions
  const currentDeliveryCompanies = deliveryCompanies || defaultDeliveryCompanies
  const currentPaymentMethods = paymentMethods || defaultPaymentMethods

  const activeFilterCount = Object.values(filters).filter(v => v !== undefined && v !== "").length

  const handleFilterChange = (key: keyof FilterValues, value: string | Date | undefined) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    setFilters({})
    onFilterChange({})
  }

  const handleSaveFilter = () => {
    if (saveFilterName && onSaveFilter) {
      onSaveFilter(saveFilterName, filters)
      setSaveFilterName("")
      setShowSaveInput(false)
    }
  }

  const handleApplySavedFilter = (filter: SavedFilter) => {
    setFilters(filter.filters)
    onFilterChange(filter.filters)
    onApplySavedFilter?.(filter)
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center gap-2 flex-wrap">
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Filter className="w-4 h-4" />
            {t("filters.advancedFilters")}
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="mr-1">
                {activeFilterCount}
              </Badge>
            )}
            <ChevronDown className={cn(
              "w-4 h-4 transition-transform",
              isOpen && "rotate-180"
            )} />
          </Button>
        </CollapsibleTrigger>

        {/* Saved Filters Quick Access */}
        {savedFilters.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Bookmark className="w-4 h-4" />
                {t("filters.savedFilters")}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-56">
              <div className="space-y-1">
                {savedFilters.map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => handleApplySavedFilter(filter)}
                    className="w-full text-right px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                  >
                    {filter.name}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
            <X className="w-4 h-4 ml-1" />
            {t("filters.clearFilters")}
          </Button>
        )}
      </div>

      <CollapsibleContent>
        <Card className="mt-4">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {/* Date From */}
              <div className="space-y-2">
                <Label>{t("filters.fromDate")}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-right font-normal",
                        !filters.dateFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="ml-2 h-4 w-4" />
                      {filters.dateFrom ? (
                        format(filters.dateFrom, "dd/MM/yyyy", { locale: dateLocale })
                      ) : (
                        t("filters.selectDate")
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateFrom}
                      onSelect={(date) => handleFilterChange("dateFrom", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Date To */}
              <div className="space-y-2">
                <Label>{t("filters.toDate")}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-right font-normal",
                        !filters.dateTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="ml-2 h-4 w-4" />
                      {filters.dateTo ? (
                        format(filters.dateTo, "dd/MM/yyyy", { locale: dateLocale })
                      ) : (
                        t("filters.selectDate")
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateTo}
                      onSelect={(date) => handleFilterChange("dateTo", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label>{t("filters.status")}</Label>
                <Select
                  value={filters.status || "all"}
                  onValueChange={(v) => handleFilterChange("status", v === "all" ? undefined : v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("filters.allStatuses")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("filters.allStatuses")}</SelectItem>
                    {currentStatusOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Delivery Company */}
              <div className="space-y-2">
                <Label>{t("filters.deliveryCompany")}</Label>
                <Select
                  value={filters.deliveryCompany || "all"}
                  onValueChange={(v) => handleFilterChange("deliveryCompany", v === "all" ? undefined : v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("filters.allCompanies")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("filters.allCompanies")}</SelectItem>
                    {currentDeliveryCompanies.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <Label>{t("filters.paymentMethod")}</Label>
                <Select
                  value={filters.paymentMethod || "all"}
                  onValueChange={(v) => handleFilterChange("paymentMethod", v === "all" ? undefined : v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("filters.allMethods")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("filters.allMethods")}</SelectItem>
                    {currentPaymentMethods.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Customer Search */}
              <div className="space-y-2">
                <Label>{t("filters.customer")}</Label>
                <Input
                  placeholder={t("customers.searchPlaceholder")}
                  value={filters.customer || ""}
                  onChange={(e) => handleFilterChange("customer", e.target.value || undefined)}
                />
              </div>
            </div>

            {/* Save Filter */}
            {onSaveFilter && activeFilterCount > 0 && (
              <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
                {showSaveInput ? (
                  <>
                    <Input
                      placeholder={t("filters.savedFilterName")}
                      value={saveFilterName}
                      onChange={(e) => setSaveFilterName(e.target.value)}
                      className="max-w-xs"
                    />
                    <Button size="sm" onClick={handleSaveFilter} disabled={!saveFilterName}>
                      <Check className="w-4 h-4 ml-1" />
                      {t("filters.save")}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowSaveInput(false)}>
                      {t("filters.cancel")}
                    </Button>
                  </>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setShowSaveInput(true)}>
                    <Save className="w-4 h-4 ml-1" />
                    {t("filters.saveFilter")}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  )
}

// Preset saved filters generator
export const getPresetSavedFilters = (t: (key: string) => string): SavedFilter[] => [
  {
    id: "1",
    name: t("filters.presetTodayDelivery") || "Today's Delivery Orders",
    filters: { status: "with_delivery" }
  },
  {
    id: "2",
    name: t("filters.presetReturned") || "Returned Orders",
    filters: { status: "returned" }
  },
  {
    id: "3",
    name: t("filters.presetCodPending") || "COD Pending",
    filters: { paymentMethod: "cod", status: "with_delivery" }
  }
]
