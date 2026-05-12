import { NextResponse } from "next/server"
import { Preference } from "mercadopago"
import { createClient } from "@/lib/supabase/server"
import { getMercadoPagoClient, getPublicBaseUrl } from "@/lib/mercadopago"

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

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutRequest
    const validationError = validateCheckout(body)

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    const supabase = await createClient()
    const productIds = [...new Set(body.items.map((item) => item.productId))]
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id,name,price,promotional_price,stock,is_active")
      .in("id", productIds)

    if (productsError || !products) {
      console.error("Error fetching checkout products:", productsError)
      return NextResponse.json(
        { error: "Error al validar los productos" },
        { status: 500 }
      )
    }

    const productsById = new Map(
      (products as ProductForCheckout[]).map((product) => [product.id, product])
    )

    const preferenceItems = body.items.map((item) => {
      const product = productsById.get(item.productId)

      if (!product || !product.is_active) {
        throw new Error("Uno de los productos ya no está disponible")
      }

      if (product.stock < item.quantity) {
        throw new Error(`No hay stock suficiente de ${product.name}`)
      }

      return {
        id: product.id,
        title: product.name,
        quantity: item.quantity,
        unit_price: roundMoney(product.promotional_price ?? product.price),
        currency_id: "ARS",
      }
    })

    const subtotal = roundMoney(
      preferenceItems.reduce(
        (sum, item) => sum + item.unit_price * item.quantity,
        0
      )
    )
    const shippingCost = roundMoney(body.shipping.cost)
    const total = roundMoney(subtotal + shippingCost)

    const { data: order, error: orderError } = await supabase
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
      .select()
      .single()

    if (orderError) {
      console.error("Error creating order:", orderError)
      return NextResponse.json(
        { error: "Error al crear la orden" },
        { status: 500 }
      )
    }

    const orderItems = preferenceItems.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.title,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: roundMoney(item.unit_price * item.quantity),
    }))

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems)

    if (itemsError) {
      console.error("Error creating order items:", itemsError)
      return NextResponse.json(
        { error: "Error al crear el detalle de la orden" },
        { status: 500 }
      )
    }

    const preference = new Preference(getMercadoPagoClient())
    const baseUrl = getPublicBaseUrl()
    const notificationUrl = `${baseUrl}/api/webhook/mercadopago`
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
          success: `${baseUrl}/checkout/success?order=${order.id}`,
          failure: `${baseUrl}/checkout/failure?order=${order.id}`,
          pending: `${baseUrl}/checkout/pending?order=${order.id}`,
        },
        auto_return: "approved",
        external_reference: order.id,
        notification_url: notificationUrl,
        statement_descriptor: "FARMACIA OASIS",
        metadata: {
          order_id: order.id,
          subtotal,
          shipping_cost: shippingCost,
          total,
        },
      },
    })

    await supabase
      .from("orders")
      .update({ mercadopago_preference_id: preferenceData.id })
      .eq("id", order.id)

    return NextResponse.json({
      preferenceId: preferenceData.id,
      initPoint: preferenceData.init_point || preferenceData.sandbox_init_point,
      orderId: order.id,
    })
  } catch (error) {
    console.error("Checkout error:", error)
    const message = error instanceof Error ? error.message : "Error al procesar el checkout"

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
