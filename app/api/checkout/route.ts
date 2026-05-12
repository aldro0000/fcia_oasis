import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { MercadoPagoConfig, Preference } from "mercadopago"

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

interface CheckoutItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
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
  subtotal: number
  total: number
}

export async function POST(request: Request) {
  try {
    const body: CheckoutRequest = await request.json()
    const supabase = await createClient()

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: body.customer.name,
        customer_email: body.customer.email,
        customer_phone: body.customer.phone,
        shipping_address: body.shippingAddress,
        shipping_cost: body.shipping.cost,
        shipping_method: body.shipping.method,
        subtotal: body.subtotal,
        total: body.total,
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

    // Create order items
    const orderItems = body.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.productName,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.unitPrice * item.quantity,
    }))

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems)

    if (itemsError) {
      console.error("Error creating order items:", itemsError)
    }

    // Create Mercado Pago preference
    const preference = new Preference(client)

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    const preferenceData = await preference.create({
      body: {
        items: [
          ...body.items.map((item) => ({
            id: item.productId,
            title: item.productName,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            currency_id: "ARS",
          })),
          // Add shipping as a separate item
          {
            id: "shipping",
            title: `Envío - ${body.shipping.method}`,
            quantity: 1,
            unit_price: body.shipping.cost,
            currency_id: "ARS",
          },
        ],
        payer: {
          name: body.customer.name.split(" ")[0],
          surname: body.customer.name.split(" ").slice(1).join(" ") || "",
          email: body.customer.email,
          phone: {
            number: body.customer.phone,
          },
          address: {
            street_name: body.shippingAddress.street,
            street_number: parseInt(body.shippingAddress.number) || 0,
            zip_code: body.shippingAddress.postalCode,
          },
        },
        back_urls: {
          success: `${baseUrl}/checkout/success?order=${order.id}`,
          failure: `${baseUrl}/checkout/failure?order=${order.id}`,
          pending: `${baseUrl}/checkout/pending?order=${order.id}`,
        },
        auto_return: "approved",
        external_reference: order.id,
        notification_url: `${baseUrl}/api/webhook/mercadopago`,
        statement_descriptor: "FARMACIA OASIS",
      },
    })

    // Update order with Mercado Pago preference ID
    await supabase
      .from("orders")
      .update({ mercadopago_preference_id: preferenceData.id })
      .eq("id", order.id)

    return NextResponse.json({
      preferenceId: preferenceData.id,
      initPoint: preferenceData.init_point,
      orderId: order.id,
    })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: "Error al procesar el checkout" },
      { status: 500 }
    )
  }
}
