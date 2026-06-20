"use client";

import Link from "next/link";
import { cn, formatPrice, formatDate, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
  const variantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    active: "default",
    paid: "default",
    delivered: "default",
    in_stock: "default",
    draft: "secondary",
    pending: "secondary",
    processing: "secondary",
    unpaid: "secondary",
    low_stock: "secondary",
    archived: "outline",
    cancelled: "outline",
    shipped: "outline",
    refunded: "destructive",
    failed: "destructive",
    out_of_stock: "destructive",
  };

  return (
    <Badge variant={variantMap[value] || "secondary"}>
      {value}
    </Badge>
  );
}

function CurrencyDisplay({ value }: { value: unknown }) {
  const num = typeof value === "number" ? value : Number(value) || 0;
  return <span className="font-medium tabular-nums">{formatPrice(num, "IDR")}</span>;
}

function DateDisplay({ value }: { value: unknown }) {
  const d = value instanceof Date ? value : typeof value === "string" ? value : null;
  if (!d) return <span className="text-muted-foreground">—</span>;
  return <span className="text-sm">{formatDate(d, "id")}</span>;
}

function DateTimeDisplay({ value }: { value: unknown }) {
  const d = value instanceof Date ? value : typeof value === "string" ? value : null;
  if (!d) return <span className="text-muted-foreground">—</span>;
  return <span className="text-sm">{formatDateTime(d, "id")}</span>;
}

function ImageDisplay({ value }: { value: unknown }) {
  if (!value || typeof value !== "string") return null;
  return (
    <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
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
          <div className="mb-4 text-muted-foreground">{emptyState.icon}</div>
        )}
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {emptyState.title}
        </h3>
        {emptyState.description && (
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            {emptyState.description}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.label}
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground w-24">
                  Actions
                </th>
              )}
            </tr>
          </thead>
            <tbody className="divide-y divide-border">
            {data.map((row, rowIdx) => (
              <tr
                key={(row.id as string) || rowIdx}
                className="hover:bg-muted/50 transition-colors"
              >
                {columns.map((col) => {
                  const raw = row[col.key];

                  if (col.render) {
                    return (
                      <td key={col.key} className="px-4 py-3 text-foreground">
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
                        <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-muted text-muted-foreground">
                          {String(raw ?? "")}
                        </span>
                      );
                      break;
                    default:
                      cell = <span className="text-foreground">{String(raw ?? "")}</span>;
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
                                    ? "text-destructive hover:bg-destructive/10"
                                    : action.variant === "ghost"
                                    ? "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
                                  ? "text-destructive hover:bg-destructive/10"
                                  : action.variant === "ghost"
                                    ? "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
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

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.pageSize + 1}–
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{" "}
            {pagination.total}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange?.(pagination.page - 1)}
              className="px-2.5 py-1.5 text-xs rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
              className="px-2.5 py-1.5 text-xs rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
