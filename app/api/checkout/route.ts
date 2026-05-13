import { NextResponse } from "next/server"
import { Preference } from "mercadopago"
import { createClient } from "@/lib/supabase/server"
import { fallbackProducts } from "@/lib/fallback-products"
import { getMercadoPagoClient, getPublicBaseUrl, hasMercadoPagoAccessToken } from "@/lib/mercadopago"
import { buildWhatsAppOrderUrl } from "@/lib/order-contact"
import { sendOrderCreatedEmails } from "@/lib/email"

interface CheckoutItem {
  productId: string
  quantity: number
}

interface CheckoutRequest {
  items: CheckoutItem[]
  customer: {
    name: string
    email: string
    phone: string
  }
  shippingAddress: {
    street: string
    number: string
    floor?: string
    apartment?: string
    city: string
    province: string
    postalCode: string
  }
  shipping: {
    method: string
    cost: number
  }
}

interface ProductForCheckout {
  id: string
  name: string
  price: number
  promotional_price: number | null
  stock: number
  is_active: boolean
}

interface PreferenceItem {
  id: string
  title: string
  quantity: number
  unit_price: number
  currency_id: "ARS"
}

function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validateCheckout(body: CheckoutRequest) {
  if (!body.items?.length) return "El carrito está vacío"
  if (!body.customer?.name?.trim()) return "Falta el nombre del cliente"
  if (!isValidEmail(body.customer.email || "")) return "Email inválido"
  if (!body.customer?.phone?.trim()) return "Falta el teléfono"
  if (!body.shippingAddress?.street?.trim()) return "Falta la calle de envío"
  if (!body.shippingAddress?.number?.trim()) return "Falta la altura de envío"
  if (!body.shippingAddress?.city?.trim()) return "Falta la ciudad de envío"
  if (!body.shippingAddress?.province?.trim()) return "Falta la provincia de envío"
  if (!body.shippingAddress?.postalCode?.trim()) return "Falta el código postal"
  if (!body.shipping?.method?.trim()) return "Falta seleccionar un envío"
  if (!Number.isFinite(body.shipping.cost) || body.shipping.cost < 0) {
    return "Costo de envío inválido"
  }

  const invalidItem = body.items.find(
    (item) => !item.productId || !Number.isInteger(item.quantity) || item.quantity <= 0
  )

  if (invalidItem) return "Hay productos inválidos en el carrito"

  return null
}

async function getCheckoutProducts(productIds: string[]) {
  if (!hasSupabaseConfig()) {
    return fallbackProducts.filter((product) => productIds.includes(product.id))
  }

  try {
    const supabase = await createClient()
    const { data: products, error } = await supabase
      .from("products")
      .select("id,name,price,promotional_price,stock,is_active")
      .in("id", productIds)

    if (!error && products?.length) {
      return products as ProductForCheckout[]
    }

    if (error) console.error("Error fetching checkout products:", error)
  } catch (error) {
    console.error("Supabase checkout product lookup failed:", error)
  }

  return fallbackProducts.filter((product) => productIds.includes(product.id))
}

function buildPreferenceItems(body: CheckoutRequest, products: ProductForCheckout[]) {
  const productsById = new Map(products.map((product) => [product.id, product]))

  return body.items.map((item) => {
    const product = productsById.get(item.productId)

    if (!product || !product.is_active) {
      throw new Error("Uno de los productos ya no está disponible")
    }

    const unitPrice = roundMoney(product.promotional_price ?? product.price)

    if (unitPrice <= 0) {
      throw new Error(`${product.name} no tiene precio cargado para venta online`)
    }

    if (product.stock < item.quantity) {
      throw new Error(`No hay stock suficiente de ${product.name}`)
    }

    return {
      id: product.id,
      title: product.name,
      quantity: item.quantity,
      unit_price: unitPrice,
      currency_id: "ARS" as const,
    }
  })
}

async function createOrderRecord({
  body,
  subtotal,
  total,
  shippingCost,
}: {
  body: CheckoutRequest
  subtotal: number
  total: number
  shippingCost: number
}) {
  const generatedOrderId = crypto.randomUUID()

  if (!hasSupabaseConfig()) {
    return { orderId: generatedOrderId, persisted: false }
  }

  try {
    const supabase = await createClient()
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        customer_name: body.customer.name.trim(),
        customer_email: body.customer.email.trim().toLowerCase(),
        customer_phone: body.customer.phone.trim(),
        shipping_address: {
          street: body.shippingAddress.street.trim(),
          number: body.shippingAddress.number.trim(),
          floor: body.shippingAddress.floor?.trim() || null,
          apartment: body.shippingAddress.apartment?.trim() || null,
          city: body.shippingAddress.city.trim(),
          province: body.shippingAddress.province.trim(),
          postal_code: body.shippingAddress.postalCode.trim(),
        },
        shipping_cost: shippingCost,
        shipping_method: body.shipping.method,
        subtotal,
        total,
        status: "pending",
      })
      .select("id")
      .single()

    if (error || !order?.id) {
      console.error("Error creating order:", error)
      return { orderId: generatedOrderId, persisted: false }
    }

    return { orderId: order.id as string, persisted: true }
  } catch (error) {
    console.error("Supabase order creation failed:", error)
    return { orderId: generatedOrderId, persisted: false }
  }
}

async function persistOrderItems(orderId: string, orderItems: Record<string, unknown>[]) {
  if (!hasSupabaseConfig()) return

  try {
    const supabase = await createClient()
    const { error } = await supabase.from("order_items").insert(orderItems)
    if (error) console.error("Error creating order items:", error)
  } catch (error) {
    console.error("Supabase order items creation failed:", error)
  }
}

async function updatePreferenceId(orderId: string, preferenceId?: string) {
  if (!hasSupabaseConfig() || !preferenceId) return

  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from("orders")
      .update({ mercadopago_preference_id: preferenceId })
      .eq("id", orderId)

    if (error) console.error("Error updating Mercado Pago preference id:", error)
  } catch (error) {
    console.error("Supabase preference update failed:", error)
  }
}

async function createMercadoPagoPreference({
  body,
  orderId,
  preferenceItems,
  shippingCost,
  subtotal,
  total,
}: {
  body: CheckoutRequest
  orderId: string
  preferenceItems: PreferenceItem[]
  shippingCost: number
  subtotal: number
  total: number
}) {
  if (!hasMercadoPagoAccessToken()) return null

  const preference = new Preference(getMercadoPagoClient())
  const baseUrl = getPublicBaseUrl()
  const preferenceData = await preference.create({
    body: {
      items: [
        ...preferenceItems,
        {
          id: "shipping",
          title: `Envío - ${body.shipping.method}`,
          quantity: 1,
          unit_price: shippingCost,
          currency_id: "ARS",
        },
      ],
      payer: {
        name: body.customer.name.trim().split(" ")[0],
        surname: body.customer.name.trim().split(" ").slice(1).join(" ") || "-",
        email: body.customer.email.trim().toLowerCase(),
        phone: {
          number: body.customer.phone.trim(),
        },
        address: {
          street_name: body.shippingAddress.street.trim(),
          street_number: body.shippingAddress.number.trim(),
          zip_code: body.shippingAddress.postalCode.trim(),
        },
      },
      back_urls: {
        success: `${baseUrl}/checkout/success?order=${orderId}`,
        failure: `${baseUrl}/checkout/failure?order=${orderId}`,
        pending: `${baseUrl}/checkout/pending?order=${orderId}`,
      },
      auto_return: "approved",
      external_reference: orderId,
      notification_url: `${baseUrl}/api/webhook/mercadopago`,
      statement_descriptor: "FARMACIA OASIS",
      metadata: {
        order_id: orderId,
        subtotal,
        shipping_cost: shippingCost,
        total,
      },
    },
  })

  return {
    preferenceId: preferenceData.id,
    initPoint: preferenceData.init_point || preferenceData.sandbox_init_point,
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutRequest
    const validationError = validateCheckout(body)

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    const productIds = [...new Set(body.items.map((item) => item.productId))]
    const products = await getCheckoutProducts(productIds)
    const preferenceItems = buildPreferenceItems(body, products)

    const subtotal = roundMoney(
      preferenceItems.reduce(
        (sum, item) => sum + item.unit_price * item.quantity,
        0
      )
    )
    const shippingCost = roundMoney(body.shipping.cost)
    const total = roundMoney(subtotal + shippingCost)
    const { orderId } = await createOrderRecord({ body, subtotal, total, shippingCost })
    const orderItems = preferenceItems.map((item) => ({
      order_id: orderId,
      product_id: item.id,
      product_name: item.title,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: roundMoney(item.unit_price * item.quantity),
    }))

    await persistOrderItems(orderId, orderItems)

    const whatsappUrl = buildWhatsAppOrderUrl({
      orderId,
      customerName: body.customer.name.trim(),
      customerEmail: body.customer.email.trim().toLowerCase(),
      customerPhone: body.customer.phone.trim(),
      shippingAddress: {
        street: body.shippingAddress.street.trim(),
        number: body.shippingAddress.number.trim(),
        floor: body.shippingAddress.floor?.trim() || null,
        apartment: body.shippingAddress.apartment?.trim() || null,
        city: body.shippingAddress.city.trim(),
        province: body.shippingAddress.province.trim(),
        postal_code: body.shippingAddress.postalCode.trim(),
      },
      shippingMethod: body.shipping.method,
      shippingCost,
      subtotal,
      total,
      items: orderItems,
    })

    const mercadoPagoPreference = await createMercadoPagoPreference({
      body,
      orderId,
      preferenceItems,
      shippingCost,
      subtotal,
      total,
    }).catch((error) => {
      console.error("Mercado Pago preference creation failed:", error)
      return null
    })

    await updatePreferenceId(orderId, mercadoPagoPreference?.preferenceId)

    await sendOrderCreatedEmails({
      orderId,
      customerName: body.customer.name.trim(),
      customerEmail: body.customer.email.trim().toLowerCase(),
      customerPhone: body.customer.phone.trim(),
      shippingAddress: {
        street: body.shippingAddress.street.trim(),
        number: body.shippingAddress.number.trim(),
        floor: body.shippingAddress.floor?.trim() || null,
        apartment: body.shippingAddress.apartment?.trim() || null,
        city: body.shippingAddress.city.trim(),
        province: body.shippingAddress.province.trim(),
        postal_code: body.shippingAddress.postalCode.trim(),
      },
      shippingMethod: body.shipping.method,
      shippingCost,
      subtotal,
      total,
      items: orderItems,
      paymentUrl: mercadoPagoPreference?.initPoint || whatsappUrl,
    }).catch((error) => console.error("Order email notification error:", error))

    const initPoint = mercadoPagoPreference?.initPoint || whatsappUrl

    return NextResponse.json({
      preferenceId: mercadoPagoPreference?.preferenceId || null,
      initPoint,
      orderId,
      paymentMethod: mercadoPagoPreference?.initPoint ? "mercadopago" : "whatsapp",
      message: mercadoPagoPreference?.initPoint
        ? "Pedido creado. Te redirigimos a Mercado Pago."
        : "Pedido creado. Te redirigimos a WhatsApp para confirmarlo.",
    })
  } catch (error) {
    console.error("Checkout error:", error)
    const message = error instanceof Error ? error.message : "Error al procesar el checkout"

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
