import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, ShoppingBag, Home } from "lucide-react"

export const metadata: Metadata = {
  title: "Compra Exitosa | Farmacia Oasis",
  description: "Tu compra ha sido procesada exitosamente",
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>
}) {
  const { order } = await searchParams

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md text-center">
        <CardContent className="py-12">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-foreground">
            Compra Exitosa
          </h1>
          <p className="mb-6 text-muted-foreground">
            Tu pedido ha sido procesado correctamente. Recibirás un email con
            los detalles de tu compra y la información de seguimiento.
          </p>
          {order && (
            <p className="mb-6 rounded-lg bg-muted p-3 text-sm">
              <span className="text-muted-foreground">Número de orden: </span>
              <span className="font-mono font-medium">{order.slice(0, 8)}</span>
            </p>
          )}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/tienda">
              <Button variant="outline" className="w-full sm:w-auto">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Seguir comprando
              </Button>
            </Link>
            <Link href="/">
              <Button className="w-full sm:w-auto">
                <Home className="mr-2 h-4 w-4" />
                Volver al inicio
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
