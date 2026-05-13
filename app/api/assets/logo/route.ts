import { findLogoImage, logoPlaceholderSvg } from "@/lib/assets/product-images"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const image = await findLogoImage()

  if (image) {
    return new Response(image.buffer, {
      headers: {
        "Content-Type": image.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  }

  return new Response(logoPlaceholderSvg(), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=300",
    },
  })
}
