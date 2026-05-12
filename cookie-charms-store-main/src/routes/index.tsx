import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { products, type Product } from "@/lib/products";
import { CartSheet } from "@/components/CartSheet";
import logo from "@/assets/pookies-logo.png";
import heroCookie from "@/assets/cookie-nucita.png";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Pookies · Galletas Artesanales en Caracas" },
      { name: "description", content: "Galletas rellenas hechas a mano en Caracas. Pide al WhatsApp y recibe el dulce más esperado de la ciudad." },
    ],
  }),
});

type CartItem = { product: Product; qty: number };

function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  const totalQty = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);

  const addToCart = (product: Product) => {
    const existing = cart.find((i) => i.product.id === product.id);
    if (existing) {
      setCart(cart.map((i) => (i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i)));
    } else {
      setCart([...cart, { product, qty: 1 }]);
    }
    setOpen(true);
  };

  return (
    <div className="min-h-screen paper-grain">
      {/* Top bar */}
      <header className="border-b-2 border-primary bg-cream/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground hidden sm:inline">Est. Caracas</span>
          </div>
          <img src={logo} alt="Pookies" className="h-10 brightness-0" style={{ filter: "brightness(0) saturate(100%) invert(13%) sepia(60%) saturate(3500%) hue-rotate(345deg)" }} />
          <button
            onClick={() => setOpen(true)}
            className="relative flex items-center gap-2 text-sm font-display uppercase tracking-widest text-primary hover:text-accent transition"
          >
            Cesta
            <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">{totalQty}</span>
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <p className="ornament-divider text-xs uppercase tracking-[0.4em]">Desde 2021 · Caracas</p>
          <h1 className="text-6xl md:text-7xl leading-[0.95] text-primary">
            Galletas <span className="label-script text-accent">rellenas</span>,<br />
            horneadas con cariño.
          </h1>
          <p className="text-xl italic text-muted-foreground max-w-md">
            Una colección dulce, vintage y desbordante de relleno. Cada Pookie se hornea por encargo y llega tibia a tu puerta.
          </p>
          <div className="flex gap-4 flex-wrap">
            <a href="#menu" className="btn-vintage">Ver el Menú</a>
            <a href="#historia" className="btn-ghost-vintage">Nuestra Historia</a>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl" />
          <img src={heroCookie} alt="Galleta Pookies" className="relative w-full max-w-md mx-auto drop-shadow-2xl" />
          <div className="absolute -top-4 -right-4 bg-gold text-ink px-4 py-2 rotate-12 border-2 border-ink shadow-lg font-display text-sm uppercase tracking-widest">
            Recién Horneada
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="bg-primary text-primary-foreground py-3 border-y-2 border-ink overflow-hidden">
        <div className="flex gap-12 whitespace-nowrap font-display text-2xl uppercase tracking-widest animate-[marquee_30s_linear_infinite]">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="flex items-center gap-12">
              Pookies · ✦ · Cookies de Autor · ✦ · Hechas en Caracas · ✦ · Entrega por WhatsApp · ✦
            </span>
          ))}
        </div>
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>

      {/* Menu */}
      <section id="menu" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center space-y-3 mb-14">
          <p className="ornament-divider text-xs uppercase tracking-[0.4em]">Carta de la Casa</p>
          <h2 className="text-5xl md:text-6xl text-primary">El Menú</h2>
          <p className="label-script text-2xl text-accent">— una para cada antojo —</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p) => (
            <article key={p.id} className="group bg-card border-2 border-primary p-5 vintage-frame relative flex flex-col">
              {p.star && (
                <span className="absolute -top-3 -right-3 bg-gold text-ink rotate-12 px-3 py-1 border-2 border-ink font-display text-xs uppercase tracking-widest shadow">
                  ★ Favorita
                </span>
              )}
              <div className="aspect-square overflow-hidden bg-accent/10 mb-4 rounded">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="text-3xl text-primary">{p.name}</h3>
              <p className="text-sm italic text-muted-foreground mt-1 flex-1">{p.description}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t-2 border-dashed border-primary/40">
                <span className="price-tag text-3xl">€{p.price.toFixed(2)}</span>
                <button onClick={() => addToCart(p)} className="btn-vintage text-xs px-4 py-2">Añadir</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Historia */}
      <section id="historia" className="bg-primary text-primary-foreground py-20 border-y-4 border-ink">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-5">
          <p className="ornament-divider text-xs uppercase tracking-[0.4em] text-gold">Capítulo I</p>
          <h2 className="text-5xl md:text-6xl">Nuestra Historia</h2>
          <p className="label-script text-2xl text-accent">— horneando momentos desde una cocina caraqueña —</p>
          <p className="text-lg italic leading-relaxed">
            Pookies nació de una receta de familia y un horno chiquito. Hoy seguimos amasando una a una, midiendo el chocolate como si fuera oro, y empacando cada galleta como un pequeño regalo.
            Si la pides, la horneamos. Si llega tibia, lo hicimos bien.
          </p>
        </div>
      </section>

      {/* Pedido */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center space-y-5">
        <p className="ornament-divider text-xs uppercase tracking-[0.4em]">Cómo Pedir</p>
        <h2 className="text-5xl text-primary">Tres pasos dulces</h2>
        <div className="grid sm:grid-cols-3 gap-6 pt-6">
          {[
            { n: "I", t: "Elige", d: "Arma tu cesta con tus favoritas." },
            { n: "II", t: "Cuéntanos", d: "Tus datos y tu ubicación en Caracas." },
            { n: "III", t: "Recibe", d: "Coordinamos por WhatsApp y llegamos." },
          ].map((s) => (
            <div key={s.n} className="border-2 border-primary p-6 bg-card">
              <p className="font-display text-5xl text-accent">{s.n}</p>
              <p className="font-display text-2xl text-primary mt-2">{s.t}</p>
              <p className="text-sm italic text-muted-foreground mt-1">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-primary bg-cream py-10">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-2">
          <img src={logo} alt="Pookies" className="h-10 mx-auto" style={{ filter: "brightness(0) saturate(100%) invert(13%) sepia(60%) saturate(3500%) hue-rotate(345deg)" }} />
          <p className="label-script text-xl text-accent">— hechas con cariño en Caracas —</p>
          <p className="text-sm text-muted-foreground">WhatsApp: +58 422-7330247</p>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">© {new Date().getFullYear()} Pookies · Todos los derechos reservados</p>
        </div>
      </footer>

      <CartSheet open={open} onClose={() => setOpen(false)} items={cart} setItems={setCart} />

      {/* Floating cart button */}
      {totalQty > 0 && !open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-30 btn-vintage flex items-center gap-3 shadow-2xl"
        >
          🛒 {totalQty} · €{cart.reduce((s, i) => s + i.product.price * i.qty, 0).toFixed(2)}
        </button>
      )}
    </div>
  );
}
