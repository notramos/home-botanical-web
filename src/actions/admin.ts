"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { productSchema, orderSchema } from "@/lib/validations";
import { slugify, generateOrderNumber } from "@/lib/utils";
import { sendOrderConfirmation, sendAdminNotification, sendOrderStatusUpdate } from "@/lib/email";
import { sendOrderConfirmation as sendWAOrderConfirmation, sendAdminNotification as sendWAAdminNotification, sendOrderStatusUpdate as sendWAOrderStatusUpdate } from "@/lib/whatsapp";
import { z } from "zod";

function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

type StockItem = { productId?: number | null; quantity: number };

async function decrementStock(items: StockItem[]) {
  for (const item of items) {
    if (item.productId) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }
  }
}

async function incrementStock(items: StockItem[]) {
  for (const item of items) {
    if (item.productId) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }
  }
}

export async function createProduct(data: z.infer<typeof productSchema>) {
  const validated = productSchema.parse(data);
  const slug = validated.slug || slugify(validated.name);

  const product = await prisma.product.create({
    data: {
      ...validated,
      slug,
      originalPrice: validated.originalPrice || null,
      isFeatured: validated.isFeatured || false,
    },
  });

  await prisma.transactionLog.create({
    data: {
      type: "product",
      action: "create",
      referenceId: product.id,
      referenceNumber: product.name,
      description: `Menambah produk baru: ${product.name}`,
      newValues: validated as any,
      performedBy: "Admin",
    },
  });

  revalidatePath("/admin/products");
  return serialize(product);
}

export async function updateProduct(id: number, data: z.infer<typeof productSchema>) {
  const validated = productSchema.parse(data);
  const oldProduct = await prisma.product.findUnique({ where: { id } });
  if (!oldProduct) throw new Error("Produk tidak ditemukan");

  const slug = validated.slug || slugify(validated.name);

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...validated,
      slug,
      originalPrice: validated.originalPrice || null,
      isFeatured: validated.isFeatured || false,
    },
  });

  await prisma.transactionLog.create({
    data: {
      type: "product",
      action: "update",
      referenceId: product.id,
      referenceNumber: product.name,
      description: `Memperbarui produk: ${product.name}`,
      oldValues: oldProduct as any,
      newValues: validated as any,
      performedBy: "Admin",
    },
  });

  revalidatePath("/admin/products");
  return serialize(product);
}

export async function deleteProduct(id: number) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new Error("Produk tidak ditemukan");

  await prisma.transactionLog.create({
    data: {
      type: "product",
      action: "delete",
      referenceId: product.id,
      referenceNumber: product.name,
      description: `Menghapus produk: ${product.name}`,
      oldValues: product as any,
      performedBy: "Admin",
    },
  });

  await prisma.product.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/admin/products");
}

export async function toggleFeatured(id: number) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new Error("Produk tidak ditemukan");

  const newFeatured = !product.isFeatured;

  await prisma.product.update({
    where: { id },
    data: { isFeatured: newFeatured },
  });

  await prisma.transactionLog.create({
    data: {
      type: "product",
      action: "toggle_featured",
      referenceId: product.id,
      referenceNumber: product.name,
      description: newFeatured
        ? `Produk ditampilkan di fitur: ${product.name}`
        : `Produk dihapus dari fitur: ${product.name}`,
      oldValues: { isFeatured: product.isFeatured } as any,
      newValues: { isFeatured: newFeatured } as any,
      performedBy: "Admin",
    },
  });

  revalidatePath("/admin/products");
  return serialize({ isFeatured: newFeatured });
}

export async function createOrder(data: z.infer<typeof orderSchema> & { items: { productId?: number; productName: string; productSku?: string; quantity: number; price: number }[] }) {
  const validated = orderSchema.parse(data);
  const items = data.items;

  if (items.length === 0) throw new Error("Minimal harus ada 1 item");

  const order = await prisma.$transaction(async (tx) => {
    for (const item of items) {
      if (item.productId) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new Error(`Produk ${item.productName} tidak ditemukan`);
        if (product.stock < item.quantity) throw new Error(`Stok ${item.productName} tidak mencukupi (tersisa ${product.stock})`);
      }
    }

    const orderNumber = generateOrderNumber();
    let subtotal = 0;

    const orderItems = items.map((item) => {
      const itemSubtotal = item.quantity * item.price;
      subtotal += itemSubtotal;
      return {
        productId: item.productId || null,
        productName: item.productName,
        productSku: item.productSku || null,
        quantity: item.quantity,
        price: item.price,
        subtotal: itemSubtotal,
      };
    });

    const order = await tx.order.create({
      data: {
        orderNumber,
        customerName: validated.customerName,
        customerEmail: validated.customerEmail,
        customerPhone: validated.customerPhone,
        shippingAddress: validated.shippingAddress,
        subtotal,
        shippingCost: 0,
        tax: 0,
        total: subtotal,
        status: validated.status,
        paymentStatus: validated.paymentStatus,
        paymentMethod: validated.paymentMethod,
        paymentReference: validated.paymentReference,
        notes: validated.notes,
        items: { create: orderItems },
      },
      include: { items: true },
    });

    for (const item of items) {
      if (item.productId) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }

    return order;
  });

  await prisma.transactionLog.create({
    data: {
      type: "order",
      action: "create",
      referenceId: order.id,
      referenceNumber: order.orderNumber,
      description: `Membuat pesanan baru: ${order.orderNumber}`,
      newValues: validated as any,
      performedBy: "Admin",
    },
  });

  // Notifications
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

  await Promise.allSettled([
    sendOrderConfirmation(orderData),
    sendAdminNotification(orderData),
    sendWAOrderConfirmation(orderData),
    sendWAAdminNotification(orderData),
  ]);

  revalidatePath("/admin/orders");
  return serialize(order);
}

export async function updateOrder(id: number, data: z.infer<typeof orderSchema> & { items: { productId?: number; productName: string; productSku?: string; quantity: number; price: number }[] }) {
  const validated = orderSchema.parse(data);
  const oldOrder = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!oldOrder) throw new Error("Pesanan tidak ditemukan");

  const items = data.items;
  if (items.length === 0) throw new Error("Minimal harus ada 1 item");

  await incrementStock(oldOrder.items);

  await prisma.orderItem.deleteMany({ where: { orderId: id } });

  let subtotal = 0;
  const orderItems = items.map((item) => {
    const itemSubtotal = item.quantity * item.price;
    subtotal += itemSubtotal;
    return {
      productId: item.productId || null,
      productName: item.productName,
      productSku: item.productSku || null,
      quantity: item.quantity,
      price: item.price,
      subtotal: itemSubtotal,
    };
  });

  const order = await prisma.order.update({
    where: { id },
    data: {
      customerName: validated.customerName,
      customerEmail: validated.customerEmail,
      customerPhone: validated.customerPhone,
      shippingAddress: validated.shippingAddress,
      subtotal,
      total: subtotal,
      status: validated.status,
      paymentStatus: validated.paymentStatus,
      paymentMethod: validated.paymentMethod,
      paymentReference: validated.paymentReference,
      notes: validated.notes,
      items: { create: orderItems },
    },
    include: { items: true },
  });

  await decrementStock(items);

  await prisma.transactionLog.create({
    data: {
      type: "order",
      action: "update",
      referenceId: order.id,
      referenceNumber: order.orderNumber,
      description: `Memperbarui pesanan: ${order.orderNumber}`,
      oldValues: oldOrder as any,
      newValues: validated as any,
      performedBy: "Admin",
    },
  });

  revalidatePath("/admin/orders");
  return serialize(order);
}

export async function updateOrderStatus(id: number, status: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) throw new Error("Pesanan tidak ditemukan");

  if (status === "cancelled" && order.status !== "cancelled") {
    await incrementStock(order.items);
  }

  const updateData: Record<string, unknown> = { status };
  if (status === "shipped" && !order.shippedAt) updateData.shippedAt = new Date();
  if (status === "delivered" && !order.deliveredAt) updateData.deliveredAt = new Date();

  await prisma.order.update({ where: { id }, data: updateData });

  await prisma.transactionLog.create({
    data: {
      type: "order",
      action: "status_change",
      referenceId: order.id,
      referenceNumber: order.orderNumber,
      description: `Mengubah status pesanan: ${order.orderNumber}`,
      oldValues: { status: order.status } as any,
      newValues: { status } as any,
      performedBy: "Admin",
    },
  });

  // Notification
  const updatedOrder = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (updatedOrder) {
    await Promise.allSettled([
      sendOrderStatusUpdate({
        orderNumber: updatedOrder.orderNumber,
        customerName: updatedOrder.customerName,
        customerEmail: updatedOrder.customerEmail,
        customerPhone: updatedOrder.customerPhone,
        shippingAddress: updatedOrder.shippingAddress,
        total: Number(updatedOrder.total),
        status: updatedOrder.status,
        items: updatedOrder.items.map((i) => ({
          productName: i.productName,
          quantity: i.quantity,
          price: Number(i.price),
          subtotal: Number(i.subtotal),
        })),
      }),
      sendWAOrderStatusUpdate({
        orderNumber: updatedOrder.orderNumber,
        customerName: updatedOrder.customerName,
        customerPhone: updatedOrder.customerPhone,
        total: Number(updatedOrder.total),
        status: updatedOrder.status,
      }),
    ]);
  }

  revalidatePath("/admin/orders");
}

export async function updateOrderPayment(id: number, data: { paymentStatus: string; paymentMethod?: string; paymentReference?: string }) {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw new Error("Pesanan tidak ditemukan");

  const updateData: Record<string, unknown> = {
    paymentStatus: data.paymentStatus,
    paymentMethod: data.paymentMethod,
    paymentReference: data.paymentReference,
  };
  if (data.paymentStatus === "paid" && !order.paidAt) updateData.paidAt = new Date();

  await prisma.order.update({ where: { id }, data: updateData });

  await prisma.transactionLog.create({
    data: {
      type: "payment",
      action: "payment",
      referenceId: order.id,
      referenceNumber: order.orderNumber,
      description: `Update pembayaran pesanan: ${order.orderNumber}`,
      oldValues: { paymentStatus: order.paymentStatus } as any,
      newValues: data as any,
      performedBy: "Admin",
    },
  });

  // Notification if payment confirmed
  if (data.paymentStatus === "paid") {
    const updatedOrder = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (updatedOrder) {
      await Promise.allSettled([
        sendOrderStatusUpdate({
          orderNumber: updatedOrder.orderNumber,
          customerName: updatedOrder.customerName,
          customerEmail: updatedOrder.customerEmail,
          customerPhone: updatedOrder.customerPhone,
          shippingAddress: updatedOrder.shippingAddress,
          total: Number(updatedOrder.total),
          status: updatedOrder.status,
          items: updatedOrder.items.map((i) => ({
            productName: i.productName,
            quantity: i.quantity,
            price: Number(i.price),
            subtotal: Number(i.subtotal),
          })),
        }),
        sendWAOrderStatusUpdate({
          orderNumber: updatedOrder.orderNumber,
          customerName: updatedOrder.customerName,
          customerPhone: updatedOrder.customerPhone,
          total: Number(updatedOrder.total),
          status: updatedOrder.status,
        }),
      ]);
    }
  }

  revalidatePath("/admin/orders");
}

export async function deleteOrder(id: number) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) throw new Error("Pesanan tidak ditemukan");

  await incrementStock(order.items);

  await prisma.transactionLog.create({
    data: {
      type: "order",
      action: "delete",
      referenceId: order.id,
      referenceNumber: order.orderNumber,
      description: `Menghapus pesanan: ${order.orderNumber}`,
      oldValues: order as any,
      performedBy: "Admin",
    },
  });

  await prisma.order.delete({ where: { id } });
  revalidatePath("/admin/orders");
}
