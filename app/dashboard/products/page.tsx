
import { getProducts } from "@/app/actions"
import ProductsClientPage from "./client-page"

export default async function ProductsPage() {
  const products = await getProducts()

  return <ProductsClientPage initialProducts={products} />
}
