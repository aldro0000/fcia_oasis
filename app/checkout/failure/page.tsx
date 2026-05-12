import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { XCircle, RefreshCw, Home } from "lucide-react"

export const metadata: Metadata = {
  title: "Pago Rechazado | Farmacia Oasis",
  description: "Tu pago no pudo ser procesado",
}

export default function CheckoutFailurePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md text-center">
        <CardContent className="py-12">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-red-100 p-4">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-foreground">
            Pago Rechazado
          </h1>
          <p className="mb-6 text-muted-foreground">
            Lo sentimos, tu pago no pudo ser procesado. Por favor intenta
            nuevamente o utiliza otro método de pago.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/checkout">
              <Button className="w-full sm:w-auto">
                <RefreshCw className="mr-2 h-4 w-4" />
                Intentar nuevamente
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full sm:w-auto">
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
