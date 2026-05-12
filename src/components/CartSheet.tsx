import { useState } from "react";
import { z } from "zod";
import { WHATSAPP_NUMBER, type Product } from "@/lib/products";

type CartItem = { product: Product; qty: number };

const checkoutSchema = z.object({
  nombre: z.string().trim().min(1, "Requerido").max(60),
  apellido: z.string().trim().min(1, "Requerido").max(60),
  telefono: z.string().trim().min(7, "Teléfono inválido").max(20),
  direccion: z.string().trim().min(3, "Indica tu dirección").max(200),
  referencia: z.string().trim().max(200).optional(),
});

export function CartSheet({
  open, onClose, items, setItems,
}: {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  setItems: (items: CartItem[]) => void;
}) {
  const [form, setForm] = useState({ nombre: "", apellido: "", telefono: "", direccion: "", referencia: "" });
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0);

  const updateQty = (id: string, delta: number) => {
    const next = items
      .map((i) => (i.product.id === id ? { ...i, qty: i.qty + delta } : i))
      .filter((i) => i.qty > 0);
    setItems(next);
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        alert("No pudimos obtener tu ubicación. Escríbela manualmente.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const sendOrder = () => {
    const result = checkoutSchema.safeParse(form);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        errs[i.path[0] as string] = i.message;
      });
      setErrors(errs);
      return;
    }
    if (items.length === 0) return;
    setErrors({});
    const lines = items.map(
      (i) => `• ${i.qty}x ${i.product.name} — $${(i.product.price * i.qty).toFixed(2)}`
    ).join("\n");
    const mapsLink = coords
      ? `https://maps.google.com/?q=${coords.lat},${coords.lng}`
      : "No compartida";
    const msg =
`*🍪 NUEVO PEDIDO POOKIES 🍪*

*Cliente:* ${form.nombre} ${form.apellido}
*Teléfono:* ${form.telefono}
*Dirección:* ${form.direccion}
${form.referencia ? `*Referencia:* ${form.referencia}\n` : ""}*Ubicación GPS:* ${mapsLink}

*Pedido:*
${lines}

*TOTAL: $${total.toFixed(2)}*`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end p-0 sm:p-4">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-md" onClick={onClose} />
      <aside className="relative h-full w-full max-w-md overflow-y-auto bg-cream border-4 border-primary rounded-[3rem] shadow-2xl flex flex-col transition-transform duration-500 ease-out animate-in slide-in-from-right">
        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-5xl text-primary font-display tracking-tight">Tu Cesta</h2>
            <button 
              onClick={onClose} 
              className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-xl font-bold"
            >
              ✕
            </button>
          </div>
          
          <p className="label-script text-accent text-center opacity-80 underline decoration-gold decoration-4 underline-offset-8">¡Hora de merendar!</p>

          {items.length === 0 ? (
            <div className="text-center py-24 space-y-6">
              <span className="text-8xl block animate-bounce">🍪</span>
              <p className="text-muted-foreground font-medium italic text-xl">¿Todavía no has elegido nada?</p>
              <button onClick={onClose} className="btn-vintage !px-8">Ver el menú</button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                {items.map((i) => (
                  <div key={i.product.id} className="flex gap-4 items-center bg-white p-4 rounded-[2rem] border-4 border-primary/5 shadow-sm group hover:border-accent/30 transition-colors">
                    <div className="w-20 h-20 shrink-0 overflow-hidden rounded-2xl border-2 border-primary/5">
                      <img src={i.product.image} alt={i.product.name} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-display text-2xl text-primary leading-none">{i.product.name}</p>
                      <p className="price-tag text-lg text-accent mt-1">${i.product.price.toFixed(2)}</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <button 
                        onClick={() => updateQty(i.product.id, 1)} 
                        className="w-8 h-8 flex items-center justify-center bg-primary/5 text-primary rounded-full hover:bg-primary hover:text-primary-foreground transition-all"
                      >
                        +
                      </button>
                      <span className="font-display text-xl">{i.qty}</span>
                      <button 
                        onClick={() => updateQty(i.product.id, -1)} 
                        className="w-8 h-8 flex items-center justify-center bg-primary/5 text-primary rounded-full hover:bg-primary hover:text-primary-foreground transition-all"
                      >
                        −
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center p-6 bg-primary text-primary-foreground rounded-[2.5rem] shadow-xl">
                <span className="font-display text-2xl">Total</span>
                <span className="font-display text-4xl text-gold">${total.toFixed(2)}</span>
              </div>
            </div>
          )}

          {items.length > 0 && (
            <div className="space-y-6 pt-4 pb-8">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {(["nombre", "apellido"] as const).map((f) => (
                    <div key={f} className="space-y-1.5">
                      <label className="px-2 text-[0.7rem] uppercase font-bold tracking-widest text-primary/60">
                        {f}
                      </label>
                      <input
                        type="text"
                        value={form[f]}
                        onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                        className="w-full px-5 py-3.5 bg-white border-4 border-primary/5 focus:border-accent/30 outline-none rounded-full transition-all text-sm font-medium shadow-inner"
                      />
                      {errors[f] && <p className="text-destructive text-[0.7rem] px-2">{errors[f]}</p>}
                    </div>
                  ))}
                </div>

                {(["telefono", "direccion", "referencia"] as const).map((f) => (
                  <div key={f} className="space-y-1.5">
                    <label className="px-2 text-[0.7rem] uppercase font-bold tracking-widest text-primary/60">
                      {f === "telefono" ? "Teléfono" : f === "direccion" ? "Dirección" : f === "referencia" ? "Referencia" : f}
                    </label>
                    <input
                      type={f === "telefono" ? "tel" : "text"}
                      value={form[f]}
                      onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                      className="w-full px-5 py-3.5 bg-white border-4 border-primary/5 focus:border-accent/30 outline-none rounded-full transition-all text-sm font-medium shadow-inner"
                    />
                    {errors[f] && <p className="text-destructive text-[0.7rem] px-2">{errors[f]}</p>}
                  </div>
                ))}
              </div>

              <div className="pt-4 space-y-4">
                <button
                  onClick={detectLocation}
                  className="w-full py-4 bg-gold/20 text-primary rounded-full font-bold uppercase tracking-widest text-xs border-2 border-gold/40 hover:bg-gold/30 transition-all flex items-center justify-center gap-3"
                  disabled={locating}
                >
                  {locating ? "Localizando..." : coords ? "📍 Ubicación guardada" : "📍 Compartir mi ubicación"}
                </button>

                <button onClick={sendOrder} className="w-full btn-vintage text-xl py-5 rounded-full shadow-2xl">
                  Enviar Pedido 🍪
                </button>
                
                <div className="bg-gold/10 p-4 rounded-[2rem] border-2 border-gold/20 text-center">
                  <p className="text-[0.7rem] font-bold uppercase tracking-widest text-primary/70 mb-1">Horario de Despacho</p>
                  <p className="text-sm font-bold text-primary">12:00pm a 9:30pm 🍪🤎</p>
                  <p className="text-[0.6rem] opacity-50 mt-1">Coordinamos el pago y envío por WhatsApp</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
