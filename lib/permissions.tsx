"use client"

import { createContext, useContext, ReactNode } from "react"

export type UserRole = "owner" | "staff"

export interface Permission {
  // Orders
  viewOrders: boolean
  createOrder: boolean
  editOrder: boolean
  deleteOrder: boolean
  changeOrderStatus: boolean
  
  // Customers
  viewCustomers: boolean
  createCustomer: boolean
  editCustomer: boolean
  deleteCustomer: boolean
  
  // Products
  viewProducts: boolean
  createProduct: boolean
  editProduct: boolean
  deleteProduct: boolean
  
  // Delivery
  viewDelivery: boolean
  manageDeliveryCompanies: boolean
  
  // Reports
  viewReports: boolean
  exportReports: boolean
  
  // Payments
  viewPayments: boolean
  managePayments: boolean
  
  // Settings
  viewSettings: boolean
  editSettings: boolean
  
  // Users
  viewUsers: boolean
  manageUsers: boolean
}

const ownerPermissions: Permission = {
  viewOrders: true,
  createOrder: true,
  editOrder: true,
  deleteOrder: true,
  changeOrderStatus: true,
  viewCustomers: true,
  createCustomer: true,
  editCustomer: true,
  deleteCustomer: true,
  viewProducts: true,
  createProduct: true,
  editProduct: true,
  deleteProduct: true,
  viewDelivery: true,
  manageDeliveryCompanies: true,
  viewReports: true,
  exportReports: true,
  viewPayments: true,
  managePayments: true,
  viewSettings: true,
  editSettings: true,
  viewUsers: true,
  manageUsers: true
}

const staffPermissions: Permission = {
  viewOrders: true,
  createOrder: true,
  editOrder: true,
  deleteOrder: false,
  changeOrderStatus: true,
  viewCustomers: true,
  createCustomer: true,
  editCustomer: true,
  deleteCustomer: false,
  viewProducts: true,
  createProduct: true,
  editProduct: true,
  deleteProduct: false,
  viewDelivery: true,
  manageDeliveryCompanies: false,
  viewReports: true,
  exportReports: false,
  viewPayments: true,
  managePayments: false,
  viewSettings: false,
  editSettings: false,
  viewUsers: false,
  manageUsers: false
}

export function getPermissions(role: UserRole): Permission {
  return role === "owner" ? ownerPermissions : staffPermissions
}

interface PermissionContextValue {
  role: UserRole
  permissions: Permission
  hasPermission: (key: keyof Permission) => boolean
}

const PermissionContext = createContext<PermissionContextValue | null>(null)

export function PermissionProvider({ 
  children, 
  role 
}: { 
  children: ReactNode
  role: UserRole 
}) {
  const permissions = getPermissions(role)

  const hasPermission = (key: keyof Permission) => permissions[key]

  return (
    <PermissionContext.Provider value={{ role, permissions, hasPermission }}>
      {children}
    </PermissionContext.Provider>
  )
}

export function usePermissions() {
  const context = useContext(PermissionContext)
  if (!context) {
    // Default to owner for demo purposes
    return {
      role: "owner" as UserRole,
      permissions: ownerPermissions,
      hasPermission: () => true
    }
  }
  return context
}

// Permission-based component wrapper
interface PermissionGateProps {
  permission: keyof Permission
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionGate({ permission, children, fallback = null }: PermissionGateProps) {
  const { hasPermission } = usePermissions()
  
  if (!hasPermission(permission)) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}
