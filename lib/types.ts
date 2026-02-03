import type { OrderStatus, PaymentStatus } from "@/components/dashboard/status-badge"

export interface Customer {
  id: string
  name: string
  phone: string
  address: string
  city: string
  totalOrders: number
  returnCount: number
  notes?: string
  createdAt: Date
}

export interface Product {
    id: string
    name: string
    price: number
    image?: string
    isActive: boolean
    createdAt: Date
}

export interface DeliveryCompany {
  id: string
  name: string
  phone: string
  cost: number
  isActive: boolean
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  orderNumber: string
  customer: Customer
  items: OrderItem[]
  status: OrderStatus
  paymentMethod: "cod" | "bank_transfer"
  paymentStatus: PaymentStatus
  paymentProof?: string
  deliveryCompany?: DeliveryCompany
  deliveryCost: number
  subtotal: number
  total: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface DailySummary {
  date: Date
  ordersCount: number
  deliveredCount: number
  returnedCount: number
  revenue: number
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: "owner" | "staff"
  status: "active" | "disabled"
  image?: string
  createdAt?: Date | string
  lastActive?: string
}
