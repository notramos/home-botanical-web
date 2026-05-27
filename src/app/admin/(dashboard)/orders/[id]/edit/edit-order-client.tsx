"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FormField from "@/components/admin/form-field";
import DeleteModal from "@/components/admin/delete-modal";
import { createOrder, deleteOrder } from "@/actions/admin";
import { orderStatusLabels, paymentStatusLabels } from "@/lib/utils";
import toast from "react-hot-toast";

interface OrderItemData {
  id?: number;
  productName: string;
  productSku: string | null;
  quantity: number;
  price: number | string;
}

interface OrderData {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  shippingAddress: string | null;
  subtotal: number | string;
  shippingCost: number | string;
  tax: number | string;
  total: number | string;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  paymentReference: string | null;
  notes: string | null;
  items: OrderItemData[];
}

interface EditOrderClientProps {
  order: OrderData;
}

const statusOptions = Object.entries(orderStatusLabels).map(([value, label]) => ({ value, label }));
const paymentOptions = Object.entries(paymentStatusLabels).map(([value, label]) => ({ value, label }));

export default function EditOrderClient({ order }: EditOrderClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDelete, setShowDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone || "",
    shippingAddress: order.shippingAddress || "",
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod || "",
    paymentReference: order.paymentReference || "",
    notes: order.notes || "",
  });
  const [items, setItems] = useState<OrderItemData[]>(
    order.items.map((item) => ({
      id: item.id,
      productName: item.productName,
      productSku: item.productSku || "",
      quantity: item.quantity,
      price: String(item.price),
    }))
  );

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

  function handleItemChange(index: number, field: keyof OrderItemData, value: string | number) {
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
      toast.success("Order updated successfully");
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
        setErrors({ form: "Failed to update order" });
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setDeleteLoading(true);
    try {
      await deleteOrder(order.id);
      toast.success("Order deleted");
      router.push("/admin/orders");
    } catch {
      toast.error("Failed to delete order");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href={`/admin/orders/${order.id}`}
              className="text-text-muted hover:text-text-light transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </Link>
            <h1 className="font-heading text-3xl font-semibold text-text-light">
              Edit Order #{order.orderNumber}
            </h1>
          </div>
          <p className="text-sm text-text-muted mt-1">Update order details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {errors.form && (
          <div className="bg-danger/10 border border-danger/20 rounded-lg px-4 py-3">
            <p className="text-sm text-danger">{errors.form}</p>
          </div>
        )}

        <div className="bg-bg-soft rounded-xl border border-white/5 p-6 space-y-4">
          <h2 className="text-lg font-heading font-semibold text-text-light">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Customer Name" name="customerName" value={form.customerName} onChange={handleFormChange("customerName")} error={errors.customerName} placeholder="John Doe" />
            <FormField label="Email" name="customerEmail" type="email" value={form.customerEmail} onChange={handleFormChange("customerEmail")} error={errors.customerEmail} placeholder="john@example.com" />
            <FormField label="Phone" name="customerPhone" value={form.customerPhone} onChange={handleFormChange("customerPhone")} error={errors.customerPhone} placeholder="+1 234 567 890" />
          </div>
          <FormField label="Shipping Address" name="shippingAddress" type="textarea" value={form.shippingAddress} onChange={handleFormChange("shippingAddress")} error={errors.shippingAddress} placeholder="Full shipping address..." rows={3} />
        </div>

        <div className="bg-bg-soft rounded-xl border border-white/5 p-6 space-y-4">
          <h2 className="text-lg font-heading font-semibold text-text-light">Order Items</h2>
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
                    className="w-full bg-bg-main border border-white/10 rounded-lg px-3 py-2 text-sm text-text-light placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent-green/40 focus:border-accent-light transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">SKU</label>
                  <input
                    type="text"
                    value={item.productSku || ""}
                    onChange={(e) => handleItemChange(idx, "productSku", e.target.value)}
                    placeholder="SKU"
                    className="w-full bg-bg-main border border-white/10 rounded-lg px-3 py-2 text-sm text-text-light placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent-green/40 focus:border-accent-light transition-all"
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
                    className="w-full bg-bg-main border border-white/10 rounded-lg px-3 py-2 text-sm text-text-light placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent-green/40 focus:border-accent-light transition-all"
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
                    className="w-full bg-bg-main border border-white/10 rounded-lg px-3 py-2 text-sm text-text-light placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent-green/40 focus:border-accent-light transition-all"
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

        <div className="bg-bg-soft rounded-xl border border-white/5 p-6 space-y-4">
          <h2 className="text-lg font-heading font-semibold text-text-light">Status & Payment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Status" name="status" type="select" value={form.status} onChange={handleFormChange("status")} error={errors.status} options={statusOptions} />
            <FormField label="Payment Status" name="paymentStatus" type="select" value={form.paymentStatus} onChange={handleFormChange("paymentStatus")} error={errors.paymentStatus} options={paymentOptions} />
            <FormField label="Payment Method" name="paymentMethod" value={form.paymentMethod} onChange={handleFormChange("paymentMethod")} error={errors.paymentMethod} placeholder="e.g. Bank Transfer" />
            <FormField label="Payment Reference" name="paymentReference" value={form.paymentReference} onChange={handleFormChange("paymentReference")} error={errors.paymentReference} placeholder="e.g. INV-001" />
          </div>
          <FormField label="Notes" name="notes" type="textarea" value={form.notes} onChange={handleFormChange("notes")} error={errors.notes} placeholder="Internal notes..." rows={3} />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <button
            type="button"
            onClick={() => setShowDelete(true)}
            className="px-4 py-2.5 text-sm font-medium rounded-lg border border-danger/30 text-danger hover:bg-danger/10 transition-colors"
          >
            Delete Order
          </button>
          <div className="flex items-center gap-3">
            <Link
              href={`/admin/orders/${order.id}`}
              className="px-6 py-2.5 text-sm font-medium rounded-lg border border-white/10 text-text-muted hover:text-text-light hover:bg-white/5 transition-colors"
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
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>

      <DeleteModal
        show={showDelete}
        title="Delete Order"
        itemName={`Order #${order.orderNumber}`}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        processing={deleteLoading}
      />
    </div>
  );
}
