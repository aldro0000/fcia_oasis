"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/cart-store";
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

  const handleAddToCart = () => {
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
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
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
          <span className="text-lg font-bold text-primary">
            {formatPrice(currentPrice)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button onClick={handleAddToCart} className="w-full gap-2" size="sm">
          <ShoppingCart className="size-4" />
          Agregar
        </Button>
      </CardFooter>
    </Card>
  );
}
