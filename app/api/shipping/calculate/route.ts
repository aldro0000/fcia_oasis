import { NextResponse } from "next/server"

// Correo Argentino API integration
// Using manual price table as fallback when API credentials are not available
// Prices based on current Correo Argentino rates (may need updating)

interface ShippingRequest {
  postalCode: string
  weight: number // in kg
}

interface ShippingOption {
  method: string
  cost: number
  estimatedDays: string
}

// Price zones based on postal code ranges
// Zone 1: AMBA (1000-1999)
// Zone 2: Pampeana (2000-6999)
// Zone 3: NOA/NEA/Cuyo (3000-5999, 4000-4999)
// Zone 4: Patagonia (8000-9999)

function getZone(postalCode: string): number {
  const cp = parseInt(postalCode)
  if (cp >= 1000 && cp <= 1999) return 1 // AMBA
  if (cp >= 2000 && cp <= 2999) return 2 // Pampeana cerca
  if (cp >= 3000 && cp <= 3999) return 2 // Litoral
  if (cp >= 4000 && cp <= 4999) return 3 // NOA
  if (cp >= 5000 && cp <= 5999) return 2 // Córdoba/Cuyo
  if (cp >= 6000 && cp <= 6999) return 2 // Pampeana
  if (cp >= 7000 && cp <= 7999) return 2 // Costa Atlántica
  if (cp >= 8000 && cp <= 8999) return 4 // Patagonia Norte
  if (cp >= 9000 && cp <= 9999) return 4 // Patagonia Sur
  return 3 // Default to zone 3
}

// Base prices per zone and weight range (in ARS)
// Prices are estimates based on Correo Argentino standard rates
const PRICING: Record<number, { base: number; perKg: number }> = {
  1: { base: 3500, perKg: 800 },   // AMBA
  2: { base: 4500, perKg: 1000 },  // Pampeana
  3: { base: 5500, perKg: 1200 },  // NOA/NEA/Cuyo
  4: { base: 7000, perKg: 1500 },  // Patagonia
}

const EXPRESS_MULTIPLIER = 1.8 // Express costs 80% more

function calculateShippingCost(postalCode: string, weight: number): ShippingOption[] {
  const zone = getZone(postalCode)
  const pricing = PRICING[zone]
  
  // Minimum weight is 0.5kg
  const effectiveWeight = Math.max(weight, 0.5)
  
  // Calculate base cost
  const standardCost = Math.round(pricing.base + pricing.perKg * effectiveWeight)
  const expressCost = Math.round(standardCost * EXPRESS_MULTIPLIER)
  
  // Estimated days based on zone
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
      method: "Correo Argentino - Envío Clásico",
      cost: standardCost,
      estimatedDays: standardDays[zone],
    },
    {
      method: "Correo Argentino - Envío Express",
      cost: expressCost,
      estimatedDays: expressDays[zone],
    },
  ]
}

export async function POST(request: Request) {
  try {
    const body: ShippingRequest = await request.json()
    const { postalCode, weight } = body

    if (!postalCode || postalCode.length < 4) {
      return NextResponse.json(
        { error: "Código postal inválido" },
        { status: 400 }
      )
    }

    // Check if we have Correo Argentino API credentials
    const hasApiCredentials = 
      process.env.CORREO_ARGENTINO_USER && 
      process.env.CORREO_ARGENTINO_PASSWORD

    if (hasApiCredentials) {
      // TODO: Implement actual Correo Argentino API call
      // The API requires commercial account credentials
      // For now, we use the manual pricing table
    }

    // Calculate shipping options using manual pricing
    const options = calculateShippingCost(postalCode, weight)

    return NextResponse.json({ options })
  } catch (error) {
    console.error("Shipping calculation error:", error)
    return NextResponse.json(
      { error: "Error al calcular el envío" },
      { status: 500 }
    )
  }
}
