import { Metadata } from "next"
import { CheckoutForm } from "@/components/checkout-form"

export const metadata: Metadata = {
  title: "Checkout | Farmacia Oasis",
  description: "Finaliza tu compra de productos de cuidado facial",
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container mx-auto max-w-6xl px-4">
        <h1 className="mb-8 text-3xl font-bold text-foreground">Finalizar Compra</h1>
        <CheckoutForm />
      </div>
    </main>
  )
}
