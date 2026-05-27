import { getOrders, getOrderStats } from "@/actions";
import OrdersClient from "./orders-client";

interface OrdersPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    paymentStatus?: string;
    page?: string;
  }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const sp = await searchParams;
  const page = sp.page ? parseInt(sp.page) : 1;

  const [ordersData, stats] = await Promise.all([
    getOrders({
      search: sp.search,
      status: sp.status,
      paymentStatus: sp.paymentStatus,
      page,
      perPage: 10,
    }),
    getOrderStats(),
  ]);

  const pagination = {
    ...ordersData.pagination,
    pageSize: ordersData.pagination.perPage,
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-text-light">Orders</h1>
          <p className="text-sm text-text-muted mt-1">Manage customer orders</p>
        </div>
      </div>

      <OrdersClient
        initialData={ordersData.data as unknown as Record<string, unknown>[]}
        initialPagination={pagination}
        stats={{ ...stats, revenue: Number(stats.revenue) }}
      />
    </div>
  );
}
