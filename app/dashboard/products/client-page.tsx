"use client"

import { useState, useActionState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Package, Loader2 } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { createProduct, updateProduct, toggleProductStatus } from "@/app/actions"
import type { Product } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { PriceDisplay } from "@/components/dashboard/price-display"
import { useLanguage } from "@/components/providers/language-provider"

interface ProductsClientPageProps {
    initialProducts: Product[]
}

const initialState = {
    success: false,
    message: "",
    errors: undefined
}

export default function ProductsClientPage({ initialProducts }: ProductsClientPageProps) {
    const { t } = useLanguage()
    const { toast } = useToast()
    const [searchQuery, setSearchQuery] = useState("")
    const [products, setProducts] = useState(initialProducts)
    const [showInactive, setShowInactive] = useState(true)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)

    // Sync props to state when server revalidates
    useEffect(() => {
        setProducts(initialProducts)
    }, [initialProducts])

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesActive = showInactive || product.isActive
        return matchesSearch && matchesActive
    })

    // Create Form State
    const [createState, createAction, isCreating] = useActionState(createProduct, initialState)

    // Close dialog on success
    useEffect(() => {
        if (createState.success) {
            setIsCreateOpen(false)
            toast({ title: t("common.success"), description: createState.message, variant: "default" })
        } else if (createState.message) {
            toast({ title: t("common.error"), description: createState.message, variant: "destructive" })
        }
    }, [createState, toast])

    // Update Form State
    const [updateState, updateAction, isUpdating] = useActionState(updateProduct, initialState)

    useEffect(() => {
        if (updateState.success) {
            setEditingProduct(null)
            toast({ title: t("common.success"), description: updateState.message, variant: "default" })
        } else if (updateState.message) {
            toast({ title: t("common.error"), description: updateState.message, variant: "destructive" })
        }
    }, [updateState, toast])

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        // Optimistic update
        setProducts(products.map(p => p.id === id ? { ...p, isActive: !currentStatus } : p))

        const result = await toggleProductStatus(id)
        if (!result.success) {
            // Revert on failure
            setProducts(products.map(p => p.id === id ? { ...p, isActive: currentStatus } : p))
            toast({ title: t("common.error"), description: result.message, variant: "destructive" })
        } else {
            toast({ title: t("common.success"), description: result.message })
        }
    }

    return (
        <div className="space-y-6 pt-12 lg:pt-0">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{t("products.title")}</h1>
                    <p className="text-muted-foreground">{t("products.subtitle")}</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 ml-2" />
                            {t("products.addProduct")}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>{t("products.addProduct")}</DialogTitle>
                        </DialogHeader>
                        <form action={createAction} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">{t("products.productName")}</Label>
                                <Input id="name" name="name" placeholder={t("products.productName")} />
                                {createState.errors?.name && <p className="text-sm text-red-500">{createState.errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">{t("products.price")}</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    placeholder="0.00"
                                    dir="ltr"
                                    step="0.01"
                                />
                                {createState.errors?.price && <p className="text-sm text-red-500">{createState.errors.price}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">{t("products.image")}</Label>
                                <Input id="image" name="image" placeholder="https://..." dir="ltr" />
                            </div>

                            <Button type="submit" className="w-full" disabled={isCreating}>
                                {isCreating ? <Loader2 className="animate-spin" /> : t("common.add")}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder={t("products.searchPlaceholder")}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pr-10"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch
                                id="show-inactive"
                                checked={showInactive}
                                onCheckedChange={setShowInactive}
                            />
                            <Label htmlFor="show-inactive" className="text-sm">
                                {t("products.showInactive")}
                            </Label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Products Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                    <Card
                        key={product.id}
                        className={!product.isActive ? "opacity-60" : ""}
                    >
                        <CardContent className="p-4">
                            <div className="space-y-4">
                                {/* Product Image */}
                                <div className="aspect-square rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Package className="h-12 w-12 text-muted-foreground" />
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-semibold leading-tight">{product.name}</h3>
                                        <Badge variant={product.isActive ? "default" : "secondary"}>
                                            {product.isActive ? t("products.active") : t("products.inactive")}
                                        </Badge>
                                    </div>
                                    <div className="text-2xl font-bold text-primary">
                                        <PriceDisplay amount={product.price} />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Dialog open={editingProduct?.id === product.id} onOpenChange={(open) => !open && setEditingProduct(null)}>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 bg-transparent"
                                                onClick={() => setEditingProduct(product)}
                                            >
                                                <Edit className="h-4 w-4 ml-1" />
                                                {t("common.edit")}
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>{t("products.editProduct")}</DialogTitle>
                                            </DialogHeader>
                                            <form action={updateAction} className="space-y-4 py-4">
                                                <input type="hidden" name="id" value={product.id} />

                                                <div className="space-y-2">
                                                    <Label htmlFor={`edit-name-${product.id}`}>
                                                        {t("products.productName")}
                                                    </Label>
                                                    <Input
                                                        id={`edit-name-${product.id}`}
                                                        name="name"
                                                        defaultValue={product.name}
                                                    />
                                                    {editingProduct?.id === product.id && updateState.errors?.name && <p className="text-sm text-red-500">{updateState.errors.name}</p>}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor={`edit-price-${product.id}`}>
                                                        {t("products.price")}
                                                    </Label>
                                                    <Input
                                                        id={`edit-price-${product.id}`}
                                                        name="price"
                                                        type="number"
                                                        defaultValue={product.price}
                                                        dir="ltr"
                                                        step="0.01"
                                                    />
                                                    {editingProduct?.id === product.id && updateState.errors?.price && <p className="text-sm text-red-500">{updateState.errors.price}</p>}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor={`edit-image-${product.id}`}>{t("products.image")}</Label>
                                                    <Input id={`edit-image-${product.id}`} name="image" defaultValue={product.image} placeholder="https://..." dir="ltr" />
                                                </div>

                                                <Button className="w-full" disabled={isUpdating}>
                                                    {isUpdating ? <Loader2 className="animate-spin" /> : t("common.save")}
                                                </Button>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                    <Button
                                        variant={product.isActive ? "destructive" : "default"}
                                        size="sm"
                                        onClick={() => handleToggleStatus(product.id, product.isActive)}
                                    >
                                        {product.isActive ? t("products.deactivate") : t("products.activate")}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <EmptyState type="products" />
            )}
        </div>
    )
}
