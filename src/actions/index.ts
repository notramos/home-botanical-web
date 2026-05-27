import { prisma } from "@/lib/db";

function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export async function getProducts(params?: {
  search?: string;
  status?: string;
  category?: string;
  plantType?: string;
  page?: number;
  perPage?: number;
}) {
  const page = params?.page || 1;
  const perPage = params?.perPage || 10;
  const skip = (page - 1) * perPage;

  const where: Record<string, unknown> = {};
  if (params?.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { sku: { contains: params.search, mode: "insensitive" } },
    ];
  }
  if (params?.status && params.status !== "all") where.status = params.status;
  if (params?.category && params.category !== "all") where.category = params.category;
  if (params?.plantType && params.plantType !== "all") where.plantType = params.plantType;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: perPage,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data: serialize(products),
    pagination: {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    },
  };
}

export async function getProductById(id: number) {
  const product = await prisma.product.findUnique({ where: { id } });
  return product ? serialize(product) : null;
}

export async function getProductStats() {
  const [total, active, draft, outOfStock] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { status: "active" } }),
    prisma.product.count({ where: { status: "draft" } }),
    prisma.product.count({ where: { stock: { lte: 0 } } }),
  ]);
  return { total, active, draft, outOfStock };
}

export async function getCategories() {
  const categories = await prisma.product.findMany({
    where: {
      status: "active",
      category: { not: null },
    },
    select: { category: true, image: true },
    distinct: ["category"],
  });
  return serialize(categories);
}

export async function getOrders(params?: {
  search?: string;
  status?: string;
  paymentStatus?: string;
  page?: number;
  perPage?: number;
}) {
  const page = params?.page || 1;
  const perPage = params?.perPage || 10;
  const skip = (page - 1) * perPage;

  const where: Record<string, unknown> = {};
  if (params?.search) {
    where.OR = [
      { orderNumber: { contains: params.search, mode: "insensitive" } },
      { customerName: { contains: params.search, mode: "insensitive" } },
      { customerEmail: { contains: params.search, mode: "insensitive" } },
    ];
  }
  if (params?.status && params.status !== "all") where.status = params.status;
  if (params?.paymentStatus && params.paymentStatus !== "all") where.paymentStatus = params.paymentStatus;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: perPage,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    data: serialize(orders),
    pagination: {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    },
  };
}

export async function getOrderById(id: number) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  return order ? serialize(order) : null;
}

export async function getOrderStats() {
  const [total, pending, processing, completed, revenue] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.order.count({ where: { status: "processing" } }),
    prisma.order.count({ where: { status: { in: ["shipped", "delivered"] } } }),
    prisma.order.aggregate({
      where: { status: { in: ["shipped", "delivered"] } },
      _sum: { total: true },
    }),
  ]);
  return {
    total,
    pending,
    processing,
    completed,
    revenue: Number(revenue._sum.total) || 0,
  };
}

export async function getDashboardStats() {
  const [productStats, orderStats, transactionStats] = await Promise.all([
    getProductStats(),
    getOrderStats(),
    (async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const [todayCount, thisWeekCount, total, recent] = await Promise.all([
        prisma.transactionLog.count({ where: { createdAt: { gte: today } } }),
        prisma.transactionLog.count({ where: { createdAt: { gte: weekAgo } } }),
        prisma.transactionLog.count(),
        prisma.transactionLog.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
      ]);
      return { today: todayCount, thisWeek: thisWeekCount, total, recent: serialize(recent) };
    })(),
  ]);

  return { productStats, orderStats, transactionStats };
}

export async function getTransactions(params?: { page?: number; perPage?: number }) {
  const page = params?.page || 1;
  const perPage = params?.perPage || 20;
  const skip = (page - 1) * perPage;

  const [data, total] = await Promise.all([
    prisma.transactionLog.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: perPage,
    }),
    prisma.transactionLog.count(),
  ]);

  return {
    data: serialize(data),
    pagination: { page, perPage, total, totalPages: Math.ceil(total / perPage) },
  };
}

export async function getTransactionById(id: number) {
  const log = await prisma.transactionLog.findUnique({ where: { id } });
  return log ? serialize(log) : null;
}

export async function getActiveProducts() {
  const products = await prisma.product.findMany({
    where: { status: "active", stock: { gt: 0 } },
    select: { id: true, name: true, price: true, stock: true },
  });
  return serialize(products);
}
