import { formatPrice } from "@/lib/utils"

interface OrderContactItem {
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
}

interface OrderContactData {
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: Record<string, string | null | undefined>
  shippingMethod: string
  shippingCost: number
  subtotal: number
  total: number
  items: OrderContactItem[]
}

function getWhatsAppPhone() {
  return (
    process.env.ORDER_WHATSAPP_PHONE ||
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE ||
    "541153324146"
  ).replace(/\D/g, "")
}

function addressText(address: Record<string, string | null | undefined>) {
  const floor = address.floor ? `, piso ${address.floor}` : ""
  const apartment = address.apartment ? `, depto ${address.apartment}` : ""
  return `${address.street || ""} ${address.number || ""}${floor}${apartment}, ${address.city || ""}, ${address.province || ""} (${address.postal_code || address.postalCode || ""})`
}

export function buildWhatsAppOrderMessage(order: OrderContactData) {
  const itemsText = order.items
    .map(
      (item) =>
        `• ${item.quantity} x ${item.product_name} - ${formatPrice(item.total_price)}`
    )
    .join("\n")

  return [
    `Hola Farmacia Oasis, quiero confirmar mi pedido #${order.orderId.slice(0, 8)}.`,
    "",
    "Datos del cliente:",
    `Nombre: ${order.customerName}`,
    `Email: ${order.customerEmail}`,
    `Teléfono: ${order.customerPhone}`,
    "",
    "Productos:",
    itemsText,
    "",
    `Subtotal: ${formatPrice(order.subtotal)}`,
    `Envío: ${order.shippingMethod} (${formatPrice(order.shippingCost)})`,
    `Total: ${formatPrice(order.total)}`,
    "",
    `Dirección: ${addressText(order.shippingAddress)}`,
  ].join("\n")
}

export function buildWhatsAppOrderUrl(order: OrderContactData) {
  return `https://wa.me/${getWhatsAppPhone()}?text=${encodeURIComponent(
    buildWhatsAppOrderMessage(order)
  )}`
}
