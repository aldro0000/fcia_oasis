"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Truck, Package, Clock } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import type { CartItem } from "@/lib/types"

interface ShippingOption {
  method: string
  cost: number
  estimatedDays: string
}

interface ShippingCalculatorProps {
  postalCode: string
  items: CartItem[]
  onSelectShipping: (option: ShippingOption | null) => void
  selectedShipping: ShippingOption | null
}

export function ShippingCalculator({
  postalCode,
  items,
  onSelectShipping,
  selectedShipping,
}: ShippingCalculatorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [error, setError] = useState<string | null>(null)
  const [lastPostalCode, setLastPostalCode] = useState<string>("")

  // Calculate total weight from items
  const totalWeight = items.reduce((sum, item) => {
    const weight = item.product.weight_kg || 0.1 // Default 100g per item
    return sum + weight * item.quantity
  }, 0)

  const calculateShipping = async () => {
    if (!postalCode || postalCode.length < 4) {
      setError("Ingresa un código postal válido")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/shipping/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postalCode,
          weight: totalWeight,
        }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
        setShippingOptions([])
      } else {
        setShippingOptions(data.options)
        setLastPostalCode(postalCode)
        // Auto-select first option if none selected
        if (!selectedShipping && data.options.length > 0) {
          onSelectShipping(data.options[0])
        }
      }
    } catch {
      setError("Error al calcular el envío. Por favor intenta nuevamente.")
      setShippingOptions([])
    } finally {
      setIsLoading(false)
    }
  }

  // Reset shipping when postal code changes
  useEffect(() => {
    if (postalCode !== lastPostalCode) {
      setShippingOptions([])
      onSelectShipping(null)
    }
  }, [postalCode, lastPostalCode, onSelectShipping])

  const getMethodIcon = (method: string) => {
    if (method.toLowerCase().includes("express")) {
      return <Truck className="h-5 w-5 text-primary" />
    }
    return <Package className="h-5 w-5 text-muted-foreground" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Opciones de envío
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {postalCode && postalCode.length >= 4 && shippingOptions.length === 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={calculateShipping}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Calculando...
              </>
            ) : (
              <>
                <Truck className="mr-2 h-4 w-4" />
                Calcular envío para CP {postalCode}
              </>
            )}
          </Button>
        )}

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {!postalCode && (
          <p className="text-sm text-muted-foreground">
            Ingresa tu código postal arriba para ver las opciones de envío
          </p>
        )}

        {shippingOptions.length > 0 && (
          <div className="space-y-3">
            {shippingOptions.map((option) => (
              <button
                key={option.method}
                type="button"
                onClick={() => onSelectShipping(option)}
                className={`w-full rounded-lg border p-4 text-left transition-colors ${
                  selectedShipping?.method === option.method
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getMethodIcon(option.method)}
                    <div>
                      <p className="font-medium">{option.method}</p>
                      <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {option.estimatedDays}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-primary">
                    {formatPrice(option.cost)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {shippingOptions.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setShippingOptions([])
              onSelectShipping(null)
              setLastPostalCode("")
            }}
            className="w-full text-muted-foreground"
          >
            Recalcular envío
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
