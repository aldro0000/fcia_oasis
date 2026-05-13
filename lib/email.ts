interface EmailLineItem {
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
}

interface OrderEmailData {
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: Record<string, string | null | undefined>
  shippingMethod: string
  shippingCost: number
  subtotal: number
  total: number
  items: EmailLineItem[]
  paymentUrl?: string
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value)
}

function getEmailConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.EMAIL_FROM || "Farmacia Oasis <onboarding@resend.dev>",
    sellerEmail:
      process.env.ORDER_NOTIFICATION_EMAIL ||
      process.env.NEXT_PUBLIC_SELLER_EMAIL ||
      "farmaciaoasis13@gmail.com",
  }
}

function addressText(address: OrderEmailData["shippingAddress"]) {
  return [
    `${address.street || ""} ${address.number || ""}`.trim(),
    address.floor ? `Piso ${address.floor}` : null,
    address.apartment ? `Depto ${address.apartment}` : null,
    address.city,
    address.province,
    address.postal_code || address.postalCode,
  ]
    .filter(Boolean)
    .join(", ")
}

function orderItemsHtml(items: EmailLineItem[]) {
  return items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${item.product_name}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right;">${formatPrice(item.unit_price)}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right;">${formatPrice(item.total_price)}</td>
        </tr>`
    )
    .join("")
}

function buildOrderHtml({
  order,
  title,
  intro,
  includePaymentButton = false,
}: {
  order: OrderEmailData
  title: string
  intro: string
  includePaymentButton?: boolean
}) {
  return `
    <div style="font-family:Arial,sans-serif;color:#0f2730;line-height:1.5;max-width:720px;margin:0 auto;">
      <div style="background:#0e7a73;color:white;padding:20px;border-radius:16px 16px 0 0;">
        <h1 style="margin:0;font-size:24px;">${title}</h1>
      </div>
      <div style="border:1px solid #dbe7e5;border-top:0;padding:20px;border-radius:0 0 16px 16px;">
        <p>${intro}</p>
        <p><strong>Número de pedido:</strong> ${order.orderId.slice(0, 8)}</p>
        <p><strong>Cliente:</strong> ${order.customerName}</p>
        <p><strong>Email:</strong> ${order.customerEmail}</p>
        <p><strong>Teléfono:</strong> ${order.customerPhone}</p>
        <p><strong>Dirección:</strong> ${addressText(order.shippingAddress)}</p>
        <p><strong>Envío:</strong> ${order.shippingMethod} (${formatPrice(order.shippingCost)})</p>
        <table style="width:100%;border-collapse:collapse;margin:18px 0;">
          <thead>
            <tr style="background:#eef8f7;">
              <th style="padding:8px;text-align:left;">Producto</th>
              <th style="padding:8px;text-align:center;">Cant.</th>
              <th style="padding:8px;text-align:right;">Precio</th>
              <th style="padding:8px;text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>${orderItemsHtml(order.items)}</tbody>
        </table>
        <p style="text-align:right;margin:4px 0;"><strong>Subtotal:</strong> ${formatPrice(order.subtotal)}</p>
        <p style="text-align:right;margin:4px 0;"><strong>Envío:</strong> ${formatPrice(order.shippingCost)}</p>
        <p style="text-align:right;font-size:20px;margin:8px 0;"><strong>Total:</strong> ${formatPrice(order.total)}</p>
        ${
          includePaymentButton && order.paymentUrl
            ? `<p style="margin-top:24px;"><a href="${order.paymentUrl}" style="background:#0e7a73;color:white;padding:12px 18px;border-radius:999px;text-decoration:none;font-weight:bold;">Completar pago</a></p>`
            : ""
        }
        <p style="font-size:12px;color:#64748b;margin-top:24px;">Farmacia Oasis - mensaje automático.</p>
      </div>
    </div>`
}

async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[]
  subject: string
  html: string
}) {
  const config = getEmailConfig()

  if (!config.apiKey) {
    console.warn(`Email omitido (${subject}): falta RESEND_API_KEY`)
    return { skipped: true }
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: config.from,
      to,
      subject,
      html,
    }),
  })

  if (!response.ok) {
    const details = await response.text().catch(() => "")
    throw new Error(`Error enviando email: ${response.status} ${details}`)
  }

  return response.json()
}

export async function sendOrderCreatedEmails(order: OrderEmailData) {
  const config = getEmailConfig()
  const customerHtml = buildOrderHtml({
    order,
    title: "Recibimos tu pedido",
    intro:
      "Gracias por comprar en Farmacia Oasis. Recibimos tu pedido y te dejamos el detalle. Si todavía no completaste el pago, podés hacerlo desde Mercado Pago.",
    includePaymentButton: true,
  })
  const sellerHtml = buildOrderHtml({
    order,
    title: "Nuevo pedido en la tienda",
    intro: "Entró un nuevo pedido desde la tienda online.",
    includePaymentButton: false,
  })

  await Promise.allSettled([
    sendEmail({
      to: order.customerEmail,
      subject: `Farmacia Oasis - Pedido recibido #${order.orderId.slice(0, 8)}`,
      html: customerHtml,
    }),
    sendEmail({
      to: config.sellerEmail,
      subject: `Nuevo pedido Farmacia Oasis #${order.orderId.slice(0, 8)}`,
      html: sellerHtml,
    }),
  ])
}

export async function sendPaymentApprovedEmails(order: OrderEmailData) {
  const config = getEmailConfig()
  const customerHtml = buildOrderHtml({
    order,
    title: "Pago aprobado",
    intro:
      "Tu pago fue aprobado. Vamos a preparar tu pedido y te avisaremos cuando esté listo o despachado.",
  })
  const sellerHtml = buildOrderHtml({
    order,
    title: "Pago aprobado - preparar pedido",
    intro: "Mercado Pago aprobó el pago de este pedido. Ya se puede preparar la compra.",
  })

  await Promise.allSettled([
    sendEmail({
      to: order.customerEmail,
      subject: `Farmacia Oasis - Pago aprobado #${order.orderId.slice(0, 8)}`,
      html: customerHtml,
    }),
    sendEmail({
      to: config.sellerEmail,
      subject: `Pago aprobado Farmacia Oasis #${order.orderId.slice(0, 8)}`,
      html: sellerHtml,
    }),
  ])
}
