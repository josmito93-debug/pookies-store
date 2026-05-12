import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect, useRef } from "react";
import { products, type Product } from "@/lib/products";
import { CartSheet } from "@/components/CartSheet";
import logo from "@/assets/pookies-logo.png";
import heroCookie from "@/assets/fotohero.png";

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

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

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

  const menuReveal = useReveal();
  const storyReveal = useReveal();
  const stepsReveal = useReveal();

  return (
    <div className="min-h-screen overflow-x-hidden relative">
      {/* ── Background Aesthetic Blobs ── */}
      <div className="aesthetic-blob w-[400px] h-[400px] bg-rose/20 top-[-100px] left-[-100px]" />
      <div className="aesthetic-blob w-[300px] h-[300px] bg-gold/30 bottom-[10%] right-[-50px] animation-delay-2000" />
      <div className="aesthetic-blob w-[500px] h-[500px] bg-primary/5 top-[40%] left-[20%]" />

      {/* ═══════════════  HEADER  ═══════════════ */}
      <header className="sticky top-4 z-40 mx-auto max-w-5xl px-4 pointer-events-none">
        <div className="bg-cream/70 backdrop-blur-xl border-4 border-primary rounded-full px-6 py-3 flex items-center justify-between shadow-xl pointer-events-auto">
          <div className="flex items-center gap-3">
            <span className="bg-accent w-3 h-3 rounded-full animate-pulse" />
            <div className="flex flex-col -space-y-1">
              <span className="text-[0.6rem] font-black uppercase tracking-tighter text-primary/60">Caracas · Delivery</span>
              <span className="text-[0.7rem] font-bold text-primary">12:00pm a 9:30pm 🍪</span>
            </div>
          </div>
          
          <img src={logo} alt="Pookies" className="h-9 brightness-0 hover:scale-110 transition-transform cursor-pointer"
            style={{ filter: "brightness(0) saturate(100%) invert(13%) sepia(60%) saturate(3500%) hue-rotate(345deg)" }} />
          
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-3 bg-primary text-primary-foreground px-5 py-2 rounded-full hover:bg-accent transition-colors group shadow-lg"
          >
            <span className="font-display text-sm uppercase tracking-wider">Cesta</span>
            <span className="bg-cream text-primary rounded-full w-6 h-6 flex items-center justify-center text-[0.7rem] font-bold group-hover:scale-110 transition-transform">{totalQty}</span>
          </button>
        </div>
      </header>

      {/* ═══════════════  HERO  ═══════════════ */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-24 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-gold/20 text-primary px-4 py-1.5 rounded-full border-2 border-gold/40">
            <span className="text-xs font-bold uppercase tracking-wider">Est. 2021 · Caracas</span>
          </div>
          
          <h1 className="text-6xl sm:text-7xl md:text-8xl text-primary leading-[0.85]">
            Galletas<br />
            <span className="label-script text-accent inline-block -rotate-2 squiggle-underline">rellenitas</span><br />
            y <span className="text-gold">flofflys</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-md mx-auto lg:mx-0 leading-relaxed font-medium">
            ¡Tan suaves que parecen nubes! Horneamos momentos dulces y los llevamos directito a tu casa en Caracas.
          </p>
          
          <div className="flex gap-4 justify-center lg:justify-start pt-4">
            <a href="#menu" className="btn-vintage text-lg">Pedir ahora</a>
            <a href="#historia" className="btn-ghost-vintage text-lg">Nuestra historia</a>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-accent/20 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000" />
          <img src={heroCookie} alt="Galleta Pookies"
            className="relative w-full max-w-md mx-auto animate-float drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]" />
          
          {/* Sticker-style Badge */}
          <div className="absolute top-0 right-0 bg-gold text-ink p-6 rounded-full border-4 border-ink shadow-2xl rotate-12 font-display text-lg uppercase tracking-tight flex flex-col items-center justify-center animate-bounce">
            <span>Recién</span>
            <span className="text-xs">Horneada</span>
          </div>

          <div className="absolute -bottom-8 -left-8 bg-accent text-white p-5 rounded-full border-4 border-white shadow-2xl -rotate-12 font-display text-sm uppercase tracking-tight flex flex-col items-center justify-center hover:rotate-0 transition-transform cursor-help">
            <span className="text-xs opacity-80">Horario</span>
            <span className="font-bold whitespace-nowrap">12pm - 9:30pm</span>
            <span className="text-lg">🍪🤎</span>
          </div>
        </div>
      </section>

      {/* ═══════════════  MARQUEE  ═══════════════ */}
      <div className="bg-primary text-primary-foreground py-5 border-y-4 border-ink overflow-hidden rotate-1">
        <div className="flex gap-16 whitespace-nowrap font-display text-2xl uppercase tracking-wider animate-[marquee_40s_linear_infinite]">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="flex items-center gap-16">
              Pookies · 🍪 · Suaves · ✨ · Rellenas · 💖 · Caracas · 🛵
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════  MENU  ═══════════════ */}
      <section id="menu" className="max-w-6xl mx-auto px-6 py-32" ref={menuReveal.ref}>
        <div className={`text-center space-y-4 mb-20 transition-all duration-1000 ${menuReveal.visible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}>
          <h2 className="text-6xl md:text-7xl text-primary">El Menú Dulce</h2>
          <p className="label-script text-3xl text-accent">¡Elige tu favorita!</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {products.map((p, idx) => (
            <article key={p.id}
              className={`group vintage-frame p-8 flex flex-col transition-all duration-700 ${menuReveal.visible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              {p.star && (
                <div className="absolute -top-5 -right-5 w-20 h-20 bg-gold border-4 border-primary rounded-full flex items-center justify-center rotate-12 shadow-xl z-10 group-hover:scale-125 transition-transform">
                  <span className="text-2xl">⭐</span>
                </div>
              )}
              
              <div className="aspect-square overflow-hidden rounded-[2rem] border-4 border-primary/10 mb-6 bg-white shadow-inner">
                <img src={p.image} alt={p.name}
                  className="w-full h-full object-cover group-hover:rotate-6 group-hover:scale-110 transition-transform duration-500" />
              </div>
              
              <h3 className="text-4xl text-primary mb-2 group-hover:text-accent transition-colors">{p.name}</h3>
              <p className="text-muted-foreground font-medium text-sm leading-relaxed flex-1">{p.description}</p>
              
              <div className="flex items-center justify-between mt-8 pt-6 border-t-4 border-dotted border-primary/20">
                <span className="font-display text-4xl text-primary">${p.price.toFixed(2)}</span>
                <button onClick={() => addToCart(p)}
                  className="btn-vintage !px-6 !py-2.5 text-sm">
                  Añadir
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ═══════════════  QUICK LINKS  ═══════════════ */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <div className="bg-cream/40 backdrop-blur-md border-4 border-primary/10 rounded-[3rem] p-10 text-center space-y-8 shadow-inner">
          <h3 className="text-4xl text-primary">Enlaces Rápidos ✨</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#menu" className="group bg-white border-4 border-primary/5 px-8 py-4 rounded-full hover:bg-primary hover:text-white transition-all duration-300 shadow-sm flex items-center gap-3">
              <span className="text-2xl group-hover:rotate-12 transition-transform">🍪</span>
              <span className="font-display uppercase tracking-wider text-sm">Ver Menú</span>
            </a>
            <a href="https://instagram.com" target="_blank" className="group bg-white border-4 border-primary/5 px-8 py-4 rounded-full hover:bg-accent hover:text-white transition-all duration-300 shadow-sm flex items-center gap-3">
              <span className="text-2xl group-hover:scale-125 transition-transform">📸</span>
              <span className="font-display uppercase tracking-wider text-sm">Instagram</span>
            </a>
            <a href="https://wa.me/584227330247" target="_blank" className="group bg-white border-4 border-primary/5 px-8 py-4 rounded-full hover:bg-green-500 hover:text-white transition-all duration-300 shadow-sm flex items-center gap-3">
              <span className="text-2xl group-hover:animate-bounce transition-transform">💬</span>
              <span className="font-display uppercase tracking-wider text-sm">WhatsApp</span>
            </a>
            <a href="#historia" className="group bg-white border-4 border-primary/5 px-8 py-4 rounded-full hover:bg-gold hover:text-ink transition-all duration-300 shadow-sm flex items-center gap-3">
              <span className="text-2xl group-hover:-rotate-12 transition-transform">📖</span>
              <span className="font-display uppercase tracking-wider text-sm">Nuestra Historia</span>
            </a>
          </div>
          <p className="text-xs font-bold text-primary/40 uppercase tracking-[0.2em]">¡Conectemos en todos lados!</p>
        </div>
      </section>

      {/* ═══════════════  STORY  ═══════════════ */}
      <section id="historia" className="max-w-5xl mx-auto px-6 py-32" ref={storyReveal.ref}>
        <div className={`bg-accent text-accent-foreground rounded-[4rem] p-12 md:p-20 text-center space-y-8 shadow-2xl relative overflow-hidden transition-all duration-1000 ${storyReveal.visible ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}>
          <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-[-50px] left-[-50px] w-60 h-60 bg-gold/20 rounded-full blur-3xl" />
          
          <h2 className="text-5xl md:text-7xl">Nuestra Historia</h2>
          <p className="label-script text-3xl text-gold">¡Horneadas con amor!</p>
          <p className="text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto font-medium opacity-90">
            Todo empezó en una cocina pequeña y con muchas ganas de crear la galleta perfecta. Hoy, cada Pookie se amasa a mano con los mejores ingredientes, pensando siempre en ese primer bocado que te hace sonreír.
          </p>
          <div className="pt-6">
            <span className="text-4xl">🍪 🥛 ✨</span>
          </div>
        </div>
      </section>

      {/* ═══════════════  FOOTER  ═══════════════ */}
      <footer className="bg-primary text-primary-foreground pt-32 pb-16 rounded-t-[5rem] mt-20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10 text-center md:text-left">
          <div className="space-y-6">
            <img src={logo} alt="Pookies" className="h-16 mx-auto md:mx-0 invert brightness-0" />
            <p className="text-xl font-medium opacity-80">Las galletas más flofflys de Caracas.</p>
            <div className="flex justify-center md:justify-start gap-4">
               <a href="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-ink transition-all">📸</a>
               <a href="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-ink transition-all">📱</a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-3xl font-display text-gold">Contáctanos</h4>
            <p className="text-lg">WhatsApp: +58 422 7330247</p>
            <div className="bg-white/5 p-4 rounded-[2rem] border-2 border-white/10 inline-block">
              <p className="text-sm font-bold text-gold uppercase tracking-widest mb-1">Horario de Atención</p>
              <p className="text-xl font-medium">12:00pm a 9:30pm 🍪🤎</p>
              <p className="text-xs opacity-50 mt-1">Caracas, Venezuela · Entregas de Lunes a Sábado</p>
            </div>
          </div>
        </div>
        
        <div className="text-center pt-20 pb-4 opacity-30 text-xs tracking-widest uppercase">
          © {new Date().getFullYear()} Pookies · Made with love
        </div>
      </footer>

      <CartSheet open={open} onClose={() => setOpen(false)} items={cart} setItems={setCart} />

      {/* Floating cart button */}
      {totalQty > 0 && !open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-8 right-8 z-30 btn-vintage flex items-center gap-4 shadow-2xl animate-bounce"
        >
          <span className="text-2xl">🛒</span>
          <span className="font-display">${cart.reduce((s, i) => s + i.product.price * i.qty, 0).toFixed(2)}</span>
        </button>
      )}
    </div>
  );
}
