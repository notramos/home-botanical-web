"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/actions/admin";
import { orderStatusLabels } from "@/lib/utils";
import toast from "react-hot-toast";

interface OrderStatusActionsProps {
  orderId: number;
  currentStatus: string;
}

export default function OrderStatusActions({ orderId, currentStatus }: OrderStatusActionsProps) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const statusFlow = ["pending", "processing", "shipped", "delivered"];
  const currentIdx = statusFlow.indexOf(currentStatus);

  async function handleStatusChange(newStatus: string) {
    if (newStatus === currentStatus) return;
    setLoading(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      setSelectedStatus(newStatus);
      toast.success(`Status updated to ${orderStatusLabels[newStatus] || newStatus}`);
      router.refresh();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2">
        {statusFlow.map((s, idx) => {
          const isCurrent = s === currentStatus;
          const isPast = idx < currentIdx;
          const isFuture = idx > currentIdx;
          return (
            <button
              key={s}
              type="button"
              disabled={isCurrent || loading}
              onClick={() => handleStatusChange(s)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                isCurrent
                  ? "bg-accent-green/10 text-accent-light font-medium border border-accent-green/20"
                  : isPast
                    ? "bg-white/5 text-text-muted"
                    : "bg-white/[0.02] text-text-muted hover:bg-white/5 hover:text-text-light border border-transparent hover:border-white/10"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isCurrent
                    ? "bg-accent-light"
                    : isPast
                      ? "bg-text-muted/30"
                      : "bg-text-muted/20"
                }`}
              />
              <span>{orderStatusLabels[s] || s}</span>
              {isCurrent && (
                <span className="ml-auto text-[10px] font-medium uppercase tracking-wider text-accent-light">
                  Current
                </span>
              )}
            </button>
          );
        })}
      </div>

      {["cancelled", "refunded"].includes(currentStatus) ? null : currentStatus !== "cancelled" && (
        <div className="pt-2 border-t border-white/5">
          <div className="flex gap-2">
            {currentStatus !== "cancelled" && (
              <button
                type="button"
                disabled={loading}
                onClick={() => handleStatusChange("cancelled")}
                className="flex-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-danger/30 text-danger hover:bg-danger/10 transition-colors disabled:opacity-50"
              >
                Cancel Order
              </button>
            )}
            {currentStatus !== "refunded" && (
              <button
                type="button"
                disabled={loading}
                onClick={() => handleStatusChange("refunded")}
                className="flex-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-white/10 text-text-muted hover:text-text-light hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                Refund
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
