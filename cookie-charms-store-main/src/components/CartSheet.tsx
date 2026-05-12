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
      (i) => `• ${i.qty}x ${i.product.name} — €${(i.product.price * i.qty).toFixed(2)}`
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

*TOTAL: €${total.toFixed(2)}*`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative h-full w-full max-w-md overflow-y-auto bg-cream border-l-4 border-primary shadow-2xl">
        <div className="paper-grain p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl text-primary">Tu Cesta</h2>
            <button onClick={onClose} className="text-2xl text-ink hover:text-primary">✕</button>
          </div>
          <p className="ornament-divider text-xs uppercase tracking-widest">est. dulce</p>

          {items.length === 0 ? (
            <p className="text-center text-muted-foreground italic py-10">Tu cesta está vacía. ¡Endúlzala!</p>
          ) : (
            <div className="space-y-3">
              {items.map((i) => (
                <div key={i.product.id} className="flex gap-3 items-center border border-border rounded-md p-3 bg-card">
                  <img src={i.product.image} alt={i.product.name} className="w-14 h-14 object-cover rounded" />
                  <div className="flex-1">
                    <p className="font-display text-lg">{i.product.name}</p>
                    <p className="price-tag text-sm">€{i.product.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(i.product.id, -1)} className="w-7 h-7 border-2 border-primary text-primary">−</button>
                    <span className="w-6 text-center font-display">{i.qty}</span>
                    <button onClick={() => updateQty(i.product.id, 1)} className="w-7 h-7 border-2 border-primary text-primary">+</button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between text-2xl pt-2 border-t-2 border-dashed border-primary">
                <span className="font-display">Total</span>
                <span className="price-tag">€{total.toFixed(2)}</span>
              </div>
            </div>
          )}

          {items.length > 0 && (
            <div className="space-y-3 pt-4">
              <p className="ornament-divider text-xs uppercase tracking-widest">datos de envío</p>
              {(["nombre", "apellido", "telefono", "direccion"] as const).map((f) => (
                <div key={f}>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">
                    {f === "telefono" ? "Teléfono" : f === "direccion" ? "Dirección" : f}
                  </label>
                  <input
                    type={f === "telefono" ? "tel" : "text"}
                    value={form[f]}
                    onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                    className="w-full px-3 py-2 bg-card border-2 border-border focus:border-primary outline-none rounded"
                  />
                  {errors[f] && <p className="text-destructive text-xs mt-1">{errors[f]}</p>}
                </div>
              ))}
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Referencia (opcional)</label>
                <input
                  type="text"
                  value={form.referencia}
                  onChange={(e) => setForm({ ...form, referencia: e.target.value })}
                  className="w-full px-3 py-2 bg-card border-2 border-border focus:border-primary outline-none rounded"
                />
              </div>

              <button
                onClick={detectLocation}
                className="w-full btn-ghost-vintage text-sm"
                disabled={locating}
              >
                {locating ? "Obteniendo ubicación..." : coords ? `📍 Ubicación lista (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})` : "📍 Compartir mi ubicación"}
              </button>

              <button onClick={sendOrder} className="w-full btn-vintage">
                Enviar por WhatsApp
              </button>
              <p className="text-xs text-center text-muted-foreground italic">
                Caracas · Entrega coordinada por WhatsApp
              </p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
