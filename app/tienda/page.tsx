import { ProductCard } from "@/components/product-card";
import { ShoppingBag } from "lucide-react";
import { getActiveProducts } from "@/lib/products";

export const metadata = {
  title: "Tienda | Farmacia Oasis",
  description: "Productos de cuidado facial y dermocosmetica de Farmacia Oasis. Envios a todo el pais con Correo Argentino.",
};

export default async function TiendaPage() {
  const productsList = await getActiveProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">
          Nuestra tienda
        </p>
        <h1 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl">
          Productos de cuidado facial
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Descubri nuestra linea de productos de dermocosmetica profesional.
          Envios a todo el pais con Correo Argentino.
        </p>
      </div>

      {/* Products Grid */}
      {productsList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShoppingBag className="mb-4 size-16 text-muted-foreground/30" />
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            Productos en camino
          </h2>
          <p className="text-muted-foreground">
            Estamos cargando nuestro catalogo. Pronto vas a poder ver todos nuestros productos.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productsList.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
