import { statusColors } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  type?: "status" | "stock" | "payment";
}

export default function StatusBadge({ status, type = "status" }: StatusBadgeProps) {
  const colors = statusColors[status.toLowerCase()] || {
    bg: "rgba(156, 163, 175, 0.1)",
    text: "#6b7280",
  };

  const labels: Record<string, string> = {
    active: "Active",
    draft: "Draft",
    archived: "Archived",
    pending: "Pending",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    refunded: "Refunded",
    paid: "Paid",
    unpaid: "Unpaid",
    failed: "Failed",
    in_stock: "In Stock",
    low_stock: "Low Stock",
    out_of_stock: "Out of Stock",
  };

  const label = labels[status.toLowerCase()] || status;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full capitalize"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: colors.text }}
      />
      {label}
    </span>
  );
}
