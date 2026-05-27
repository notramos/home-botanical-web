import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDateTime } from "@/lib/utils";
import StatusBadge from "@/components/admin/status-badge";

interface TransactionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TransactionDetailPage({ params }: TransactionDetailPageProps) {
  const { id } = await params;
  const txId = parseInt(id);
  if (isNaN(txId)) notFound();

  const tx = await prisma.transactionLog.findUnique({ where: { id: txId } });
  if (!tx) notFound();

  const actionColors: Record<string, string> = {
    create: "var(--color-success)",
    update: "var(--color-info)",
    delete: "var(--color-danger)",
    toggle_featured: "var(--color-accent-gold)",
    status_change: "var(--color-accent-gold)",
    payment: "var(--color-accent-green)",
  };

  const actionColor = actionColors[tx.action] || "var(--color-text-muted)";

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/transactions"
            className="text-text-muted hover:text-text-light transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <h1 className="font-heading text-3xl font-semibold text-text-light">
            Transaction Detail
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-bg-soft rounded-xl border border-white/5 p-6">
            <h2 className="text-lg font-heading font-semibold text-text-light mb-4">Description</h2>
            <p className="text-sm text-text-light">{tx.description}</p>
          </div>

          {tx.oldValues && (
            <div className="bg-bg-soft rounded-xl border border-white/5 p-6">
              <h2 className="text-lg font-heading font-semibold text-text-light mb-4">Old Values</h2>
              <pre className="text-xs text-text-muted bg-bg-main rounded-lg p-4 overflow-x-auto max-h-64 overflow-y-auto font-mono">
                {JSON.stringify(tx.oldValues, null, 2)}
              </pre>
            </div>
          )}

          {tx.newValues && (
            <div className="bg-bg-soft rounded-xl border border-white/5 p-6">
              <h2 className="text-lg font-heading font-semibold text-text-light mb-4">New Values</h2>
              <pre className="text-xs text-text-muted bg-bg-main rounded-lg p-4 overflow-x-auto max-h-64 overflow-y-auto font-mono">
                {JSON.stringify(tx.newValues, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-bg-soft rounded-xl border border-white/5 p-6">
            <h2 className="text-lg font-heading font-semibold text-text-light mb-4">Details</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-text-muted text-xs">Type</dt>
                <dd>
                  <span
                    className="inline-block px-2 py-0.5 text-xs font-medium rounded-full mt-1"
                    style={{
                      backgroundColor: `${actionColor}15`,
                      color: actionColor,
                      border: `1px solid ${actionColor}30`,
                    }}
                  >
                    {tx.type}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-text-muted text-xs">Action</dt>
                <dd className="text-text-light capitalize mt-1">{tx.action.replace(/_/g, " ")}</dd>
              </div>
              {tx.referenceNumber && (
                <div>
                  <dt className="text-text-muted text-xs">Reference</dt>
                  <dd className="text-text-light font-mono text-xs mt-1">#{tx.referenceNumber}</dd>
                </div>
              )}
              <div>
                <dt className="text-text-muted text-xs">Reference ID</dt>
                <dd className="text-text-light mt-1">{tx.referenceId}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-bg-soft rounded-xl border border-white/5 p-6">
            <h2 className="text-lg font-heading font-semibold text-text-light mb-4">Audit</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-text-muted text-xs">Performed By</dt>
                <dd className="text-text-light mt-1">{tx.performedBy || "System"}</dd>
              </div>
              <div>
                <dt className="text-text-muted text-xs">Created At</dt>
                <dd className="text-text-light mt-1">{formatDateTime(tx.createdAt, "id")}</dd>
              </div>
              <div>
                <dt className="text-text-muted text-xs">Updated At</dt>
                <dd className="text-text-light mt-1">{formatDateTime(tx.updatedAt, "id")}</dd>
              </div>
              {tx.ipAddress && (
                <div>
                  <dt className="text-text-muted text-xs">IP Address</dt>
                  <dd className="text-text-light font-mono text-xs mt-1">{tx.ipAddress}</dd>
                </div>
              )}
              {tx.userAgent && (
                <div>
                  <dt className="text-text-muted text-xs">User Agent</dt>
                  <dd className="text-text-light text-xs mt-1 break-all">{tx.userAgent}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
