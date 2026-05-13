import { NextResponse } from "next/server"
import { Payment } from "mercadopago"
import { createClient } from "@/lib/supabase/server"
import { getMercadoPagoClient } from "@/lib/mercadopago"

type MercadoPagoOrderStatus =
  | "pending"
  | "approved"
  | "in_process"
  | "rejected"
  | "cancelled"

function mapPaymentStatus(status?: string): MercadoPagoOrderStatus {
  if (status === "approved") return "approved"
  if (status === "rejected") return "rejected"
  if (status === "cancelled") return "cancelled"
  if (status === "in_process" || status === "in_mediation") return "in_process"
  return "pending"
}

async function getNotificationPayload(request: Request) {
  const url = new URL(request.url)
  const body = await request.json().catch(() => null)
  const queryPaymentId = url.searchParams.get("data.id") || url.searchParams.get("id")
  const bodyPaymentId = body?.data?.id || body?.id
  const topic = body?.type || body?.topic || url.searchParams.get("type") || url.searchParams.get("topic")

  return {
    paymentId: bodyPaymentId || queryPaymentId,
    topic,
  }
}

export async function POST(request: Request) {
  try {
    const { paymentId, topic } = await getNotificationPayload(request)

    if (!paymentId || (topic && topic !== "payment")) {
      return NextResponse.json({ received: true })
    }

    const payment = new Payment(getMercadoPagoClient())
    const paymentData = await payment.get({ id: paymentId })
    const orderId = paymentData.external_reference

    if (!orderId) {
      return NextResponse.json({ received: true })
    }

    const supabase = await createClient()
    const { error } = await supabase
      .from("orders")
      .update({
        status: mapPaymentStatus(paymentData.status),
        mercadopago_payment_id: String(paymentId),
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)

    if (error) {
      console.error("Error updating order from Mercado Pago webhook:", error)
      return NextResponse.json({ error: "Order update error" }, { status: 500 })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook error" }, { status: 500 })
  }
}
