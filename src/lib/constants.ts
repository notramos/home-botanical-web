export const SITE_NAME = "Home Botanical";
export const SITE_TAGLINE = "Premium Indoor Plants";
export const SITE_DESCRIPTION = "Curated Collection of Indoor Plants";

export const HERO_SLIDES = [
  {
    image: "/img/hero-1.jpeg",
    title: "Monstera",
    latin: "Monstera deliciosa",
    desc: "The iconic Swiss cheese plant — bring tropical elegance to any space.",
  },
  {
    image: "/img/pothos-2.jpeg",
    title: "Pothos",
    latin: "Epipremnum aureum",
    desc: "The perfect starter plant — forgiving and fast-growing.",
  },
  {
    image: "/img/pothos-3.jpeg",
    title: "Golden Pothos",
    latin: "Epipremnum pinnatum",
    desc: "A cascading beauty that thrives in almost any condition.",
  },
  {
    image: "/img/pothos-4.jpeg",
    title: "Marble Queen Pothos",
    latin: "Epipremnum aureum 'Marble Queen'",
    desc: "Variegated elegance that brightens any corner of your home.",
  },
];

export const FEATURED_PRODUCTS = [
  { name: "Monstera Adansonii", pot: "incl. Ceramic Pot", price: "$35.00", photo: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=500&q=80" },
  { name: "Fiddle Leaf Fig", pot: "incl. Woven Basket", price: "$85.00", photo: "https://images.unsplash.com/photo-1521488357999-ff03ac2b5fd7?auto=format&fit=crop&w=500&q=80" },
  { name: "Snake Plant", pot: "incl. Terracotta Pot", price: "$28.00", photo: "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=500&q=80" },
  { name: "Premium ZZ Plant", pot: "incl. Concrete Pot", price: "$42.00", photo: "https://images.unsplash.com/photo-1750341005609-48c4b98fc822?auto=format&fit=crop&w=500&q=80" },
];

export const VALUES = [
  { title: "Grown with Love", desc: "From tiny seedlings to full bloom, we nurture every plant with absolute care." },
  { title: "Eco-Conscious", desc: "Peat-free soil and sustainable pots for a happier, greener planet." },
  { title: "Safe & Fast Delivery", desc: "Securely packaged and delivered straight to your doorstep, stress-free." },
];

export const CATEGORIES = ["All Plants", "Tropical", "Air Purifier", "Flowering", "Low Light", "Shade Lovers"];

export const CATEGORY_IMAGES: Record<string, string> = {
  succulents: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=600&q=80",
  tropical: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80",
  herbs: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=600&q=80",
  flowering: "https://images.unsplash.com/photo-1769536205238-d7180c9936bd?auto=format&fit=crop&w=600&q=80",
  ferns: "https://images.unsplash.com/photo-1771022715035-8ca5e859d0d0?auto=format&fit=crop&w=600&q=80",
  air_plants: "https://images.unsplash.com/photo-1773084258196-f8799453be7e?auto=format&fit=crop&w=600&q=80",
  pots: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80",
  tools: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80",
  default: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
};

export const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80";
