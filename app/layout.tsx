import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/components/cart-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Farmacia y Laboratorio Oasis | Buenos Aires",
  description:
    "Farmacia y Laboratorio Oasis en Buenos Aires. Formulas magistrales, atencion farmaceutica, dermocosmetica y contacto directo. Tienda online con envios a todo el pais.",
  keywords: [
    "farmacia",
    "laboratorio",
    "formulas magistrales",
    "dermocosmetica",
    "Buenos Aires",
    "Cabildo",
    "cuidado facial",
  ],
};

export const viewport: Viewport = {
  themeColor: "#0e7a73",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${montserrat.variable} bg-background`}>
      <body className="min-h-screen flex flex-col antialiased">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
