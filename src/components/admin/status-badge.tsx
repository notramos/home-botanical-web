import { Badge } from "@/components/ui/badge";
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

  const variant = variantMap[status.toLowerCase()] || "secondary";

  return (
    <Badge variant={variant} className="gap-1.5 capitalize">
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: colors.text }}
      />
      {label}
    </Badge>
  );
}
