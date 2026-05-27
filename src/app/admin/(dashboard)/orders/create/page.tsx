"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FormField from "@/components/admin/form-field";
import { createOrder } from "@/actions/admin";
import { orderStatusLabels, paymentStatusLabels } from "@/lib/utils";
import toast from "react-hot-toast";

interface OrderItem {
  productName: string;
  productSku: string;
  quantity: number;
  price: string;
}

const statusOptions = Object.entries(orderStatusLabels).map(([value, label]) => ({ value, label }));
const paymentOptions = Object.entries(paymentStatusLabels).map(([value, label]) => ({ value, label }));

export default function CreateOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [items, setItems] = useState<OrderItem[]>([
    { productName: "", productSku: "", quantity: 1, price: "" },
  ]);
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    status: "pending",
    paymentStatus: "unpaid",
    paymentMethod: "",
    paymentReference: "",
    notes: "",
  });

  function handleFormChange(name: string) {
    return (value: string | number | boolean) => {
      setForm((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => {
          const copy = { ...prev };
          delete copy[name];
          return copy;
        });
      }
    };
  }

  function handleItemChange(index: number, field: keyof OrderItem, value: string | number) {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  }

  const addItem = useCallback(() => {
    setItems((prev) => [...prev, { productName: "", productSku: "", quantity: 1, price: "" }]);
  }, []);

  function removeItem(index: number) {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await createOrder({
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        customerPhone: form.customerPhone || null,
        shippingAddress: form.shippingAddress || null,
        status: form.status as "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded",
        paymentStatus: form.paymentStatus as "unpaid" | "paid" | "failed" | "refunded",
        paymentMethod: form.paymentMethod || null,
        paymentReference: form.paymentReference || null,
        notes: form.notes || null,
        items: items.map((item) => ({
          productName: item.productName,
          productSku: item.productSku || undefined,
          quantity: item.quantity,
          price: Number(item.price),
        })),
      });
      toast.success("Order created successfully");
      router.push("/admin/orders");
    } catch (err: unknown) {
      if (err instanceof Error) {
        try {
          const parsed = JSON.parse(err.message);
          if (parsed.errors) {
            const fieldErrors: Record<string, string> = {};
            for (const e of parsed.errors) {
              fieldErrors[e.path?.[0] || e.message] = e.message;
            }
            setErrors(fieldErrors);
          }
        } catch {
          setErrors({ form: err.message });
        }
      } else {
        setErrors({ form: "Failed to create order" });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-text-light">Create Order</h1>
          <p className="text-sm text-text-muted mt-1">Add a new customer order</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {errors.form && (
          <div className="bg-danger/10 border border-danger/20 rounded-lg px-4 py-3">
            <p className="text-sm text-danger">{errors.form}</p>
          </div>
        )}

        <div className="bg-bg-soft rounded-xl border border-accent-green/10 p-6 space-y-4">
          <h2 className="text-lg font-heading font-semibold text-accent-green">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Customer Name" name="customerName" value={form.customerName} onChange={handleFormChange("customerName")} error={errors.customerName} placeholder="John Doe" />
            <FormField label="Email" name="customerEmail" type="email" value={form.customerEmail} onChange={handleFormChange("customerEmail")} error={errors.customerEmail} placeholder="john@example.com" />
            <FormField label="Phone" name="customerPhone" value={form.customerPhone} onChange={handleFormChange("customerPhone")} error={errors.customerPhone} placeholder="+1 234 567 890" />
          </div>
          <FormField label="Shipping Address" name="shippingAddress" type="textarea" value={form.shippingAddress} onChange={handleFormChange("shippingAddress")} error={errors.shippingAddress} placeholder="Full shipping address..." rows={3} />
        </div>

        <div className="bg-bg-soft rounded-xl border border-accent-green/10 p-6 space-y-4">
          <h2 className="text-lg font-heading font-semibold text-accent-green">Order Items</h2>
          {items.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-bg-main/30">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-text-muted mb-1">Product Name</label>
                  <input
                    type="text"
                    value={item.productName}
                    onChange={(e) => handleItemChange(idx, "productName", e.target.value)}
                    placeholder="Product name"
                    required
                    className="w-full bg-bg-main border border-accent-green/15 rounded-lg px-3 py-2 text-sm text-accent-green placeholder:text-accent-green/50 focus:outline-none focus:ring-2 focus:ring-accent-green/40 focus:border-accent-light transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">SKU</label>
                  <input
                    type="text"
                    value={item.productSku}
                    onChange={(e) => handleItemChange(idx, "productSku", e.target.value)}
                    placeholder="SKU"
                    className="w-full bg-bg-main border border-accent-green/15 rounded-lg px-3 py-2 text-sm text-accent-green placeholder:text-accent-green/50 focus:outline-none focus:ring-2 focus:ring-accent-green/40 focus:border-accent-light transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Qty</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(idx, "quantity", parseInt(e.target.value) || 0)}
                    min="1"
                    required
                    className="w-full bg-bg-main border border-accent-green/15 rounded-lg px-3 py-2 text-sm text-accent-green placeholder:text-accent-green/50 focus:outline-none focus:ring-2 focus:ring-accent-green/40 focus:border-accent-light transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Price</label>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => handleItemChange(idx, "price", e.target.value)}
                    placeholder="0"
                    step="0.01"
                    required
                    className="w-full bg-bg-main border border-accent-green/15 rounded-lg px-3 py-2 text-sm text-accent-green placeholder:text-accent-green/50 focus:outline-none focus:ring-2 focus:ring-accent-green/40 focus:border-accent-light transition-all"
                  />
                </div>
              </div>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="mt-5 p-1.5 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-2 text-sm text-accent-green hover:text-accent-green/80 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Item
          </button>
        </div>

        <div className="bg-bg-soft rounded-xl border border-accent-green/10 p-6 space-y-4">
          <h2 className="text-lg font-heading font-semibold text-accent-green">Status & Payment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Status" name="status" type="select" value={form.status} onChange={handleFormChange("status")} error={errors.status} options={statusOptions} />
            <FormField label="Payment Status" name="paymentStatus" type="select" value={form.paymentStatus} onChange={handleFormChange("paymentStatus")} error={errors.paymentStatus} options={paymentOptions} />
            <FormField label="Payment Method" name="paymentMethod" value={form.paymentMethod} onChange={handleFormChange("paymentMethod")} error={errors.paymentMethod} placeholder="e.g. Bank Transfer" />
            <FormField label="Payment Reference" name="paymentReference" value={form.paymentReference} onChange={handleFormChange("paymentReference")} error={errors.paymentReference} placeholder="e.g. INV-001" />
          </div>
          <FormField label="Notes" name="notes" type="textarea" value={form.notes} onChange={handleFormChange("notes")} error={errors.notes} placeholder="Internal notes..." rows={3} />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-accent-green/10">
          <Link
            href="/admin/orders"
            className="px-6 py-2.5 text-sm font-medium rounded-lg border border-accent-green/15 text-accent-green/60 hover:text-accent-green hover:bg-accent-green/[3%] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-accent-green text-bg-main text-sm font-medium rounded-lg hover:bg-accent-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {loading ? "Creating..." : "Create Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
