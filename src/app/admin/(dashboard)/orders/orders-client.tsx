"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import DataTable from "@/components/admin/data-table";
import StatCard from "@/components/admin/stat-card";
import FilterBar from "@/components/admin/filter-bar";
import DeleteModal from "@/components/admin/delete-modal";
import { deleteOrder } from "@/actions/admin";
import { orderStatusLabels, paymentStatusLabels } from "@/lib/utils";
import { EditIcon, DeleteIcon, ViewIcon } from "@/components/shared/icons";
import toast from "react-hot-toast";

interface PaginationInfo {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  pageSize: number;
}

interface OrdersClientProps {
  initialData: Record<string, unknown>[];
  initialPagination: PaginationInfo;
  stats: { total: number; pending: number; processing: number; completed: number; revenue: number };
}

export default function OrdersClient({
  initialData,
  initialPagination,
  stats,
}: OrdersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState(initialData);
  const [pagination, setPagination] = useState(initialPagination);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; id: number; name: string }>({
    show: false,
    id: 0,
    name: "",
  });

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const paymentStatus = searchParams.get("paymentStatus") || "";
  const filters: Record<string, string> = { status, paymentStatus };

  function buildUrl(params: Record<string, string>) {
    const sp = new URLSearchParams();
    if (params.search) sp.set("search", params.search);
    if (params.status) sp.set("status", params.status);
    if (params.paymentStatus) sp.set("paymentStatus", params.paymentStatus);
    if (params.page) sp.set("page", params.page);
    const qs = sp.toString();
    return qs ? `/admin/orders?${qs}` : "/admin/orders";
  }

  function handleSearchChange(value: string) {
    router.push(buildUrl({ search: value, status, paymentStatus, page: "1" }));
  }

  function handleFilterChange(key: string, value: string) {
    const params: Record<string, string> = {
      search,
      status,
      paymentStatus,
      page: "1",
    };
    params[key] = value;
    router.push(buildUrl(params));
  }

  function handlePageChange(pageNum: number) {
    router.push(buildUrl({ search, status, paymentStatus, page: String(pageNum) }));
  }

  async function handleDelete() {
    if (!deleteModal.id) return;
    try {
      await deleteOrder(deleteModal.id);
      toast.success("Order deleted");
      setDeleteModal({ show: false, id: 0, name: "" });
      router.refresh();
    } catch {
      toast.error("Failed to delete order");
    }
  }

  const columns = [
    { key: "orderNumber", label: "Order #" },
    { key: "customerName", label: "Customer" },
    { key: "customerEmail", label: "Email" },
    { key: "total", label: "Total", type: "currency" as const },
    { key: "status", label: "Status", type: "status" as const },
    {
      key: "paymentStatus",
      label: "Payment",
      type: "status" as const,
    },
    { key: "createdAt", label: "Date", type: "datetime" as const },
  ];

  const actions = [
    {
      label: "View",
      href: (row: Record<string, unknown>) => `/admin/orders/${row.id}`,
      icon: <ViewIcon className="w-4 h-4" />,
      variant: "ghost" as const,
    },
    {
      label: "Edit",
      href: (row: Record<string, unknown>) => `/admin/orders/${row.id}/edit`,
      icon: <EditIcon className="w-4 h-4" />,
      variant: "ghost" as const,
    },
    {
      label: "Delete",
      onClick: (row: Record<string, unknown>) =>
        setDeleteModal({ show: true, id: Number(row.id), name: String(row.orderNumber) }),
      icon: <DeleteIcon className="w-4 h-4" />,
      variant: "danger" as const,
    },
  ];

  const filterOptions = [
    {
      key: "status",
      label: "Status",
      placeholder: "All Statuses",
      options: Object.entries(orderStatusLabels).map(([value, label]) => ({ value, label })),
    },
    {
      key: "paymentStatus",
      label: "Payment",
      placeholder: "All Payments",
      options: Object.entries(paymentStatusLabels).map(([value, label]) => ({ value, label })),
    },
  ];

  const statIcons = {
    total: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    pending: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    processing: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0zm7.5 1.5V12m0-3v.266M12 12a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    completed: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard name="Total Orders" value={stats.total} icon={statIcons.total} accent="var(--color-accent-green)" />
        <StatCard name="Pending" value={stats.pending} icon={statIcons.pending} accent="var(--color-accent-gold)" />
        <StatCard name="Processing" value={stats.processing} icon={statIcons.processing} accent="var(--color-info)" />
        <StatCard name="Completed" value={stats.completed} icon={statIcons.completed} accent="var(--color-success)" />
        <StatCard
          name="Revenue"
          value={`Rp ${(stats.revenue || 0).toLocaleString("id-ID")}`}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          accent="var(--color-accent-gold)"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <FilterBar
          searchValue={search}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search orders..."
          filters={filters}
          onFilterChange={handleFilterChange}
          filterOptions={filterOptions}
        />
        <Link
          href="/admin/orders/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent-green text-bg-main text-sm font-medium rounded-lg hover:bg-accent-light transition-colors ml-3"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Order
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={data}
        pagination={pagination}
        actions={actions}
        onPageChange={handlePageChange}
        emptyState={{
          title: "No orders found",
          description: "Try adjusting your search or filter criteria.",
        }}
      />

      <DeleteModal
        show={deleteModal.show}
        title="Delete Order"
        itemName={deleteModal.name}
        onClose={() => setDeleteModal({ show: false, id: 0, name: "" })}
        onConfirm={handleDelete}
      />
    </>
  );
}
