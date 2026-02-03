import fs from "fs/promises"
import path from "path"
import { customers, products, deliveryCompanies, orders } from "./mock-data"
import type { Customer, Product, DeliveryCompany, Order, User } from "./types"

const DB_PATH = path.join(process.cwd(), "data.json")

export interface Database {
  customers: Customer[]
  products: Product[]
  deliveryCompanies: DeliveryCompany[]
  orders: Order[]
  users: User[]
}

const initialUsers: User[] = [
  {
    id: "1",
    name: "أحمد محمد",
    email: "ahmed@store.com",
    phone: "0501234567",
    role: "owner",
    status: "active",
    createdAt: new Date().toISOString()
  }
]

const initialData: Database = {
  customers,
  products,
  deliveryCompanies,
  orders,
  users: initialUsers
}

export async function readDb(): Promise<Database> {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8")
    return JSON.parse(data, (key, value) => {
        // Revive dates
        if (key.endsWith('At') && typeof value === 'string') {
            return new Date(value);
        }
        return value;
    })
  } catch (error) {
    // If file doesn't exist, create it with initial data
    await writeDb(initialData)
    return initialData
  }
}

export async function writeDb(data: Database): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8")
}
