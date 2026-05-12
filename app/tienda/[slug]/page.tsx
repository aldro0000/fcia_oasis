import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductDetail } from "@/components/product-detail";
import type { Product } from "@/lib/types";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: product } = await supabase
    .from("products")
    .select("name, description")
    .eq("slug", slug)
    .single();

  if (!product) {
    return {
      title: "Producto no encontrado | Farmacia Oasis",
    };
  }

  return {
    title: `${product.name} | Farmacia Oasis`,
    description: product.description || `Compra ${product.name} en Farmacia Oasis`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !product) {
    notFound();
  }

  return <ProductDetail product={product as Product} />;
}
