import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, Instagram, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative size-12 overflow-hidden rounded-full bg-background ring-1 ring-background/20">
                <Image
                  src="/logo-farmacia.webp"
                  alt="Farmacia Oasis"
                  fill
                  className="object-contain p-1"
                  sizes="48px"
                />
              </div>
              <div>
                <p className="font-bold">Farmacia Oasis</p>
                <p className="text-sm text-background/70">Farmacia y Laboratorio</p>
              </div>
            </div>
            <p className="text-sm text-background/80">
              Salud, cercania y atencion personalizada en un solo lugar. 
              Formulas magistrales, dermocosmetica y cuidado profesional.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 font-semibold">Navegacion</h3>
            <ul className="space-y-2 text-sm text-background/80">
              <li>
                <Link href="/" className="hover:text-primary">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/tienda" className="hover:text-primary">
                  Tienda
                </Link>
              </li>
              <li>
                <Link href="/#nosotros" className="hover:text-primary">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/#servicios" className="hover:text-primary">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/#contacto" className="hover:text-primary">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-semibold">Contacto</h3>
            <ul className="space-y-3 text-sm text-background/80">
              <li className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0" />
                <span>Av. Cabildo 4299, CABA</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" />
                <span>011 4702-9272</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="size-4 shrink-0" />
                <span>11 5332-4146</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" />
                <span>farmaciaoasis13@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-4 font-semibold">Seguinos</h3>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/farmaciaoasis_nunez"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-10 items-center justify-center rounded-full bg-background/10 transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Instagram className="size-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://wa.me/541153324146"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-10 items-center justify-center rounded-full bg-background/10 transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <MessageCircle className="size-5" />
                <span className="sr-only">WhatsApp</span>
              </a>
            </div>
            <p className="mt-4 text-sm text-background/70">
              Abierto hasta las 19:30 h
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-background/20 pt-6 text-center text-sm text-background/60">
          <p>&copy; {new Date().getFullYear()} Farmacia y Laboratorio Oasis. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
