
import { getOrders } from "@/app/actions"
// Reusing the existing OrdersPage logic but moving it to a client component
import OrdersClientPage from "./client-page"

export default async function OrdersPage() {
  const orders = await getOrders()
  return <OrdersClientPage initialOrders={orders} />
}
