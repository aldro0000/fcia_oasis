import { NextResponse } from "next/server"
import { getActiveProductBySlug } from "@/lib/products"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const product = await getActiveProductBySlug(slug)

  if (!product) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
  }

  return NextResponse.json(product)
}
