import Link from "next/link";
import { 
  FlaskConical, 
  Pill, 
  Leaf, 
  Building2, 
  MapPin, 
  Smartphone,
  Star,
  ArrowRight,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    icon: FlaskConical,
    title: "Formulas magistrales",
    description: "Elaboracion de preparados personalizados, cremas, geles, soluciones, capsulas y otras formulaciones.",
  },
  {
    icon: Pill,
    title: "Atencion farmaceutica",
    description: "Orientacion profesional, atencion responsable y acompanamiento en cada consulta.",
  },
  {
    icon: Leaf,
    title: "Dermocosmetica",
    description: "Productos de cuidado facial, corporal y capilar con enfoque farmaceutico y estetico.",
  },
  {
    icon: Building2,
    title: "Obras sociales",
    description: "Trabajamos con diferentes coberturas para brindar mayor accesibilidad a nuestros clientes.",
  },
  {
    icon: MapPin,
    title: "Atencion en el barrio",
    description: "Cercania, rapidez y confianza para acompanarte en tus necesidades diarias de salud.",
  },
  {
    icon: Smartphone,
    title: "Contacto directo",
    description: "Comunicacion simple por telefono, WhatsApp e Instagram para una atencion mas agil.",
  },
];

const testimonials = [
  {
    name: "foodiedealma",
    text: "Buena atencion, hacen preparados.",
    rating: 5,
  },
  {
    name: "Graciela Marco",
    text: "Excelente atencion y muy buenos precios",
    rating: 5,
  },
  {
    name: "YAGY producciones",
    text: "Trabajan con diferentes obras sociales como OSDE por ej.",
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-foreground via-foreground/95 to-secondary/80 text-background">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-24 lg:px-8 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-background/20 bg-background/10 px-4 py-2 text-sm backdrop-blur-sm">
                <span>Atencion profesional</span>
                <span className="text-background/60">·</span>
                <span>Laboratorio propio</span>
                <span className="text-background/60">·</span>
                <span>Formulas magistrales</span>
              </div>
              
              <h1 className="text-balance text-4xl font-bold leading-tight lg:text-6xl">
                Salud, cercania y{" "}
                <span className="text-primary">atencion personalizada</span> en un solo lugar
              </h1>
              
              <p className="max-w-xl text-lg text-background/80">
                En Farmacia y Laboratorio Oasis combinamos experiencia farmaceutica, 
                preparados magistrales y una atencion calida para acompanar a cada 
                paciente con confianza y profesionalismo.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="gap-2">
                  <a
                    href="https://wa.me/541153324146"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="size-5" />
                    Consultar por WhatsApp
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-background/30 bg-background/10 text-background hover:bg-background/20">
                  <Link href="/tienda">
                    Ver tienda
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="rounded-2xl border border-background/15 bg-background/10 px-5 py-4 backdrop-blur-sm">
                  <p className="text-2xl font-bold">4,9</p>
                  <p className="text-sm text-background/70">Calificacion Google</p>
                </div>
                <div className="rounded-2xl border border-background/15 bg-background/10 px-5 py-4 backdrop-blur-sm">
                  <p className="text-2xl font-bold">+99</p>
                  <p className="text-sm text-background/70">Opiniones</p>
                </div>
                <div className="rounded-2xl border border-background/15 bg-background/10 px-5 py-4 backdrop-blur-sm">
                  <p className="text-2xl font-bold">Cabildo 4299</p>
                  <p className="text-sm text-background/70">CABA</p>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <Card className="border-0 bg-card/95 shadow-2xl backdrop-blur">
                <CardContent className="p-8">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
                    Por que elegirnos
                  </p>
                  <h3 className="mb-6 text-2xl font-bold text-foreground">
                    Tu farmacia de confianza en Buenos Aires
                  </h3>
                  <ul className="space-y-4">
                    {[
                      "Formulas magistrales personalizadas",
                      "Atencion calida y profesional",
                      "Muy buenas opiniones de clientes",
                      "Dermocosmetica y cuidado personal",
                      "Contacto rapido por WhatsApp",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 border-b border-border pb-3 text-muted-foreground last:border-0"
                      >
                        <span className="text-primary">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Av.+Cabildo+4299,+Buenos+Aires"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 font-semibold text-primary hover:underline"
                  >
                    Ver ubicacion
                    <ArrowRight className="size-4" />
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="relative -mt-8 z-10 mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-4 rounded-3xl bg-card p-6 shadow-xl md:grid-cols-3">
          {[
            { icon: Pill, title: "Atencion farmaceutica", desc: "Asesoramiento claro y responsable para cada paciente." },
            { icon: FlaskConical, title: "Laboratorio propio", desc: "Preparados personalizados segun indicacion profesional." },
            { icon: Leaf, title: "Dermocosmetica", desc: "Cuidado facial, corporal y capilar con perfil profesional." },
          ].map((feature) => (
            <div key={feature.title} className="flex items-start gap-4 p-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-accent">
                <feature.icon className="size-7 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="nosotros" className="py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">
                Nosotros
              </p>
              <h2 className="mb-6 text-3xl font-bold text-foreground lg:text-4xl">
                Una farmacia moderna con trato humano
              </h2>
              <p className="mb-4 text-muted-foreground">
                En Farmacia Oasis trabajamos para brindar soluciones confiables, 
                atencion personalizada y una experiencia cercana. Combinamos la 
                farmacia tradicional con laboratorio propio y productos orientados al 
                bienestar integral.
              </p>
              <p className="text-muted-foreground">
                Nuestra propuesta une salud, confianza, calidad y asesoramiento para 
                que cada persona encuentre lo que necesita en un entorno profesional 
                y agradable.
              </p>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { title: "Atencion personalizada", desc: "Escuchamos, orientamos y acompanamos cada consulta." },
                { title: "Formulas magistrales", desc: "Preparados adaptados a necesidades especificas." },
                { title: "Excelente ubicacion", desc: "Estamos en Av. Cabildo 4299, CABA." },
                { title: "Confianza real", desc: "Clientes que valoran nuestra atencion y compromiso." },
              ].map((card) => (
                <Card key={card.title} className="bg-accent/50">
                  <CardContent className="p-6">
                    <h3 className="mb-2 font-semibold text-primary">{card.title}</h3>
                    <p className="text-sm text-muted-foreground">{card.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="bg-accent/30 py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">
              Servicios
            </p>
            <h2 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl">
              Que ofrecemos
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Una propuesta integral que combina atencion farmaceutica, 
              preparados personalizados y cuidado diario.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card key={service.title} className="transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent/50">
                    <service.icon className="size-7 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-br from-primary to-secondary py-16 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "4,9 / 5", label: "Calificacion general" },
              { value: "+99", label: "Opiniones de clientes" },
              { value: "Abierto", label: "Hasta las 19:30 h" },
              { value: "CABA", label: "Ciudad Autonoma de Buenos Aires" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-primary-foreground/10 p-6 text-center backdrop-blur-sm"
              >
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-primary-foreground/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="opiniones" className="py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">
              Opiniones
            </p>
            <h2 className="text-3xl font-bold text-foreground lg:text-4xl">
              Lo que dicen nuestros clientes
            </h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name}>
                <CardContent className="p-6">
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="size-5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="mb-4 text-foreground">&ldquo;{testimonial.text}&rdquo;</p>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {testimonial.name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="bg-accent/30 py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">
                Contacto
              </p>
              <h2 className="mb-6 text-3xl font-bold text-foreground lg:text-4xl">
                Estamos para ayudarte
              </h2>
              <p className="mb-8 text-muted-foreground">
                Contactanos para consultas, pedidos, formulas magistrales o 
                informacion general sobre nuestros productos y servicios.
              </p>
              
              <div className="mb-8 space-y-4 text-foreground">
                <p><strong>Direccion:</strong> Av. Cabildo 4299, C1429ABA, CABA</p>
                <p><strong>Telefono:</strong> 011 4702-9272</p>
                <p><strong>WhatsApp:</strong> 11 5332-4146</p>
                <p><strong>Email:</strong> farmaciaoasis13@gmail.com</p>
                <p><strong>Instagram:</strong> @farmaciaoasis_nunez</p>
                <p><strong>Horario:</strong> Abierto - Cierra a las 19:30 h</p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg">
                  <a
                    href="https://wa.me/541153324146"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Escribir por WhatsApp
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Av.+Cabildo+4299,+Buenos+Aires"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Como llegar
                  </a>
                </Button>
              </div>
            </div>
            
            <Card>
              <CardContent className="p-8">
                <h3 className="mb-6 text-xl font-bold text-foreground">
                  Envianos tu consulta
                </h3>
                <form
                  action="https://wa.me/541153324146"
                  target="_blank"
                  className="space-y-4"
                >
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Tu telefono"
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                  <textarea
                    rows={4}
                    placeholder="Escribe tu consulta"
                    className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                  <Button type="submit" className="w-full" size="lg">
                    Enviar por WhatsApp
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* WhatsApp Float Button */}
      <a
        href="https://wa.me/541153324146"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex size-16 items-center justify-center rounded-full bg-[#25d366] shadow-lg transition-transform hover:scale-110"
        aria-label="Abrir WhatsApp"
      >
        <MessageCircle className="size-8 text-white" />
      </a>
    </>
  );
}
