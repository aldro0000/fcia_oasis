import { NextResponse } from "next/server"
import {
  buildPackageDimensions,
  calculateFallbackShippingCost,
  hasCorreoArgentinoCredentials,
  normalizePostalCode,
  quoteCorreoArgentino,
} from "@/lib/correo-argentino"

interface ShippingRequest {
  postalCode: string
  weight: number
  height?: number
  width?: number
  length?: number
}

function isValidArgentinePostalCode(postalCode: string) {
  const normalized = normalizePostalCode(postalCode)
  return /^\d{4}$/.test(normalized) || /^[A-Z]\d{4}[A-Z]{3}$/.test(normalized)
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ShippingRequest
    const postalCode = normalizePostalCode(body.postalCode || "")

    if (!isValidArgentinePostalCode(postalCode)) {
      return NextResponse.json(
        { error: "Código postal argentino inválido" },
        { status: 400 }
      )
    }

    if (!Number.isFinite(body.weight) || body.weight <= 0) {
      return NextResponse.json(
        { error: "El peso del paquete es inválido" },
        { status: 400 }
      )
    }

    const dimensions = buildPackageDimensions({
      weightKg: body.weight,
      heightCm: body.height,
      widthCm: body.width,
      lengthCm: body.length,
    })

    if (hasCorreoArgentinoCredentials()) {
      try {
        const options = await quoteCorreoArgentino({
          postalCodeDestination: postalCode,
          dimensions,
        })

        return NextResponse.json({ options, source: "correo-argentino" })
      } catch (error) {
        console.error("Correo Argentino quote error:", error)
      }
    }

    const options = calculateFallbackShippingCost(postalCode, body.weight)

    return NextResponse.json({
      options,
      source: "fallback",
      warning:
        "No se pudo cotizar contra Correo Argentino. Se muestran precios estimados.",
    })
  } catch (error) {
    console.error("Shipping calculation error:", error)
    return NextResponse.json(
      { error: "Error al calcular el envío" },
      { status: 500 }
    )
  }
}
