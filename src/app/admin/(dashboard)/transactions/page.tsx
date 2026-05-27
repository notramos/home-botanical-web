import { getTransactions } from "@/actions";
import Link from "next/link";
import { formatDateTime } from "@/lib/utils";
import TransactionLog from "@/components/admin/transaction-log";

interface TransactionsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function TransactionsPage({ searchParams }: TransactionsPageProps) {
  const sp = await searchParams;
  const page = sp.page ? parseInt(sp.page) : 1;

  const { data, pagination } = await getTransactions({ page, perPage: 20 });

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-text-light">Transactions</h1>
          <p className="text-sm text-text-muted mt-1">Activity log for all operations</p>
        </div>
      </div>

      <div className="bg-bg-soft rounded-xl border border-accent-green/10">
        {data.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-text-muted">No transactions recorded.</p>
          </div>
        ) : (
          <div className="divide-y divide-accent-green/10">
            {data.map((entry) => (
              <Link
                key={entry.id}
                href={`/admin/transactions/${entry.id}`}
                className="block hover:bg-accent-green/[1%] transition-colors"
              >
                <TransactionLog entry={entry} />
              </Link>
            ))}
          </div>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-text-muted">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
          </p>
          <div className="flex items-center gap-1">
            {pagination.page > 1 && (
              <Link
                href={`/admin/transactions?page=${pagination.page - 1}`}
                className="px-3 py-1.5 text-xs rounded-lg text-text-muted hover:text-accent-green hover:bg-accent-green/[3%] transition-colors"
              >
                Prev
              </Link>
            )}
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === pagination.totalPages ||
                  Math.abs(p - pagination.page) <= 2
              )
              .map((p, idx, arr) => {
                const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                return (
                  <span key={p} className="flex items-center">
                    {showEllipsis && (
                      <span className="px-1 text-text-muted text-xs">...</span>
                    )}
                    <Link
                      href={`/admin/transactions?page=${p}`}
                      className={`w-7 h-7 flex items-center justify-center text-xs rounded-lg transition-colors ${
                        p === pagination.page
                          ? "bg-accent-green/10 text-accent-light font-semibold"
                          : "text-text-muted hover:text-accent-green hover:bg-accent-green/[3%]"
                      }`}
                    >
                      {p}
                    </Link>
                  </span>
                );
              })}
            {pagination.page < pagination.totalPages && (
              <Link
                href={`/admin/transactions?page=${pagination.page + 1}`}
                className="px-3 py-1.5 text-xs rounded-lg text-text-muted hover:text-accent-green hover:bg-accent-green/[3%] transition-colors"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
