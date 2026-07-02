import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string, currency: "IDR" | "USD" = "IDR"): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  if (currency === "USD") {
    return `$${num.toFixed(2)}`;
  }
  return `Rp ${Math.round(num).toLocaleString("id-ID")}`;
}

export function formatDate(date: Date | string, locale: "id" | "en" = "en"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (locale === "id") {
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
  return d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(date: Date | string, locale: "id" | "en" = "en"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString(locale === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function generateOrderNumber(): string {
  const prefix = "HB";
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${date}-${random}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: "rgba(74, 124, 89, 0.1)", text: "#4a7c59" },
  draft: { bg: "rgba(196, 163, 90, 0.1)", text: "#c4a35a" },
  archived: { bg: "rgba(156, 163, 175, 0.1)", text: "#6b7280" },
  pending: { bg: "rgba(196, 163, 90, 0.1)", text: "#c4a35a" },
  processing: { bg: "rgba(59, 130, 246, 0.1)", text: "#3b82f6" },
  shipped: { bg: "rgba(139, 92, 246, 0.1)", text: "#8b5cf6" },
  delivered: { bg: "rgba(74, 124, 89, 0.1)", text: "#4a7c59" },
  cancelled: { bg: "rgba(156, 163, 175, 0.1)", text: "#6b7280" },
  refunded: { bg: "rgba(220, 38, 38, 0.1)", text: "#dc2626" },
  paid: { bg: "rgba(74, 124, 89, 0.1)", text: "#4a7c59" },
  unpaid: { bg: "rgba(196, 163, 90, 0.1)", text: "#c4a35a" },
  failed: { bg: "rgba(220, 38, 38, 0.1)", text: "#dc2626" },
};

const PLANT_PHOTO_IDS = [
  "1614594975525-e45190c55d0b",
  "1521488357999-ff03ac2b5fd7",
  "1497215842964-222b430dc094",
  "1750341005609-48c4b98fc822",
  "1459411552884-841db9b3cc2a",
  "1777287514552-fda9d967cbb4",
  "1485955900006-10f4d324d411",
  "1416879595882-3373a0480b5b",
  "1769536205238-d7180c9936bd",
  "1771022715035-8ca5e859d0d0",
  "1773084258196-f8799453be7e",
  "1463936575829-25148e1db1b8",
  "1504384308090-c894fdcc538d",
  "1778562825462-641362a52c2e",
  "1778079840490-af5643183fcd",
  "1774053054226-ecabae8bbde6",
];

export function getProductImageUrl(seed: number, size = 400): string {
  const id = PLANT_PHOTO_IDS[seed % PLANT_PHOTO_IDS.length];
  return `https://images.unsplash.com/photo-${id}?w=${size}&h=${Math.round(size * 0.75)}&fit=crop&auto=format`;
}

/**
 * Single source of truth for product imagery. Uses the product's own
 * `image` when set, otherwise a stable deterministic placeholder keyed
 * by id — so the card, cart, checkout, and gallery always agree.
 */
export function resolveProductImage(
  image: string | null | undefined,
  seed: number,
  size = 400,
): string {
  const trimmed = image?.trim();
  return trimmed ? trimmed : getProductImageUrl(seed, size);
}

const BG_PHOTO_IDS = [
  "1774542875422-5b825fa05024",
  "1776459316613-aa5523c041de",
  "1776413378558-52b646ae144c",
  "1485955900006-10f4d324d411",
  "1777644439670-9699a9a429a2",
  "1416879595882-3373a0480b5b",
  "1521488357999-ff03ac2b5fd7",
  "1614594975525-e45190c55d0b",
  "1497215842964-222b430dc094",
  "1750341005609-48c4b98fc822",
  "1777287514552-fda9d967cbb4",
  "1769536205238-d7180c9936bd",
];

export function getBackgroundImageUrl(seed: number, size = 1920): string {
  const id = BG_PHOTO_IDS[seed % BG_PHOTO_IDS.length];
  return `https://images.unsplash.com/photo-${id}?w=${size}&h=${Math.round(size * 0.5)}&fit=crop&auto=format`;
}

export const categories: { value: string; label: string }[] = [
  { value: "succulents", label: "Succulents" },
  { value: "tropical", label: "Tropical Plants" },
  { value: "herbs", label: "Herbs" },
  { value: "ferns", label: "Ferns" },
  { value: "flowering", label: "Flowering Plants" },
  { value: "air_plants", label: "Air Plants" },
  { value: "pots", label: "Pots & Planters" },
  { value: "tools", label: "Tools & Accessories" },
];

export const orderStatusLabels: Record<string, string> = {
  pending: "Menunggu",
  processing: "Diproses",
  shipped: "Dikirim",
  delivered: "Selesai",
  cancelled: "Dibatalkan",
  refunded: "Dikembalikan",
};

export const paymentStatusLabels: Record<string, string> = {
  unpaid: "Belum Bayar",
  paid: "Lunas",
  failed: "Gagal",
  refunded: "Dikembalikan",
};
