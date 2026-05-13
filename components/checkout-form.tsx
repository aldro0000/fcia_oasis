"use client"

import { useState, useEffect } from "react"
import { useCartStore } from "@/lib/cart-store"
import { getProductImagePath } from "@/lib/assets/product-image-paths"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShippingCalculator } from "@/components/shipping-calculator"
import { formatPrice } from "@/lib/utils"
import { Loader2, ShoppingBag, Truck, CreditCard } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface ShippingOption {
  method: string
  cost: number
  estimatedDays: string
}

export function CheckoutForm() {
  const { items, getSubtotal, clearCart } = useCartStore()
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    number: "",
    floor: "",
    apartment: "",
    city: "",
    province: "",
    postalCode: "",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <Card className="mx-auto max-w-md text-center">
        <CardContent className="py-12">
          <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-semibold">Tu carrito está vacío</h2>
          <p className="mb-6 text-muted-foreground">
            Agrega productos para continuar con tu compra
          </p>
          <Link href="/tienda">
            <Button>Ver productos</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  const subtotal = getSubtotal()
  const shippingCost = selectedShipping?.cost ?? 0
  const total = subtotal + shippingCost

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedShipping) {
      alert("Por favor selecciona un método de envío")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          },
          shippingAddress: {
            street: formData.street,
            number: formData.number,
            floor: formData.floor,
            apartment: formData.apartment,
            city: formData.city,
            province: formData.province,
            postalCode: formData.postalCode,
          },
          shipping: {
            method: selectedShipping.method,
            cost: selectedShipping.cost,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al procesar el pedido")
      }

      if (data.initPoint) {
        clearCart()
        window.location.href = data.initPoint
      } else {
        throw new Error(data.error || "Error al procesar el pedido")
      }
    } catch (error) {
      console.error("Error:", error)
      const message = error instanceof Error ? error.message : "Error al procesar el pedido"
      alert(`${message}. Por favor intenta nuevamente o escribinos por WhatsApp.`)
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid =
    formData.name &&
    formData.email &&
    formData.phone &&
    formData.street &&
    formData.number &&
    formData.city &&
    formData.province &&
    formData.postalCode &&
    selectedShipping

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Order Summary */}
        <div className="lg:col-span-1 lg:order-2">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Resumen del pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => {
                const imageUrl = item.product.image_url || getProductImagePath(item.product.slug)

                return (
                <div key={item.product.id} className="flex gap-3">
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-muted">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        <ShoppingBag className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-2">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Cant: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium">
                    {formatPrice(
                      (item.product.promotional_price ?? item.product.price) *
                        item.quantity
                    )}
                  </p>
                </div>
                )
              })}

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Envío</span>
                  <span>
                    {selectedShipping
                      ? formatPrice(shippingCost)
                      : "Calcular abajo"}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Checkout Form */}
        <div className="space-y-6 lg:col-span-2 lg:order-1">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Información de contacto</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="name">Nombre completo *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Juan Pérez"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="juan@email.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="+54 11 1234-5678"
                />
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Dirección de envío
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="street">Calle *</Label>
                <Input
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  required
                  placeholder="Av. Corrientes"
                />
              </div>
              <div>
                <Label htmlFor="number">Número *</Label>
                <Input
                  id="number"
                  name="number"
                  value={formData.number}
                  onChange={handleInputChange}
                  required
                  placeholder="1234"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="floor">Piso</Label>
                  <Input
                    id="floor"
                    name="floor"
                    value={formData.floor}
                    onChange={handleInputChange}
                    placeholder="3"
                  />
                </div>
                <div>
                  <Label htmlFor="apartment">Depto</Label>
                  <Input
                    id="apartment"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    placeholder="A"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="city">Ciudad *</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  placeholder="Buenos Aires"
                />
              </div>
              <div>
                <Label htmlFor="province">Provincia *</Label>
                <Input
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  required
                  placeholder="Buenos Aires"
                />
              </div>
              <div>
                <Label htmlFor="postalCode">Código Postal *</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  required
                  placeholder="1043"
                />
              </div>
            </CardContent>
          </Card>

          {/* Shipping Calculator */}
          <ShippingCalculator
            postalCode={formData.postalCode}
            items={items}
            onSelectShipping={setSelectedShipping}
            selectedShipping={selectedShipping}
          />

          {/* Submit Button */}
          <Card>
            <CardContent className="pt-6">
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Confirmar pedido - {formatPrice(total)}
                  </>
                )}
              </Button>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Si Mercado Pago está configurado, vas a pagar de forma segura. Si no, te redirigimos a WhatsApp para confirmar el pedido.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
