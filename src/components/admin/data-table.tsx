"use client";

import Link from "next/link";
import { cn, formatPrice, formatDate, formatDateTime } from "@/lib/utils";

type ColumnType = "status" | "currency" | "date" | "datetime" | "image" | "badge";

interface Column {
  key: string;
  label: string;
  type?: ColumnType;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode | string;
  width?: string;
}

interface Action {
  label: string;
  href?: string | ((row: Record<string, unknown>) => string);
  onClick?: (row: Record<string, unknown>) => void;
  icon?: React.ReactNode;
  variant?: "default" | "danger" | "ghost";
  condition?: (row: Record<string, unknown>) => boolean;
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, unknown>[];
  pagination?: Pagination;
  actions?: Action[];
  emptyState?: {
    icon?: React.ReactNode;
    title: string;
    description?: string;
  };
  onPageChange?: (page: number) => void;
}

function StatusBadge({ value }: { value: string }) {
  const colorMap: Record<string, string> = {
    active: "bg-[--color-success]/10 text-[--color-success]",
    draft: "bg-[--color-accent-gold]/10 text-[--color-accent-gold]",
    archived: "bg-accent-green/[3%] text-text-muted",
    pending: "bg-[--color-accent-gold]/10 text-[--color-accent-gold]",
    processing: "bg-[--color-info]/10 text-[--color-info]",
    shipped: "bg-purple-500/10 text-purple-400",
    delivered: "bg-[--color-success]/10 text-[--color-success]",
    cancelled: "bg-accent-green/[3%] text-text-muted",
    refunded: "bg-[--color-danger]/10 text-[--color-danger]",
    paid: "bg-[--color-success]/10 text-[--color-success]",
    unpaid: "bg-[--color-accent-gold]/10 text-[--color-accent-gold]",
    failed: "bg-[--color-danger]/10 text-[--color-danger]",
  };

  return (
    <span
      className={cn(
        "inline-block px-2.5 py-0.5 text-xs font-medium rounded-full capitalize",
        colorMap[value] || "bg-accent-green/[3%] text-text-muted"
      )}
    >
      {value}
    </span>
  );
}

function CurrencyDisplay({ value }: { value: unknown }) {
  const num = typeof value === "number" ? value : Number(value) || 0;
  return <span className="font-medium tabular-nums">{formatPrice(num, "IDR")}</span>;
}

function DateDisplay({ value }: { value: unknown }) {
  const d = value instanceof Date ? value : typeof value === "string" ? value : null;
  if (!d) return <span className="text-[--color-text-muted]">—</span>;
  return <span className="text-sm">{formatDate(d, "id")}</span>;
}

function DateTimeDisplay({ value }: { value: unknown }) {
  const d = value instanceof Date ? value : typeof value === "string" ? value : null;
  if (!d) return <span className="text-[--color-text-muted]">—</span>;
  return <span className="text-sm">{formatDateTime(d, "id")}</span>;
}

function ImageDisplay({ value }: { value: unknown }) {
  if (!value || typeof value !== "string") return null;
  return (
    <div className="w-10 h-10 rounded-lg overflow-hidden bg-[--color-bg-main] flex-shrink-0">
      <img
        src={value}
        alt=""
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    </div>
  );
}

export default function DataTable({
  columns,
  data,
  pagination,
  actions,
  emptyState,
  onPageChange,
}: DataTableProps) {
  if (data.length === 0 && emptyState) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        {emptyState.icon && (
          <div className="mb-4 text-[--color-text-muted]">{emptyState.icon}</div>
        )}
        <h3 className="font-heading text-xl text-[--color-text-light] mb-2">
          {emptyState.title}
        </h3>
        {emptyState.description && (
          <p className="text-sm text-[--color-text-muted] text-center max-w-sm">
            {emptyState.description}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-accent-green/10">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-accent-green/10 bg-accent-green/[2%]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted"
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.label}
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[--color-text-muted] w-24">
                  Actions
                </th>
              )}
            </tr>
          </thead>
            <tbody className="divide-y divide-accent-green/10">
            {data.map((row, rowIdx) => (
              <tr
                key={(row.id as string) || rowIdx}
                className="hover:bg-accent-green/[1%] transition-colors"
              >
                {columns.map((col) => {
                  const raw = row[col.key];

                  if (col.render) {
                    return (
                      <td key={col.key} className="px-4 py-3 text-[--color-text-light]">
                        {col.render(raw, row)}
                      </td>
                    );
                  }

                  let cell: React.ReactNode = raw as React.ReactNode;

                  switch (col.type) {
                    case "status":
                      cell = <StatusBadge value={String(raw ?? "")} />;
                      break;
                    case "currency":
                      cell = <CurrencyDisplay value={raw} />;
                      break;
                    case "date":
                      cell = <DateDisplay value={raw} />;
                      break;
                    case "datetime":
                      cell = <DateTimeDisplay value={raw} />;
                      break;
                    case "image":
                      cell = <ImageDisplay value={raw} />;
                      break;
                    case "badge":
                      cell = (
                        <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-accent-green/[3%] text-text-muted">
                          {String(raw ?? "")}
                        </span>
                      );
                      break;
                    default:
                      cell = <span className="text-[--color-text-light]">{String(raw ?? "")}</span>;
                  }

                  return (
                    <td key={col.key} className="px-4 py-3">
                      {cell}
                    </td>
                  );
                })}

                {actions && actions.length > 0 && (
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {actions
                        .filter((a) => !a.condition || a.condition(row))
                        .map((action, actIdx) => {
                          if (action.href) {
                            const href =
                              typeof action.href === "function"
                                ? action.href(row)
                                : action.href;
                            return (
                              <Link
                                key={actIdx}
                                href={href}
                                className={cn(
                                  "p-1.5 rounded-lg transition-colors",
                                  action.variant === "danger"
                                    ? "text-[--color-danger] hover:bg-[--color-danger]/10"
                                    : action.variant === "ghost"
                                    ? "text-text-muted hover:text-accent-green hover:bg-accent-green/[3%]"
                                    : "text-text-muted hover:text-accent-green hover:bg-accent-green/10"
                                )}
                              >
                                {action.icon || action.label}
                              </Link>
                            );
                          }

                          return (
                            <button
                              key={actIdx}
                              type="button"
                              onClick={() => action.onClick?.(row)}
                              className={cn(
                                "p-1.5 rounded-lg transition-colors",
                                action.variant === "danger"
                                  ? "text-[--color-danger] hover:bg-[--color-danger]/10"
                                  : action.variant === "ghost"
                                    ? "text-text-muted hover:text-accent-green hover:bg-accent-green/[3%]"
                                    : "text-text-muted hover:text-accent-green hover:bg-accent-green/10"
                              )}
                            >
                              {action.icon || action.label}
                            </button>
                          );
                        })}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-accent-green/10 bg-accent-green/[1.5%]">
          <p className="text-xs text-text-muted">
            Showing {(pagination.page - 1) * pagination.pageSize + 1}–
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{" "}
            {pagination.total}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange?.(pagination.page - 1)}
              className="px-2.5 py-1.5 text-xs rounded-lg text-text-muted hover:text-accent-green hover:bg-accent-green/[3%] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Prev
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => onPageChange?.(pageNum)}
                  className={cn(
                    "w-7 h-7 text-xs rounded-lg transition-colors",
                    pageNum === pagination.page
                      ? "bg-accent-green/10 text-accent-green font-semibold"
                      : "text-text-muted hover:text-accent-green hover:bg-accent-green/[3%]"
                  )}
                >
                  {pageNum}
                </button>
              )
            )}
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange?.(pagination.page + 1)}
              className="px-2.5 py-1.5 text-xs rounded-lg text-text-muted hover:text-accent-green hover:bg-accent-green/[3%] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
