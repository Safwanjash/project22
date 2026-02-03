
import { getCustomers, getOrders } from "@/app/actions"
import CustomersClientPage from "./client-page"

export default async function CustomersPage() {
  const [customers, orders] = await Promise.all([
    getCustomers(),
    getOrders()
  ])

  return <CustomersClientPage initialCustomers={customers} initialOrders={orders} />
}
