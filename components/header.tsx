"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartSheet } from "@/components/cart-sheet";
import { useCartStore } from "@/lib/cart-store";

const navigation = [
  { name: "Inicio", href: "/" },
  { name: "Tienda", href: "/tienda" },
  { name: "Nosotros", href: "/#nosotros" },
  { name: "Servicios", href: "/#servicios" },
  { name: "Contacto", href: "/#contacto" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary shadow-md">
            <span className="text-lg font-bold text-primary-foreground">O</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-base font-bold text-primary">Farmacia Oasis</p>
            <p className="text-xs text-muted-foreground">Farmacia y Laboratorio</p>
          </div>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="size-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {itemCount}
              </span>
            )}
            <span className="sr-only">Carrito de compras</span>
          </Button>

          <Button asChild className="hidden sm:inline-flex" size="sm">
            <a
              href="https://wa.me/541153324146"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </nav>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="border-t bg-background lg:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Button asChild className="mt-2 sm:hidden">
              <a
                href="https://wa.me/541153324146"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      )}

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
}
