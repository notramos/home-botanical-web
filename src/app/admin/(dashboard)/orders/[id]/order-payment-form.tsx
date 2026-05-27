"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateOrderPayment } from "@/actions/admin";
import { paymentStatusLabels } from "@/lib/utils";
import toast from "react-hot-toast";

interface OrderPaymentFormProps {
  orderId: number;
  currentPaymentStatus: string;
  currentPaymentMethod: string | null;
  currentPaymentReference: string | null;
}

const paymentOptions = Object.entries(paymentStatusLabels).map(([value, label]) => ({ value, label }));

export default function OrderPaymentForm({
  orderId,
  currentPaymentStatus,
  currentPaymentMethod,
  currentPaymentReference,
}: OrderPaymentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    paymentStatus: currentPaymentStatus,
    paymentMethod: currentPaymentMethod || "",
    paymentReference: currentPaymentReference || "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateOrderPayment(orderId, {
        paymentStatus: form.paymentStatus,
        paymentMethod: form.paymentMethod || undefined,
        paymentReference: form.paymentReference || undefined,
      });
      toast.success("Payment updated");
      router.refresh();
    } catch {
      toast.error("Failed to update payment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <select
        value={form.paymentStatus}
        onChange={(e) => setForm((prev) => ({ ...prev, paymentStatus: e.target.value }))}
        className="w-full bg-bg-main border border-white/10 rounded-lg px-3 py-2 text-sm text-text-light focus:outline-none focus:ring-2 focus:ring-accent-green/40 focus:border-accent-light transition-all appearance-none cursor-pointer"
      >
        {paymentOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={form.paymentMethod}
        onChange={(e) => setForm((prev) => ({ ...prev, paymentMethod: e.target.value }))}
        placeholder="Payment method"
        className="w-full bg-bg-main border border-white/10 rounded-lg px-3 py-2 text-sm text-text-light placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent-green/40 focus:border-accent-light transition-all"
      />
      <input
        type="text"
        value={form.paymentReference}
        onChange={(e) => setForm((prev) => ({ ...prev, paymentReference: e.target.value }))}
        placeholder="Payment reference"
        className="w-full bg-bg-main border border-white/10 rounded-lg px-3 py-2 text-sm text-text-light placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent-green/40 focus:border-accent-light transition-all"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full px-3 py-2 text-sm font-medium rounded-lg bg-accent-green text-bg-main hover:bg-accent-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Updating..." : "Update Payment"}
      </button>
    </form>
  );
}
