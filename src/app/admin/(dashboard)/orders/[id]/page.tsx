import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatPrice, formatDateTime, orderStatusLabels, paymentStatusLabels } from "@/lib/utils";
import StatusBadge from "@/components/admin/status-badge";
import OrderStatusActions from "./order-status-actions";
import OrderPaymentForm from "./order-payment-form";
import TransactionLog from "@/components/admin/transaction-log";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const orderId = parseInt(id);
  if (isNaN(orderId)) notFound();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) notFound();

  const transactions = await prisma.transactionLog.findMany({
    where: { referenceId: order.id, type: { in: ["order", "payment"] } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/orders"
              className="text-text-muted hover:text-text-light transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </Link>
            <h1 className="font-heading text-3xl font-semibold text-text-light">
              Order #{order.orderNumber}
            </h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-sm text-text-muted mt-1">
            Created {formatDateTime(order.createdAt, "id")}
          </p>
        </div>
        <Link
          href={`/admin/orders/${order.id}/edit`}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent-green text-bg-main text-sm font-medium rounded-lg hover:bg-accent-light transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
          Edit Order
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-bg-soft rounded-xl border border-accent-green/10 p-6">
            <h2 className="text-lg font-heading font-semibold text-accent-green mb-4">Order Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-accent-green/10">
                    <th className="text-left py-2 pr-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Product</th>
                    <th className="text-left py-2 pr-4 text-xs font-semibold uppercase tracking-wider text-text-muted">SKU</th>
                    <th className="text-right py-2 pr-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Qty</th>
                    <th className="text-right py-2 pr-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Price</th>
                    <th className="text-right py-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-accent-green/10">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 pr-4 text-text-light">{item.productName}</td>
                      <td className="py-3 pr-4 text-text-muted">{item.productSku || "—"}</td>
                      <td className="py-3 pr-4 text-right text-text-light">{item.quantity}</td>
                      <td className="py-3 pr-4 text-right text-text-light">{formatPrice(Number(item.price), "IDR")}</td>
                      <td className="py-3 text-right text-text-light font-medium">{formatPrice(Number(item.subtotal), "IDR")}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-white/5">
                    <td colSpan={3} />
                    <td className="py-3 pr-4 text-right text-sm text-text-muted">Subtotal</td>
                    <td className="py-3 text-right text-text-light font-medium">{formatPrice(Number(order.subtotal), "IDR")}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} />
                    <td className="py-1 pr-4 text-right text-sm text-text-muted">Shipping</td>
                    <td className="py-1 text-right text-text-light">{formatPrice(Number(order.shippingCost), "IDR")}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} />
                    <td className="py-1 pr-4 text-right text-sm text-text-muted">Tax</td>
                    <td className="py-1 text-right text-text-light">{formatPrice(Number(order.tax), "IDR")}</td>
                  </tr>
                  <tr className="border-t border-white/5">
                    <td colSpan={3} />
                    <td className="py-3 pr-4 text-right font-semibold text-text-light">Total</td>
                    <td className="py-3 text-right font-semibold text-accent-green text-lg">{formatPrice(Number(order.total), "IDR")}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="bg-bg-soft rounded-xl border border-accent-green/10 p-6">
            <h2 className="text-lg font-heading font-semibold text-accent-green mb-4">
              Transaction History
            </h2>
            {transactions.length === 0 ? (
              <p className="text-sm text-text-muted">No transactions recorded.</p>
            ) : (
              <div className="divide-y divide-accent-green/10">
                {transactions.map((tx) => (
                  <TransactionLog key={tx.id} entry={tx} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-bg-soft rounded-xl border border-accent-green/10 p-6">
            <h2 className="text-lg font-heading font-semibold text-accent-green mb-4">Customer</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-text-muted text-xs">Name</p>
                <p className="text-text-light">{order.customerName}</p>
              </div>
              <div>
                <p className="text-text-muted text-xs">Email</p>
                <p className="text-text-light">{order.customerEmail}</p>
              </div>
              {order.customerPhone && (
                <div>
                  <p className="text-text-muted text-xs">Phone</p>
                  <p className="text-text-light">{order.customerPhone}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-bg-soft rounded-xl border border-accent-green/10 p-6">
            <h2 className="text-lg font-heading font-semibold text-accent-green mb-4">Shipping</h2>
            <p className="text-sm text-text-light whitespace-pre-wrap">
              {order.shippingAddress || "No address provided"}
            </p>
          </div>

          <div className="bg-bg-soft rounded-xl border border-accent-green/10 p-6">
            <h2 className="text-lg font-heading font-semibold text-accent-green mb-4">Payment</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-text-muted text-xs">Status</p>
                <div className="mt-1">
                  <StatusBadge status={order.paymentStatus} />
                </div>
              </div>
              {order.paymentMethod && (
                <div>
                  <p className="text-text-muted text-xs">Method</p>
                  <p className="text-text-light">{order.paymentMethod}</p>
                </div>
              )}
              {order.paymentReference && (
                <div>
                  <p className="text-text-muted text-xs">Reference</p>
                  <p className="text-text-light font-mono text-xs">{order.paymentReference}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-bg-soft rounded-xl border border-accent-green/10 p-6">
            <h2 className="text-lg font-heading font-semibold text-accent-green mb-4">Status</h2>
            <OrderStatusActions orderId={order.id} currentStatus={order.status} />
          </div>

          <div className="bg-bg-soft rounded-xl border border-accent-green/10 p-6">
            <h2 className="text-lg font-heading font-semibold text-accent-green mb-4">Update Payment</h2>
            <OrderPaymentForm
              orderId={order.id}
              currentPaymentStatus={order.paymentStatus}
              currentPaymentMethod={order.paymentMethod}
              currentPaymentReference={order.paymentReference}
            />
          </div>

          {order.notes && (
            <div className="bg-bg-soft rounded-xl border border-accent-green/10 p-6">
              <h2 className="text-lg font-heading font-semibold text-accent-green mb-4">Notes</h2>
              <p className="text-sm text-text-light whitespace-pre-wrap">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
