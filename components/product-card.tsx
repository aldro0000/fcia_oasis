"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ShoppingCart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/cart-store";
import { getProductImagePath } from "@/lib/assets/product-image-paths";
import { toast } from "@/components/ui/toaster";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const hasDiscount = product.promotional_price && product.promotional_price < product.price;
  const currentPrice = product.promotional_price ?? product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.promotional_price!) / product.price) * 100)
    : 0;
  const canBuyOnline = currentPrice > 0 && product.stock > 0;
  const imageUrl = product.image_url || getProductImagePath(product.slug);

  const handleAddToCart = () => {
    if (!canBuyOnline) return;

    addItem(product);
    toast({
      title: "Producto agregado",
      description: `${product.name} se agrego al carrito`,
      variant: "success",
    });
  };

  return (
    <Card className="group flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/tienda/${product.slug}`} className="relative aspect-square overflow-hidden bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-accent">
            <ShoppingBag className="size-16 text-muted-foreground/30" />
          </div>
        )}
        {hasDiscount && (
          <Badge className="absolute left-3 top-3 bg-destructive text-destructive-foreground">
            -{discountPercent}%
          </Badge>
        )}
      </Link>
      
      <CardContent className="flex flex-1 flex-col p-4">
        <Link href={`/tienda/${product.slug}`}>
          <h3 className="mb-2 line-clamp-2 text-sm font-medium leading-tight transition-colors hover:text-primary">
            {product.name}
          </h3>
        </Link>
        
        {product.categories.length > 0 && (
          <p className="mb-2 text-xs text-muted-foreground">
            {product.categories[0]}
          </p>
        )}
        
        <div className="mt-auto flex items-baseline gap-2">
          {canBuyOnline ? (
            <>
              <span className="text-lg font-bold text-primary">
                {formatPrice(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </>
          ) : (
            <span className="text-sm font-semibold text-primary">
              Consultar precio
            </span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        {canBuyOnline ? (
          <Button onClick={handleAddToCart} className="w-full gap-2" size="sm">
            <ShoppingCart className="size-4" />
            Agregar
          </Button>
        ) : (
          <Button asChild className="w-full gap-2" size="sm" variant="outline">
            <a
              href={`https://wa.me/541153324146?text=${encodeURIComponent(`Hola, quiero consultar por ${product.name}`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="size-4" />
              Consultar
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
