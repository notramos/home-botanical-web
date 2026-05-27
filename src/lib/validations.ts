import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

export const productSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi"),
  slug: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Harga harus lebih dari 0"),
  originalPrice: z.coerce.number().min(0).optional().nullable(),
  stock: z.coerce.number().int().min(0),
  sku: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  status: z.enum(["active", "draft", "archived"]),
  plantType: z.enum(["indoor", "outdoor", "both"]),
  scientificName: z.string().optional().nullable(),
  lightRequirement: z.string().optional().nullable(),
  waterRequirement: z.string().optional().nullable(),
  careInstructions: z.string().optional().nullable(),
  isFeatured: z.boolean().optional(),
});

export const orderSchema = z.object({
  customerName: z.string().min(1, "Nama wajib diisi"),
  customerEmail: z.string().email("Email tidak valid"),
  customerPhone: z.string().optional().nullable(),
  shippingAddress: z.string().optional().nullable(),
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled", "refunded"]),
  paymentStatus: z.enum(["unpaid", "paid", "failed", "refunded"]),
  paymentMethod: z.string().optional().nullable(),
  paymentReference: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const checkoutSchema = z.object({
  customerName: z.string().min(1, "Nama wajib diisi"),
  customerEmail: z.string().email("Email tidak valid"),
  customerPhone: z.string().optional(),
  shippingAddress: z.string().min(1, "Alamat wajib diisi"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
