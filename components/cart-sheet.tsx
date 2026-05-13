"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCartStore } from "@/lib/cart-store";
import { getProductImagePath } from "@/lib/assets/product-image-paths";
import { formatPrice } from "@/lib/utils";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="size-5" />
            Carrito de compras
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="size-16 text-muted-foreground/50" />
            <div>
              <p className="font-medium">Tu carrito esta vacio</p>
              <p className="text-sm text-muted-foreground">
                Agrega productos desde nuestra tienda
              </p>
            </div>
            <Button asChild onClick={() => onOpenChange(false)}>
              <Link href="/tienda">Ver productos</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-4">
                {items.map((item) => {
                  const price =
                    item.product.promotional_price ?? item.product.price;
                  const imageUrl = item.product.image_url || getProductImagePath(item.product.slug);
                  return (
                    <div
                      key={item.product.id}
                      className="flex gap-4 rounded-xl border bg-card p-3"
                    >
                      <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center text-2xl text-muted-foreground">
                            <ShoppingBag className="size-8" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col gap-1">
                        <h4 className="line-clamp-2 text-sm font-medium leading-tight">
                          {item.product.name}
                        </h4>
                        <p className="text-sm font-semibold text-primary">
                          {formatPrice(price)}
                        </p>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="size-7"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1
                                )
                              }
                            >
                              <Minus className="size-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="size-7"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                            >
                              <Plus className="size-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => removeItem(item.product.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                El costo de envio se calcula en el checkout
              </p>
              <Separator />
              <Button asChild className="w-full" size="lg" onClick={() => onOpenChange(false)}>
                <Link href="/checkout">Finalizar compra</Link>
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onOpenChange(false)}
                asChild
              >
                <Link href="/tienda">Seguir comprando</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
