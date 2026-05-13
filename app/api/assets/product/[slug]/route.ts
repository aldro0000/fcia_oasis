import { findProductImage, productPlaceholderSvg } from "@/lib/assets/product-images"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const image = await findProductImage(slug)

  if (image) {
    return new Response(image.buffer, {
      headers: {
        "Content-Type": image.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  }

  return new Response(productPlaceholderSvg(slug), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=300",
    },
  })
}
