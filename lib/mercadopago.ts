import { MercadoPagoConfig } from "mercadopago"

function normalizeUrl(url: string) {
  return url.replace(/\/$/, "")
}

export function getMercadoPagoClient() {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN

  if (!accessToken) {
    throw new Error("Falta configurar MERCADOPAGO_ACCESS_TOKEN")
  }

  return new MercadoPagoConfig({ accessToken })
}

export function getMercadoPagoPublicKey() {
  return process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || null
}

export function getPublicBaseUrl() {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return normalizeUrl(process.env.NEXT_PUBLIC_BASE_URL)
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return normalizeUrl(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
  }

  if (process.env.VERCEL_URL) {
    return normalizeUrl(`https://${process.env.VERCEL_URL}`)
  }

  return "http://localhost:3000"
}
