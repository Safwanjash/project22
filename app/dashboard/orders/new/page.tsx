
import { getCustomers, getProducts, getDeliveryCompanies } from "@/app/actions"
import NewOrderClientPage from "./client-page"

export default async function NewOrderPage() {
  const [customers, products, deliveryCompanies] = await Promise.all([
    getCustomers(),
    getProducts(),
    getDeliveryCompanies()
  ])

  return (
    <NewOrderClientPage
      customers={customers}
      products={products}
      deliveryCompanies={deliveryCompanies}
    />
  )
}
