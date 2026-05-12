"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Minus, Plus, ShoppingCart, ShoppingBag, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/cart-store";
import { toast } from "@/components/ui/toaster";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  
  const hasDiscount = product.promotional_price && product.promotional_price < product.price;
  const currentPrice = product.promotional_price ?? product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.promotional_price!) / product.price) * 100)
    : 0;
  const canBuyOnline = currentPrice > 0 && product.stock > 0;

  const handleAddToCart = () => {
    if (!canBuyOnline) return;

    addItem(product, quantity);
    toast({
      title: "Producto agregado",
      description: `${quantity}x ${product.name} se agrego al carrito`,
      variant: "success",
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Breadcrumb */}
      <Link
        href="/tienda"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Volver a la tienda
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-muted">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-accent">
              <ShoppingBag className="size-32 text-muted-foreground/20" />
            </div>
          )}
          {hasDiscount && (
            <Badge className="absolute left-4 top-4 bg-destructive text-destructive-foreground">
              -{discountPercent}% OFF
            </Badge>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          {product.categories.length > 0 && (
            <p className="mb-2 text-sm font-medium text-primary">
              {product.categories.join(", ")}
            </p>
          )}
          
          <h1 className="mb-4 text-2xl font-bold text-foreground lg:text-3xl">
            {product.name}
          </h1>

          <div className="mb-6 flex items-baseline gap-3">
            {canBuyOnline ? (
              <>
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(currentPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </>
            ) : (
              <span className="text-xl font-semibold text-primary">
                Consultar precio
              </span>
            )}
          </div>

          {product.description && (
            <p className="mb-6 text-muted-foreground">{product.description}</p>
          )}

          <Separator className="mb-6" />

          {canBuyOnline && (
            <div className="mb-6">
              <p className="mb-3 text-sm font-medium text-foreground">Cantidad</p>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="size-4" />
                </Button>
                <span className="w-12 text-center text-lg font-semibold">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>
          )}

          {canBuyOnline ? (
            <Button onClick={handleAddToCart} size="lg" className="mb-6 gap-2">
              <ShoppingCart className="size-5" />
              Agregar al carrito - {formatPrice(currentPrice * quantity)}
            </Button>
          ) : (
            <Button asChild size="lg" className="mb-6 gap-2">
              <a
                href={`https://wa.me/541153324146?text=${encodeURIComponent(`Hola, quiero consultar por ${product.name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="size-5" />
                Consultar por WhatsApp
              </a>
            </Button>
          )}

          {/* Shipping Info */}
          <Card className="bg-accent/50">
            <CardContent className="flex items-start gap-4 p-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Truck className="size-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  Envios a todo el pais
                </p>
                <p className="text-sm text-muted-foreground">
                  Calcula el costo de envio en el checkout. Enviamos por Correo Argentino.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          {(product.sku || product.weight_kg > 0) && (
            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              {product.sku && (
                <p>
                  <span className="font-medium">SKU:</span> {product.sku}
                </p>
              )}
              {product.weight_kg > 0 && (
                <p>
                  <span className="font-medium">Peso:</span> {product.weight_kg * 1000}g
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
