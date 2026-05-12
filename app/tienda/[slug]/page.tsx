import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { getActiveProductBySlug } from "@/lib/products";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getActiveProductBySlug(slug);

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
  const product = await getActiveProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
