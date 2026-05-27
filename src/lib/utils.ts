import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string, currency: "IDR" | "USD" = "USD"): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  if (currency === "IDR") {
    return `Rp ${num.toLocaleString("id-ID")}`;
  }
  return `$${num.toFixed(2)}`;
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
