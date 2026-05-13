export interface CorreoPackageDimensions {
  weightGrams: number
  heightCm: number
  widthCm: number
  lengthCm: number
}

export interface CorreoShippingOption {
  method: string
  cost: number
  estimatedDays: string
  deliveredType?: "D" | "S"
  productType?: string
  source: "correo-argentino" | "fallback"
}

interface CorreoTokenResponse {
  token?: string
  message?: string
}

interface CorreoRate {
  deliveredType?: "D" | "S"
  productType?: string
  productName?: string
  price?: number
  deliveryTimeMin?: string
  deliveryTimeMax?: string
}

interface CorreoRatesResponse {
  rates?: CorreoRate[]
  message?: string
}

interface CorreoConfig {
  apiUrl: string
  user?: string
  password?: string
  customerId?: string
  originPostalCode?: string
}

const DEFAULT_API_URL = "https://api.correoargentino.com.ar/micorreo/v1"
const DEFAULT_DIMENSIONS = {
  heightCm: 10,
  widthCm: 20,
  lengthCm: 30,
}

const PRICING: Record<number, { base: number; perKg: number }> = {
  1: { base: 3500, perKg: 800 },
  2: { base: 4500, perKg: 1000 },
  3: { base: 5500, perKg: 1200 },
  4: { base: 7000, perKg: 1500 },
}

const EXPRESS_MULTIPLIER = 1.8

function getCorreoConfig(): CorreoConfig {
  return {
    apiUrl: process.env.CORREO_ARGENTINO_API_URL || DEFAULT_API_URL,
    user: process.env.CORREO_ARGENTINO_USER,
    password: process.env.CORREO_ARGENTINO_PASSWORD,
    customerId: process.env.CORREO_ARGENTINO_CUSTOMER_ID,
    originPostalCode: process.env.CORREO_ARGENTINO_ORIGIN_POSTAL_CODE,
  }
}

export function hasCorreoArgentinoCredentials() {
  const config = getCorreoConfig()
  return Boolean(
    config.user &&
      config.password &&
      config.customerId &&
      config.originPostalCode
  )
}

export function normalizePostalCode(postalCode: string) {
  return postalCode.trim().toUpperCase().replace(/\s+/g, "")
}

export function buildPackageDimensions({
  weightKg,
  heightCm,
  widthCm,
  lengthCm,
}: {
  weightKg: number
  heightCm?: number
  widthCm?: number
  lengthCm?: number
}): CorreoPackageDimensions {
  return {
    weightGrams: Math.min(Math.max(Math.ceil(weightKg * 1000), 1), 25000),
    heightCm: Math.min(Math.max(Math.ceil(heightCm || DEFAULT_DIMENSIONS.heightCm), 1), 150),
    widthCm: Math.min(Math.max(Math.ceil(widthCm || DEFAULT_DIMENSIONS.widthCm), 1), 150),
    lengthCm: Math.min(Math.max(Math.ceil(lengthCm || DEFAULT_DIMENSIONS.lengthCm), 1), 150),
  }
}

function getZone(postalCode: string): number {
  const numericPostalCode = Number.parseInt(postalCode.replace(/\D/g, ""), 10)

  if (numericPostalCode >= 1000 && numericPostalCode <= 1999) return 1
  if (numericPostalCode >= 2000 && numericPostalCode <= 3999) return 2
  if (numericPostalCode >= 4000 && numericPostalCode <= 4999) return 3
  if (numericPostalCode >= 5000 && numericPostalCode <= 7999) return 2
  if (numericPostalCode >= 8000 && numericPostalCode <= 9999) return 4

  return 3
}

export function calculateFallbackShippingCost(
  postalCode: string,
  weightKg: number
): CorreoShippingOption[] {
  const zone = getZone(postalCode)
  const pricing = PRICING[zone]
  const effectiveWeight = Math.max(weightKg, 0.5)
  const standardCost = Math.round(pricing.base + pricing.perKg * effectiveWeight)
  const expressCost = Math.round(standardCost * EXPRESS_MULTIPLIER)
  const standardDays: Record<number, string> = {
    1: "2-3 días hábiles",
    2: "3-5 días hábiles",
    3: "5-7 días hábiles",
    4: "7-10 días hábiles",
  }
  const expressDays: Record<number, string> = {
    1: "1-2 días hábiles",
    2: "2-3 días hábiles",
    3: "3-4 días hábiles",
    4: "4-5 días hábiles",
  }

  return [
    {
      method: "Correo Argentino - Envío Clásico (estimado)",
      cost: standardCost,
      estimatedDays: standardDays[zone],
      deliveredType: "D",
      source: "fallback",
    },
    {
      method: "Correo Argentino - Envío Express (estimado)",
      cost: expressCost,
      estimatedDays: expressDays[zone],
      deliveredType: "D",
      source: "fallback",
    },
  ]
}

async function getCorreoToken(config: CorreoConfig) {
  const response = await fetch(`${config.apiUrl}/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${config.user}:${config.password}`).toString("base64")}`,
    },
    cache: "no-store",
  })
  const data = (await response.json().catch(() => ({}))) as CorreoTokenResponse

  if (!response.ok || !data.token) {
    throw new Error(data.message || "No se pudo autenticar con Correo Argentino")
  }

  return data.token
}

export async function quoteCorreoArgentino({
  postalCodeDestination,
  dimensions,
}: {
  postalCodeDestination: string
  dimensions: CorreoPackageDimensions
}): Promise<CorreoShippingOption[]> {
  const config = getCorreoConfig()

  if (!hasCorreoArgentinoCredentials()) {
    throw new Error("Faltan credenciales de Correo Argentino")
  }

  const token = await getCorreoToken(config)
  const response = await fetch(`${config.apiUrl}/rates`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customerId: config.customerId,
      postalCodeOrigin: normalizePostalCode(config.originPostalCode!),
      postalCodeDestination: normalizePostalCode(postalCodeDestination),
      dimensions: {
        weight: dimensions.weightGrams,
        height: dimensions.heightCm,
        width: dimensions.widthCm,
        length: dimensions.lengthCm,
      },
    }),
    cache: "no-store",
  })
  const data = (await response.json().catch(() => ({}))) as CorreoRatesResponse

  if (!response.ok || !data.rates?.length) {
    throw new Error(data.message || "Correo Argentino no devolvió cotizaciones")
  }

  return data.rates.map((rate) => ({
    method: `${rate.productName || "Correo Argentino"}${
      rate.deliveredType === "S" ? " - Retiro en sucursal" : " - Envío a domicilio"
    }`,
    cost: Math.round(Number(rate.price || 0)),
    estimatedDays:
      rate.deliveryTimeMin && rate.deliveryTimeMax
        ? `${rate.deliveryTimeMin}-${rate.deliveryTimeMax} días hábiles`
        : "A confirmar",
    deliveredType: rate.deliveredType,
    productType: rate.productType,
    source: "correo-argentino",
  }))
}
