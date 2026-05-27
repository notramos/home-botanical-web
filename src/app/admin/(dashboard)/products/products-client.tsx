"use client";

import React, { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import DataTable from "@/components/admin/data-table";
import StatCard from "@/components/admin/stat-card";
import FilterBar from "@/components/admin/filter-bar";
import DeleteModal from "@/components/admin/delete-modal";
import { deleteProduct, toggleFeatured } from "@/actions/admin";
import { categories } from "@/lib/utils";
import { EditIcon, DeleteIcon, StarIcon, ViewIcon } from "@/components/shared/icons";
import toast from "react-hot-toast";

interface ProductsClientProps {
  initialData: Record<string, unknown>[];
  initialPagination: { page: number; perPage: number; total: number; totalPages: number; pageSize: number };
  stats: { total: number; active: number; draft: number; outOfStock: number };
}

export default function ProductsClient({
  initialData,
  initialPagination,
  stats,
}: ProductsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = React.useState(initialData);
  const [pagination, setPagination] = React.useState(initialPagination);
  const [deleteModal, setDeleteModal] = React.useState<{ show: boolean; id: number; name: string }>({
    show: false,
    id: 0,
    name: "",
  });

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const category = searchParams.get("category") || "";
  const plantType = searchParams.get("plantType") || "";

  const filters: Record<string, string> = { status, category, plantType };

  const buildUrl = useCallback(
    (params: Record<string, string>) => {
      const sp = new URLSearchParams();
      if (params.search) sp.set("search", params.search);
      if (params.status) sp.set("status", params.status);
      if (params.category) sp.set("category", params.category);
      if (params.plantType) sp.set("plantType", params.plantType);
      if (params.page) sp.set("page", params.page);
      const qs = sp.toString();
      return qs ? `/admin/products?${qs}` : "/admin/products";
    },
    []
  );

  function handleSearchChange(value: string) {
    router.push(buildUrl({ search: value, status, category, plantType, page: "1" }));
  }

  function handleFilterChange(key: string, value: string) {
    const params: Record<string, string> = { search, status, category, plantType, page: "1" };
    params[key] = value;
    router.push(buildUrl(params));
  }

  function handlePageChange(pageNum: number) {
    router.push(buildUrl({ search, status, category, plantType, page: String(pageNum) }));
  }

  async function handleToggleFeatured(id: number) {
    try {
      await toggleFeatured(id);
      toast.success("Featured status updated");
      router.refresh();
    } catch {
      toast.error("Failed to update featured status");
    }
  }

  async function handleDelete() {
    if (!deleteModal.id) return;
    try {
      await deleteProduct(deleteModal.id);
      toast.success("Product deleted");
      setDeleteModal({ show: false, id: 0, name: "" });
      router.refresh();
    } catch {
      toast.error("Failed to delete product");
    }
  }

  const columns = [
    { key: "image", label: "Image", type: "image" as const, width: "60px" },
    { key: "name", label: "Name" },
    { key: "category", label: "Category", type: "badge" as const },
    { key: "price", label: "Price", type: "currency" as const },
    {
      key: "stock",
      label: "Stock",
      render: (_value: unknown, row: Record<string, unknown>) => {
        const stock = Number(row.stock) || 0;
        if (stock <= 0)
          return <span className="text-xs text-danger font-medium">Out of Stock</span>;
        if (stock <= 5)
          return <span className="text-xs text-[--color-accent-gold] font-medium">{stock} left</span>;
        return <span className="text-xs text-text-muted">{stock}</span>;
      },
    },
    { key: "status", label: "Status", type: "status" as const },
    {
      key: "isFeatured",
      label: "Featured",
      width: "60px",
    },
  ];

  const actions = [
    {
      label: "View",
      href: (row: Record<string, unknown>) => `/admin/products/${row.id}`,
      icon: <ViewIcon className="w-4 h-4" />,
      variant: "ghost" as const,
    },
    {
      label: "Featured",
      onClick: (row: Record<string, unknown>) => handleToggleFeatured(Number(row.id)),
      icon: <StarIcon className="w-4 h-4" />,
      variant: "ghost" as const,
    },
    {
      label: "Edit",
      href: (row: Record<string, unknown>) => `/admin/products/${row.id}/edit`,
      icon: <EditIcon className="w-4 h-4" />,
      variant: "ghost" as const,
    },
    {
      label: "Delete",
      onClick: (row: Record<string, unknown>) =>
        setDeleteModal({ show: true, id: Number(row.id), name: String(row.name) }),
      icon: <DeleteIcon className="w-4 h-4" />,
      variant: "danger" as const,
    },
  ];

  const filterOptions = [
    {
      key: "status",
      label: "Status",
      placeholder: "All Statuses",
      options: [
        { value: "active", label: "Active" },
        { value: "draft", label: "Draft" },
        { value: "archived", label: "Archived" },
      ],
    },
    {
      key: "category",
      label: "Category",
      placeholder: "All Categories",
      options: categories.map((c) => ({ value: c.value, label: c.label })),
    },
    {
      key: "plantType",
      label: "Plant Type",
      placeholder: "All Types",
      options: [
        { value: "indoor", label: "Indoor" },
        { value: "outdoor", label: "Outdoor" },
        { value: "both", label: "Both" },
      ],
    },
  ];

  const statIcons = {
    total: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    active: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    draft: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    outOfStock: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    ),
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard name="Total Products" value={stats.total} icon={statIcons.total} accent="var(--color-accent-green)" />
        <StatCard name="Active" value={stats.active} icon={statIcons.active} accent="var(--color-success)" />
        <StatCard name="Draft" value={stats.draft} icon={statIcons.draft} accent="var(--color-accent-gold)" />
        <StatCard name="Out of Stock" value={stats.outOfStock} icon={statIcons.outOfStock} accent="var(--color-danger)" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <FilterBar
          searchValue={search}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search products..."
          filters={filters}
          onFilterChange={handleFilterChange}
          filterOptions={filterOptions}
        />
        <Link
          href="/admin/products/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent-green text-bg-main text-sm font-medium rounded-lg hover:bg-accent-light transition-colors ml-3"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Product
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={data}
        pagination={pagination}
        actions={actions}
        onPageChange={handlePageChange}
        emptyState={{
          title: "No products found",
          description: "Try adjusting your search or filter criteria.",
        }}
      />

      <DeleteModal
        show={deleteModal.show}
        title="Delete Product"
        itemName={deleteModal.name}
        onClose={() => setDeleteModal({ show: false, id: 0, name: "" })}
        onConfirm={handleDelete}
      />
    </>
  );
}
