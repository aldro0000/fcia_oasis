import { createClient } from "@/lib/supabase/server"
import type { Product } from "@/lib/types"
import { fallbackProducts } from "@/lib/fallback-products"

function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

function sortProducts(products: Product[]) {
  return [...products].sort((a, b) => a.name.localeCompare(b.name, "es"))
}

export async function getActiveProducts() {
  if (!hasSupabaseConfig()) {
    return sortProducts(fallbackProducts)
  }

  try {
    const supabase = await createClient()
    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("name")

    if (error || !products?.length) {
      if (error) console.error("Error fetching products from Supabase:", error)
      return sortProducts(fallbackProducts)
    }

    return products as Product[]
  } catch (error) {
    console.error("Supabase products fallback:", error)
    return sortProducts(fallbackProducts)
  }
}

export async function getActiveProductBySlug(slug: string) {
  if (hasSupabaseConfig()) {
    try {
      const supabase = await createClient()
      const { data: product, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single()

      if (!error && product) return product as Product
    } catch (error) {
      console.error("Supabase product fallback:", error)
    }
  }

  return fallbackProducts.find((product) => product.slug === slug) ?? null
}
