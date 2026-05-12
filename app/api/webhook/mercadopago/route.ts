import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { MercadoPagoConfig, Payment } from "mercadopago"

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Handle payment notification
    if (body.type === "payment") {
      const paymentId = body.data.id
      const payment = new Payment(client)
      const paymentData = await payment.get({ id: paymentId })

      const supabase = await createClient()

      // Update order status based on payment status
      let orderStatus = "pending"
      if (paymentData.status === "approved") {
        orderStatus = "paid"
      } else if (paymentData.status === "rejected") {
        orderStatus = "rejected"
      } else if (paymentData.status === "cancelled") {
        orderStatus = "cancelled"
      }

      await supabase
        .from("orders")
        .update({
          status: orderStatus,
          mercadopago_payment_id: paymentId.toString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", paymentData.external_reference)

      return NextResponse.json({ received: true })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook error" }, { status: 500 })
  }
}
