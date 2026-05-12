import { createFileRoute, Link } from "@tanstack/react-router";
import logo from "@/assets/pookies-logo.png";

export const Route = createFileRoute("/links")({
  component: LinksPage,
});

function LinksPage() {
  const links = [
    { title: "🍪 Ver Menú & Pedir", url: "/", icon: "🛍️" },
    { title: "📱 WhatsApp Directo", url: "https://wa.me/584227330247", icon: "💬" },
    { title: "📸 Instagram", url: "https://instagram.com", icon: "📸" },
    { title: "✨ TikTok", url: "https://tiktok.com", icon: "🎵" },
    { title: "📍 Ubicación Caracas", url: "https://maps.google.com", icon: "📍" },
  ];

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center px-6 py-16 relative overflow-hidden">
      {/* Aesthetic Background */}
      <div className="aesthetic-blob w-[300px] h-[300px] bg-rose/20 -top-20 -left-20" />
      <div className="aesthetic-blob w-[250px] h-[250px] bg-gold/20 -bottom-10 -right-10 animation-delay-2000" />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center space-y-10">
        {/* Profile Section */}
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl scale-150" />
            <img 
              src={logo} 
              alt="Pookies" 
              className="h-24 relative hover:scale-110 transition-transform duration-500" 
              style={{ filter: "brightness(0) saturate(100%) invert(13%) sepia(60%) saturate(3500%) hue-rotate(345deg)" }}
            />
          </div>
          <h1 className="text-4xl text-primary leading-none">Pookies</h1>
          <p className="label-script text-2xl text-accent">Galletas flofflys en Caracas 🍪</p>
        </div>

        {/* Links List */}
        <div className="w-full space-y-4">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target={link.url.startsWith("http") ? "_blank" : "_self"}
              className="group flex items-center justify-between bg-white border-4 border-primary/5 p-5 rounded-[2rem] hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-95"
            >
              <span className="text-2xl group-hover:rotate-12 transition-transform">{link.icon}</span>
              <span className="font-display text-lg uppercase tracking-wider">{link.title}</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">✨</span>
            </a>
          ))}
        </div>

        {/* Hours Card */}
        <div className="w-full bg-gold/20 border-4 border-gold/40 rounded-[2.5rem] p-6 text-center space-y-2">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-primary/60">Horario de Hoy</p>
          <p className="text-2xl font-bold text-primary">12:00pm a 9:30pm 🍪🤎</p>
          <p className="text-[0.6rem] font-medium opacity-50 uppercase tracking-widest">Entregas de Lunes a Sábado</p>
        </div>

        {/* Footer */}
        <footer className="pt-8 opacity-30 text-[0.6rem] font-bold uppercase tracking-[0.3em] text-center">
          © {new Date().getFullYear()} Pookies Caracas
        </footer>
      </div>
    </div>
  );
}
