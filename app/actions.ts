"use server"

import { revalidatePath } from "next/cache"
import { readDb, writeDb } from "@/lib/db"
import type { Product, User } from "@/lib/types"
import { z } from "zod"
import { randomUUID } from "crypto"

const productSchema = z.object({
  name: z.string().min(2, "اسم المنتج يجب أن يكون حرفين على الأقل"),
  type: z.enum(["simple", "variant"]).default("simple"),
  price: z.coerce.number().min(1, "السعر يجب أن يكون أكبر من 0"),
  image: z.string().optional(),
  isActive: z.boolean().default(true),
  variants: z.string().optional(), // JSON string of variants
})

export async function createProduct(currentState: any, formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    type: formData.get("type") || "simple",
    price: formData.get("price"),
    image: formData.get("image"),
    variants: formData.get("variants"),
  }

  const result = productSchema.safeParse(rawData)

  if (!result.success) {
    return {
      success: false,
      message: "البيانات غير صحيحة",
      errors: result.error.flatten().fieldErrors,
    }
  }

  try {
    const db = await readDb()
    
    // Parse variants if provided
    let variants = undefined
    if (result.data.type === "variant" && result.data.variants) {
      try {
        variants = JSON.parse(result.data.variants)
      } catch (e) {
        return { success: false, message: "بيانات المتغيرات غير صحيحة" }
      }
    }

    const newProduct = {
      id: randomUUID(),
      name: result.data.name,
      type: result.data.type,
      price: result.data.price,
      variants,
      image: result.data.image || undefined,
      isActive: result.data.isActive,
      createdAt: new Date(),
    }

    db.products.push(newProduct)
    await writeDb(db)

    revalidatePath("/dashboard/products")
    return { success: true, message: "تم إضافة المنتج بنجاح" }
  } catch (error) {
    return { success: false, message: "حدث خطأ أثناء الحفظ" }
  }
}

export async function updateProduct(currentState: any, formData: FormData) {
    const id = formData.get("id") as string
    const rawData = {
      name: formData.get("name"),
      type: formData.get("type") || "simple",
      price: formData.get("price"),
      image: formData.get("image"),
      variants: formData.get("variants"),
    }
  
    const result = productSchema.safeParse(rawData)
  
    if (!result.success) {
      return {
        success: false,
        message: "البيانات غير صحيحة",
        errors: result.error.flatten().fieldErrors,
      }
    }
  
    try {
      const db = await readDb()
      const index = db.products.findIndex(p => p.id === id)
      
      if (index === -1) {
          return { success: false, message: "المنتج غير موجود" }
      }

      // Parse variants if provided
      let variants = undefined
      if (result.data.type === "variant" && result.data.variants) {
        try {
          variants = JSON.parse(result.data.variants)
        } catch (e) {
          return { success: false, message: "بيانات المتغيرات غير صحيحة" }
        }
      }

      db.products[index] = {
        ...db.products[index],
        name: result.data.name,
        type: result.data.type,
        price: result.data.price,
        variants,
        image: result.data.image || undefined,
      }
  
      await writeDb(db)
  
      revalidatePath("/dashboard/products")
      return { success: true, message: "تم تعديل المنتج بنجاح" }
    } catch (error) {
      return { success: false, message: "حدث خطأ أثناء الحفظ" }
    }
}

export async function toggleProductStatus(id: string) {
    try {
        const db = await readDb()
        const index = db.products.findIndex(p => p.id === id)
        
        if (index === -1) {
            return { success: false, message: "المنتج غير موجود" }
        }
  
        db.products[index].isActive = !db.products[index].isActive
        await writeDb(db)
    
        revalidatePath("/dashboard/products")
        return { success: true, message: "تم تغيير حالة المنتج" }
      } catch (error) {
        return { success: false, message: "حدث خطأ أثناء الحفظ" }
      }
}


export async function deleteProduct(id: string) {
    try {
        const db = await readDb()
        const initialLength = db.products.length
        db.products = db.products.filter(p => p.id !== id)
        
        if (db.products.length === initialLength) {
            return { success: false, message: "المنتج غير موجود" }
        }

        await writeDb(db)
        revalidatePath("/dashboard/products")
        return { success: true, message: "تم حذف المنتج بنجاح" }
    } catch (error) {
        return { success: false, message: "حدث خطأ أثناء الحذف" }
    }
}

// Temporary data fetcher for client components until everything is server-side
export async function getProducts() {
    const db = await readDb()
    return db.products
}

// ----------------------------------------------------------------------
// ORDERS
// ----------------------------------------------------------------------

const orderItemSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  variantDetails: z.string().optional(),
  quantity: z.coerce.number().min(1),
})

const createOrderSchema = z.object({
  customerId: z.string(), // "new" or existing ID
  newCustomer: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
  }).optional(),
  items: z.array(orderItemSchema).min(1, "يجب إضافة منتج واحد على الأقل"),
  deliveryCompanyId: z.string().optional(),
  paymentMethod: z.enum(["cod", "bank_transfer"]),
  notes: z.string().optional(),
})

export async function createOrder(data: z.infer<typeof createOrderSchema>) {
  const result = createOrderSchema.safeParse(data)

  if (!result.success) {
    return {
      success: false,
      message: "البيانات غير صحيحة",
      errors: result.error.flatten().fieldErrors,
    }
  }

  try {
    const db = await readDb()
    
    // 1. Handle Customer
    let customerId = data.customerId
    let customerObj = db.customers.find(c => c.id === customerId)

    if (customerId === "new") {
       if (!data.newCustomer?.name || !data.newCustomer?.phone) {
           return { success: false, message: "بيانات العميل الجديد ناقصة" }
       }
       const newCustId = randomUUID()
       const newCustomerJson = {
           id: newCustId,
           name: data.newCustomer.name,
           phone: data.newCustomer.phone,
           address: data.newCustomer.address || "",
           city: data.newCustomer.city || "",
           totalOrders: 0,
           returnCount: 0,
           createdAt: new Date()
       }
       db.customers.push(newCustomerJson)
       customerId = newCustId
       customerObj = newCustomerJson
    }

    if (!customerObj) {
        return { success: false, message: "العميل غير موجود" }
    }

    // 2. Resolve Items & Calculate Totals
    const orderItemsResolved = []
    let subtotal = 0
    
    for (const item of data.items) {
        const product = db.products.find(p => p.id === item.productId)
        if (!product) continue // or error
        
        let price = product.price
        let variantDetails = item.variantDetails

        // Handle variant pricing and details
        if (product.type === "variant" && item.variantId && product.variants) {
            const variant = product.variants.find(v => v.id === item.variantId)
            if (variant) {
                if (variant.price) {
                    price = variant.price
                }
                // Ensure variant details are set if not provided by frontend (though frontend sends it)
                if (!variantDetails) {
                    variantDetails = `Size: ${variant.size}, Color: ${variant.color}`
                }
            }
        }
        
        orderItemsResolved.push({
            productId: product.id,
            productName: product.name,
            variantId: item.variantId,
            variantDetails: variantDetails,
            quantity: item.quantity,
            price: price
        })
        subtotal += price * item.quantity
    }

    // 3. Resolve Delivery
    let deliveryCost = 0
    let deliveryCompanyObj = undefined
    if (data.deliveryCompanyId) {
        const dc = db.deliveryCompanies.find(d => d.id === data.deliveryCompanyId)
        if (dc) {
            deliveryCompanyObj = dc
            deliveryCost = dc.cost
        }
    }

    // 4. Create Order
    const newOrder = {
        id: randomUUID(),
        orderNumber: `ORD-${String(db.orders.length + 1).padStart(3, '0')}`,
        customer: customerObj,
        items: orderItemsResolved,
        status: "new" as const,
        paymentMethod: data.paymentMethod,
        paymentStatus: "unpaid" as const, // Default
        deliveryCompany: deliveryCompanyObj,
        deliveryCost,
        subtotal,
        total: subtotal + deliveryCost,
        notes: data.notes,
        createdAt: new Date(),
        updatedAt: new Date(),
    }

    // Update customer stats
    if (customerObj) {
        customerObj.totalOrders = (customerObj.totalOrders || 0) + 1
        // Need to update the customer in the DB array too if it wasn't a ref
        // Since we modified the object found in the array, it should be updated if strictly referencing, 
        // but let's be safe:
        const cIndex = db.customers.findIndex(c => c.id === customerObj!.id)
        if (cIndex !== -1) db.customers[cIndex] = customerObj
    }

    db.orders.unshift(newOrder) // Add to top
    await writeDb(db)

    revalidatePath("/dashboard/orders")
    revalidatePath("/dashboard") // For dashboard stats if any
    return { success: true, message: "تم إنشاء الطلب بنجاح" }

  } catch (error) {
    console.error(error)
    return { success: false, message: "حدث خطأ أثناء إنشاء الطلب" }
  }
}



export async function deleteOrder(id: string) {
    try {
        const db = await readDb()
        const initialLength = db.orders.length
        db.orders = db.orders.filter(o => o.id !== id)
        
        if (db.orders.length === initialLength) {
            return { success: false, message: "الطلب غير موجود" }
        }

        await writeDb(db)
        revalidatePath("/dashboard/orders")
        revalidatePath("/dashboard")
        return { success: true, message: "تم حذف الطلب بنجاح" }
    } catch (error) {
        return { success: false, message: "حدث خطأ أثناء الحذف" }
    }
}

export async function getOrders() {
    const db = await readDb()
    return db.orders
}

export async function getCustomers() {
    const db = await readDb()
    return db.customers
}

// ----------------------------------------------------------------------
// CUSTOMERS
// ----------------------------------------------------------------------

const customerSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  phone: z.string().min(10, "رقم الهاتف غير صحيح"),
  address: z.string().optional(),
  city: z.string().optional(),
  notes: z.string().optional(),
})

export async function createCustomer(currentState: any, formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    city: formData.get("city"),
    notes: formData.get("notes"),
  }

  const result = customerSchema.safeParse(rawData)

  if (!result.success) {
    return {
      success: false,
      message: "البيانات غير صحيحة",
      errors: result.error.flatten().fieldErrors,
    }
  }

  try {
    const db = await readDb()
    const newCustomer = {
      id: randomUUID(),
      ...result.data,
      address: result.data.address || "",
      city: result.data.city || "",
      totalOrders: 0,
      returnCount: 0,
      createdAt: new Date(),
    }

    db.customers.push(newCustomer)
    await writeDb(db)

    revalidatePath("/dashboard/customers")
    return { success: true, message: "تم إضافة العميل بنجاح" }
  } catch (error) {
    return { success: false, message: "حدث خطأ أثناء الحفظ" }
  }
}


export async function deleteCustomer(id: string) {
    try {
        const db = await readDb()
        const initialLength = db.customers.length
        db.customers = db.customers.filter(c => c.id !== id)
        
        if (db.customers.length === initialLength) {
            return { success: false, message: "العميل غير موجود" }
        }

        await writeDb(db)
        revalidatePath("/dashboard/customers")
        return { success: true, message: "تم حذف العميل بنجاح" }
    } catch (error) {
        return { success: false, message: "حدث خطأ أثناء الحذف" }
    }
}

// ----------------------------------------------------------------------
// DELIVERY COMPANIES
// ----------------------------------------------------------------------

const deliveryCompanySchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  phone: z.string().optional(),
  cost: z.coerce.number().min(0, "التكلفة يجب أن تكون 0 أو أكثر"),
})

export async function createDeliveryCompany(currentState: any, formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    cost: formData.get("cost"),
  }

  const result = deliveryCompanySchema.safeParse(rawData)

  if (!result.success) {
    return {
      success: false,
      message: "البيانات غير صحيحة",
      errors: result.error.flatten().fieldErrors,
    }
  }

  try {
    const db = await readDb()
    const newCompany = {
      id: randomUUID(),
      ...result.data,
      phone: result.data.phone || "",
      isActive: true, // Default to active
    }

    db.deliveryCompanies.push(newCompany)
    await writeDb(db)

    revalidatePath("/dashboard/delivery")
    return { success: true, message: "تم إضافة الشركة بنجاح" }
  } catch (error) {
    return { success: false, message: "حدث خطأ أثناء الحفظ" }
  }
}

export async function updateDeliveryCompany(currentState: any, formData: FormData) {
    const id = formData.get("id") as string
    const rawData = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      cost: formData.get("cost"),
    }
  
    const result = deliveryCompanySchema.safeParse(rawData)
  
    if (!result.success) {
      return {
        success: false,
        message: "البيانات غير صحيحة",
        errors: result.error.flatten().fieldErrors,
      }
    }
  
    try {
      const db = await readDb()
      const index = db.deliveryCompanies.findIndex(d => d.id === id)
      
      if (index === -1) {
          return { success: false, message: "الشركة غير موجودة" }
      }

      db.deliveryCompanies[index] = {
        ...db.deliveryCompanies[index],
        ...result.data,
        phone: result.data.phone || "",
      }
  
      await writeDb(db)
  
      revalidatePath("/dashboard/delivery")
      return { success: true, message: "تم تعديل الشركة بنجاح" }
    } catch (error) {
      return { success: false, message: "حدث خطأ أثناء الحفظ" }
    }
}

export async function toggleDeliveryCompanyStatus(id: string) {
    try {
        const db = await readDb()
        const index = db.deliveryCompanies.findIndex(d => d.id === id)
        
        if (index === -1) {
            return { success: false, message: "الشركة غير موجودة" }
        }
  
        db.deliveryCompanies[index].isActive = !db.deliveryCompanies[index].isActive
        await writeDb(db)
    
        revalidatePath("/dashboard/delivery")
        return { success: true, message: "تم تغيير حالة الشركة" }
      } catch (error) {
        return { success: false, message: "حدث خطأ أثناء الحفظ" }
      }
}


export async function deleteDeliveryCompany(id: string) {
    try {
        const db = await readDb()
        const initialLength = db.deliveryCompanies.length
        db.deliveryCompanies = db.deliveryCompanies.filter(d => d.id !== id)
        
        if (db.deliveryCompanies.length === initialLength) {
            return { success: false, message: "الشركة غير موجودة" }
        }

        await writeDb(db)
        revalidatePath("/dashboard/delivery")
        return { success: true, message: "تم حذف الشركة بنجاح" }
    } catch (error) {
        return { success: false, message: "حدث خطأ أثناء الحذف" }
    }
}

export async function getDeliveryCompanies() {
    const db = await readDb()
    return db.deliveryCompanies
}

// ----------------------------------------------------------------------
// USERS
// ----------------------------------------------------------------------

const userSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().optional(),
  role: z.enum(["owner", "staff"]),
})

export async function createUser(currentState: any, formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    role: formData.get("role"),
  }

  const result = userSchema.safeParse(rawData)

  if (!result.success) {
    return {
      success: false,
      message: "البيانات غير صحيحة",
      errors: result.error.flatten().fieldErrors,
    }
  }

  try {
    const db = await readDb()
    
    // Check email uniqueness
    if (db.users.some(u => u.email === result.data.email)) {
        return { success: false, message: "البريد الإلكتروني مسجل مسبقاً" }
    }

    const newUser: User = {
      id: randomUUID(),
      ...result.data,
      phone: result.data.phone || "",
      status: "active",
      createdAt: new Date().toISOString(),
    }

    db.users.push(newUser)
    await writeDb(db)

    revalidatePath("/dashboard/users")
    revalidatePath("/dashboard/settings")
    return { success: true, message: "تم إضافة المستخدم بنجاح" }
  } catch (error) {
    return { success: false, message: "حدث خطأ أثناء الحفظ" }
  }
}

export async function updateUser(currentState: any, formData: FormData) {
    const id = formData.get("id") as string
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      role: formData.get("role"),
    }
  
    const result = userSchema.safeParse(rawData)
  
    if (!result.success) {
      return {
        success: false,
        message: "البيانات غير صحيحة",
        errors: result.error.flatten().fieldErrors,
      }
    }
  
    try {
      const db = await readDb()
      const index = db.users.findIndex(u => u.id === id)
      
      if (index === -1) {
          return { success: false, message: "المستخدم غير موجود" }
      }

      // Check email uniqueness (exclude self)
      if (db.users.some(u => u.email === result.data.email && u.id !== id)) {
           return { success: false, message: "البريد الإلكتروني مسجل مسبقاً" }
      }

      db.users[index] = {
        ...db.users[index],
        ...result.data,
        phone: result.data.phone || "",
      }
  
      await writeDb(db)
  
      revalidatePath("/dashboard/users")
      revalidatePath("/dashboard/settings")
      return { success: true, message: "تم تعديل المستخدم بنجاح" }
    } catch (error) {
      return { success: false, message: "حدث خطأ أثناء الحفظ" }
    }
}

export async function toggleUserStatus(id: string) {
    try {
        const db = await readDb()
        const index = db.users.findIndex(u => u.id === id)
        
        if (index === -1) {
            return { success: false, message: "المستخدم غير موجود" }
        }
  
        const currentStatus = db.users[index].status
        db.users[index].status = currentStatus === "active" ? "disabled" : "active"
        
        await writeDb(db)
    
        revalidatePath("/dashboard/users")
        revalidatePath("/dashboard/settings")
        return { success: true, message: "تم تغيير حالة المستخدم" }
      } catch (error) {
        return { success: false, message: "حدث خطأ أثناء الحفظ" }
      }
}

export async function getUsers() {
    const db = await readDb()
    return db.users
}

