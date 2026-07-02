"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { checkoutSchema } from "@/lib/validations";
import { generateOrderNumber } from "@/lib/utils";
import {
  sendOrderConfirmation,
  sendAdminNotification,
} from "@/lib/email";
import { sendAdminNotification as sendWAAdminNotification } from "@/lib/whatsapp";
import { z } from "zod";

function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

// Public checkout: the client may only choose which product and how many.
// Everything that affects money or fulfillment (price, name, sku, status)
// is resolved server-side from the database and can never be spoofed.
const publicOrderSchema = checkoutSchema.extend({
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive().max(999),
      })
    )
    .min(1, "Keranjang kosong"),
});

export type PublicOrderInput = z.infer<typeof publicOrderSchema>;

export async function createPublicOrder(input: PublicOrderInput) {
  const data = publicOrderSchema.parse(input);

  const order = await prisma.$transaction(async (tx) => {
    const products = await tx.product.findMany({
      where: {
        id: { in: data.items.map((i) => i.productId) },
        status: "active",
        deletedAt: null,
      },
    });
    const byId = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const orderItems = data.items.map((item) => {
      const product = byId.get(item.productId);
      if (!product) {
        throw new Error("Salah satu produk sudah tidak tersedia.");
      }
      if (product.stock < item.quantity) {
        throw new Error(
          `Stok ${product.name} tidak mencukupi (tersisa ${product.stock}).`
        );
      }
      const price = Number(product.price); // ← authoritative price from DB
      const lineSubtotal = price * item.quantity;
      subtotal += lineSubtotal;
      return {
        productId: product.id,
        productName: product.name,
        productSku: product.sku ?? null,
        quantity: item.quantity,
        price,
        subtotal: lineSubtotal,
      };
    });

    const created = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone || null,
        shippingAddress: data.shippingAddress,
        subtotal,
        shippingCost: 0,
        tax: 0,
        total: subtotal,
        status: "pending",
        paymentStatus: "unpaid",
        items: { create: orderItems },
      },
      include: { items: true },
    });

    for (const item of data.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return created;
  });

  await prisma.transactionLog.create({
    data: {
      type: "order",
      action: "create",
      referenceId: order.id,
      referenceNumber: order.orderNumber,
      description: `Pesanan pelanggan (checkout): ${order.orderNumber}`,
      newValues: {
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        total: Number(order.total),
      } as any,
      performedBy: "Customer",
    },
  });

  const orderData = {
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    shippingAddress: order.shippingAddress,
    total: Number(order.total),
    status: order.status,
    items: order.items.map((i) => ({
      productName: i.productName,
      quantity: i.quantity,
      price: Number(i.price),
      subtotal: Number(i.subtotal),
    })),
  };

  // Notifications must never block or fail the checkout.
  await Promise.allSettled([
    sendOrderConfirmation(orderData),
    sendAdminNotification(orderData),
    sendWAAdminNotification(orderData),
  ]);

  revalidatePath("/admin/orders");
  return serialize(order);
}
