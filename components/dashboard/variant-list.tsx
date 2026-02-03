"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"
import { PriceDisplay } from "./price-display"
import type { ProductVariant } from "@/lib/types"
import { Switch } from "@/components/ui/switch"

interface VariantListProps {
    variants: ProductVariant[]
    basePrice: number
    onEdit: (variant: ProductVariant) => void
    onDelete: (variantId: string) => void
    onToggleStatus: (variantId: string) => void
}

export function VariantList({
    variants,
    basePrice,
    onEdit,
    onDelete,
    onToggleStatus,
}: VariantListProps) {
    const { t, isRTL } = useLanguage()

    if (!variants || variants.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <p>{t("products.noVariants")}</p>
            </div>
        )
    }

    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t("products.size")}</TableHead>
                        <TableHead>{t("products.color")}</TableHead>
                        <TableHead>{t("products.price")}</TableHead>
                        <TableHead>{t("products.sku")}</TableHead>
                        <TableHead>{t("products.stock")}</TableHead>
                        <TableHead>{t("common.status")}</TableHead>
                        <TableHead className="text-right">{t("common.actions")}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {variants.map((variant) => (
                        <TableRow
                            key={variant.id}
                            className={!variant.isActive ? "opacity-50" : ""}
                        >
                            <TableCell className="font-medium">{variant.size}</TableCell>
                            <TableCell>{variant.color}</TableCell>
                            <TableCell>
                                <PriceDisplay amount={variant.price || basePrice} />
                                {variant.price && variant.price !== basePrice && (
                                    <span className="text-xs text-muted-foreground ml-1">
                                        ({t("common.custom")})
                                    </span>
                                )}
                            </TableCell>
                            <TableCell>
                                <code className="text-xs">{variant.sku || "-"}</code>
                            </TableCell>
                            <TableCell>{variant.stock ?? "-"}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={variant.isActive}
                                        onCheckedChange={() => onToggleStatus(variant.id)}
                                    />
                                    <Badge variant={variant.isActive ? "outline" : "destructive"}>
                                        {variant.isActive ? t("products.active") : t("products.inactive")}
                                    </Badge>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className={`flex items-center gap-2 ${isRTL ? "justify-start" : "justify-end"}`}>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onEdit(variant)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onDelete(variant.id)}
                                    >
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
