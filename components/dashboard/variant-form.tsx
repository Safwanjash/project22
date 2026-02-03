"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useLanguage } from "@/components/providers/language-provider"
import type { ProductVariant } from "@/lib/types"

interface VariantFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: (variant: Omit<ProductVariant, "id">) => void
    editingVariant?: ProductVariant | null
    existingVariants?: ProductVariant[]
}

export function VariantForm({
    open,
    onOpenChange,
    onSave,
    editingVariant,
    existingVariants = [],
}: VariantFormProps) {
    const { t, isRTL } = useLanguage()
    const [size, setSize] = useState(editingVariant?.size || "")
    const [color, setColor] = useState(editingVariant?.color || "")
    const [price, setPrice] = useState(editingVariant?.price?.toString() || "")
    const [sku, setSku] = useState(editingVariant?.sku || "")
    const [stock, setStock] = useState(editingVariant?.stock?.toString() || "")
    const [error, setError] = useState("")

    const handleSave = () => {
        // Validate
        if (!size.trim() || !color.trim()) {
            setError(t("products.variantRequired"))
            return
        }

        // Check for duplicates (if not editing)
        if (!editingVariant) {
            const duplicate = existingVariants.find(
                (v) => v.size === size.trim() && v.color === color.trim()
            )
            if (duplicate) {
                setError(t("products.duplicateVariant"))
                return
            }
        }

        // Save
        onSave({
            size: size.trim(),
            color: color.trim(),
            price: price ? parseFloat(price) : undefined,
            sku: sku.trim() || undefined,
            stock: stock ? parseInt(stock) : undefined,
            isActive: editingVariant?.isActive ?? true,
        })

        // Reset
        setSize("")
        setColor("")
        setPrice("")
        setSku("")
        setStock("")
        setError("")
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {editingVariant ? t("products.editVariant") : t("products.addVariant")}
                    </DialogTitle>
                    <DialogDescription>
                        {t("products.selectVariant")}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>{t("products.size")} *</Label>
                            <Input
                                value={size}
                                onChange={(e) => setSize(e.target.value)}
                                placeholder="S, M, L, XL..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t("products.color")} *</Label>
                            <Input
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                placeholder={t("products.color")}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>{t("products.price")} ({t("common.optional")})</Label>
                            <Input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="0.00"
                                dir="ltr"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t("products.sku")} ({t("common.optional")})</Label>
                            <Input
                                value={sku}
                                onChange={(e) => setSku(e.target.value)}
                                placeholder="SKU-001"
                                dir="ltr"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>{t("products.stock")} ({t("common.optional")})</Label>
                        <Input
                            type="number"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            placeholder="0"
                            dir="ltr"
                        />
                    </div>

                    {error && <p className="text-sm text-destructive">{error}</p>}
                </div>

                <DialogFooter className={isRTL ? "flex-row-reverse" : ""}>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        {t("common.cancel")}
                    </Button>
                    <Button onClick={handleSave}>{t("common.save")}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
