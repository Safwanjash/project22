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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Package, Loader2, Settings2, Trash2 } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { createProduct, updateProduct, toggleProductStatus, deleteProduct } from "@/app/actions"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { Product, ProductVariant } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { PriceDisplay } from "@/components/dashboard/price-display"
import { useLanguage } from "@/components/providers/language-provider"
import { VariantForm } from "@/components/dashboard/variant-form"
import { VariantList } from "@/components/dashboard/variant-list"
import { randomUUID } from "crypto"

interface ProductsClientPageProps {
    initialProducts: Product[]
}

const initialState = {
    success: false,
    message: "",
    errors: undefined
}

export default function ProductsClientPage({ initialProducts }: ProductsClientPageProps) {
    const { t, isRTL } = useLanguage()
    const { toast } = useToast()
    const [searchQuery, setSearchQuery] = useState("")
    const [products, setProducts] = useState(initialProducts)
    const [showInactive, setShowInactive] = useState(true)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)

    // Variant management state
    const [productType, setProductType] = useState<"simple" | "variant">("simple")
    const [variants, setVariants] = useState<ProductVariant[]>([])
    const [isVariantFormOpen, setIsVariantFormOpen] = useState(false)
    const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null)
    const [managingVariantsFor, setManagingVariantsFor] = useState<Product | null>(null)

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
            setVariants([])
            setProductType("simple")
            toast({ title: t("common.success"), description: createState.message, variant: "default" })
        } else if (createState.message) {
            toast({ title: t("common.error"), description: createState.message, variant: "destructive" })
        }
    }, [createState, toast, t])

    // Update Form State
    const [updateState, updateAction, isUpdating] = useActionState(updateProduct, initialState)

    useEffect(() => {
        if (updateState.success) {
            setEditingProduct(null)
            toast({ title: t("common.success"), description: updateState.message, variant: "default" })
        } else if (updateState.message) {
            toast({ title: t("common.error"), description: updateState.message, variant: "destructive" })
        }
    }, [updateState, toast, t])

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

    const handleDeleteProduct = async (id: string) => {
        const result = await deleteProduct(id)
        if (result.success) {
            setProducts(products.filter(p => p.id !== id))
            toast({ title: t("common.success"), description: result.message })
        } else {
            toast({ title: t("common.error"), description: result.message, variant: "destructive" })
        }
    }

    // Variant management handlers
    const handleSaveVariant = (variant: Omit<ProductVariant, "id">) => {
        if (editingVariant) {
            // Update existing
            setVariants(variants.map(v => v.id === editingVariant.id ? { ...variant, id: editingVariant.id } : v))
        } else {
            // Add new
            setVariants([...variants, { ...variant, id: `v${Date.now()}` }])
        }
        setEditingVariant(null)
    }

    const handleDeleteVariant = (variantId: string) => {
        setVariants(variants.filter(v => v.id !== variantId))
    }

    const handleToggleVariantStatus = (variantId: string) => {
        setVariants(variants.map(v => v.id === variantId ? { ...v, isActive: !v.isActive } : v))
    }

    const handleManageVariants = (product: Product) => {
        setManagingVariantsFor(product)
        setVariants(product.variants || [])
        setProductType(product.type)
    }

    const handleSaveProductVariants = async () => {
        if (!managingVariantsFor) return

        const formData = new FormData()
        formData.append("id", managingVariantsFor.id)
        formData.append("name", managingVariantsFor.name)
        formData.append("type", productType)
        formData.append("price", managingVariantsFor.price.toString())
        formData.append("image", managingVariantsFor.image || "")
        formData.append("variants", JSON.stringify(variants))

        const result = await updateProduct(initialState, formData)
        if (result.success) {
            toast({ title: t("common.success"), description: result.message })
            setManagingVariantsFor(null)
            setVariants([])
        } else {
            toast({ title: t("common.error"), description: result.message, variant: "destructive" })
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
                <Dialog open={isCreateOpen} onOpenChange={(open) => {
                    setIsCreateOpen(open)
                    if (!open) {
                        setVariants([])
                        setProductType("simple")
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                            {t("products.addProduct")}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{t("products.addProduct")}</DialogTitle>
                        </DialogHeader>
                        <form action={createAction} className="space-y-4 py-4" onSubmit={(e) => {
                            // Add variants as hidden field before submit
                            const form = e.target as HTMLFormElement
                            const variantsInput = form.querySelector('input[name="variants"]') as HTMLInputElement
                            if (variantsInput) {
                                variantsInput.value = JSON.stringify(variants)
                            }
                        }}>
                            <div className="space-y-2">
                                <Label>{t("products.productType")}</Label>
                                <Select value={productType} onValueChange={(v) => setProductType(v as "simple" | "variant")}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="simple">{t("products.simpleProduct")}</SelectItem>
                                        <SelectItem value="variant">{t("products.variantProduct")}</SelectItem>
                                    </SelectContent>
                                </Select>
                                <input type="hidden" name="type" value={productType} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">{t("products.productName")}</Label>
                                <Input id="name" name="name" placeholder={t("products.productName")} />
                                {createState.errors?.name && <p className="text-sm text-red-500">{createState.errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">
                                    {productType === "variant" ? `${t("products.price")} (${t("common.default")})` : t("products.price")}
                                </Label>
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

                            {/* Variant Management */}
                            {productType === "variant" && (
                                <div className="space-y-3 border rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <Label>{t("products.variants")}</Label>
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={() => setIsVariantFormOpen(true)}
                                        >
                                            <Plus className="w-4 h-4 mr-1" />
                                            {t("products.addVariant")}
                                        </Button>
                                    </div>
                                    {variants.length > 0 ? (
                                        <VariantList
                                            variants={variants}
                                            basePrice={0}
                                            onEdit={(v) => {
                                                setEditingVariant(v)
                                                setIsVariantFormOpen(true)
                                            }}
                                            onDelete={handleDeleteVariant}
                                            onToggleStatus={handleToggleVariantStatus}
                                        />
                                    ) : (
                                        <p className="text-sm text-muted-foreground text-center py-4">
                                            {t("products.noVariants")}
                                        </p>
                                    )}
                                </div>
                            )}

                            <input type="hidden" name="variants" />

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
                            <Search className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground`} />
                            <Input
                                placeholder={t("products.searchPlaceholder")}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={isRTL ? "pr-10" : "pl-10"}
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
                                        <div className="flex-1">
                                            <h3 className="font-semibold leading-tight">{product.name}</h3>
                                            {product.type === "variant" && product.variants && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {product.variants.length} {t("products.variants")}
                                                </p>
                                            )}
                                        </div>
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
                                                <Edit className={`h-4 w-4 ${isRTL ? "ml-1" : "mr-1"}`} />
                                                {t("common.edit")}
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>{t("products.editProduct")}</DialogTitle>
                                            </DialogHeader>
                                            <form action={updateAction} className="space-y-4 py-4">
                                                <input type="hidden" name="id" value={product.id} />
                                                <input type="hidden" name="type" value={product.type} />

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

                                    {product.type === "variant" && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleManageVariants(product)}
                                        >
                                            <Settings2 className="h-4 w-4" />
                                        </Button>
                                    )}

                                    <Button
                                        variant={product.isActive ? "destructive" : "default"}
                                        size="sm"
                                        onClick={() => handleToggleStatus(product.id, product.isActive)}
                                    >
                                        {product.isActive ? t("products.deactivate") : t("products.activate")}
                                    </Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="px-2"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>{t("common.delete")}</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    {t("confirm.delete")}
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    className="bg-destructive hover:bg-destructive/90"
                                                >
                                                    {t("common.delete")}
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <EmptyState type="products" />
            )}

            {/* Variant Form Dialog */}
            <VariantForm
                open={isVariantFormOpen}
                onOpenChange={(open) => {
                    setIsVariantFormOpen(open)
                    if (!open) setEditingVariant(null)
                }}
                onSave={handleSaveVariant}
                editingVariant={editingVariant}
                existingVariants={variants}
            />

            {/* Manage Variants Dialog */}
            <Dialog open={!!managingVariantsFor} onOpenChange={(open) => !open && setManagingVariantsFor(null)}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {t("products.manageVariants")} - {managingVariantsFor?.name}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-muted-foreground">
                                {variants.length} {t("products.variants")}
                            </p>
                            <Button
                                size="sm"
                                onClick={() => setIsVariantFormOpen(true)}
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                {t("products.addVariant")}
                            </Button>
                        </div>

                        {variants.length > 0 ? (
                            <VariantList
                                variants={variants}
                                basePrice={managingVariantsFor?.price || 0}
                                onEdit={(v) => {
                                    setEditingVariant(v)
                                    setIsVariantFormOpen(true)
                                }}
                                onDelete={handleDeleteVariant}
                                onToggleStatus={handleToggleVariantStatus}
                            />
                        ) : (
                            <p className="text-center py-8 text-muted-foreground">
                                {t("products.noVariants")}
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setManagingVariantsFor(null)}>
                            {t("common.cancel")}
                        </Button>
                        <Button onClick={handleSaveProductVariants}>
                            {t("common.save")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
