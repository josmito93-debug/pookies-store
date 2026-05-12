import nucita from "@/assets/cookie-nucita.png";
import pooktachio from "@/assets/cookie-pooktachio.png";
import cookiesncream from "@/assets/cookie-cookiesncream.png";
import doublechoconut from "@/assets/cookie-doublechoconut.png";
import ogchocolate from "@/assets/cookie-ogchocolate.png";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  star?: boolean;
};

export const products: Product[] = [
  { id: "nucita", name: "Nucita", description: "Masa de vainilla con chips de chocolate rellena de Nucita.", price: 5.5, image: nucita, star: true },
  { id: "pooktachio", name: "Pooktachio", description: "Masa vainilla, pistacho triturado, chips blancos y de leche con relleno de crema de pistacho.", price: 5.5, image: pooktachio, star: true },
  { id: "cookies-n-cream", name: "Cookies N' Cream", description: "Masa vainilla + Oreo + chips de chocolate rellena de cookies n' cream.", price: 4.75, image: cookiesncream },
  { id: "og-chocolate", name: "OG Chocolate Chip", description: "Masa vainilla + chips de chocolate con relleno de Nutella.", price: 4.75, image: ogchocolate },
  { id: "double-choconut", name: "Double Choconut", description: "Masa de chocolate con chips de chocolate rellena de Nutella.", price: 4.5, image: doublechoconut },
  { id: "brookie", name: "Brookie", description: "Masa de vainilla con chips de chocolate + brownie + Nutella.", price: 4.5, image: doublechoconut },
  { id: "red-velvet", name: "Red Velvet", description: "Masa de red velvet con chips blancos y Oreo rellena de cookies n' cream.", price: 5.5, image: cookiesncream, star: true },
  { id: "ny-ferrero", name: "NY Ferrero", description: "Masa vainilla + chips de chocolate rellena de Ferrero + Nutella.", price: 5.5, image: ogchocolate, star: true },
];

export const WHATSAPP_NUMBER = "584227330247";
