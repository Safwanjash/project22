
import { getDeliveryCompanies, getOrders } from "@/app/actions"
import DeliveryClientPage from "./client-page"

export default async function DeliveryPage() {
  const [companies, orders] = await Promise.all([
    getDeliveryCompanies(),
    getOrders()
  ])

  return <DeliveryClientPage initialCompanies={companies} initialOrders={orders} />
}
