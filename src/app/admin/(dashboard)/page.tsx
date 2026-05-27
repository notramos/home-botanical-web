import { getDashboardStats } from "@/actions";
import StatCard from "@/components/admin/stat-card";
import TransactionLog from "@/components/admin/transaction-log";

const productIcons = {
  total: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  ),
  active: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  draft: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  outOfStock: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  ),
};

const orderIcons = {
  total: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  pending: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  processing: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0zm7.5 1.5V12m0-3v.266M12 12a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  completed: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const { productStats, orderStats, transactionStats } = stats;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="font-heading text-3xl font-semibold text-text-light">Dashboard</h1>
        <p className="text-sm text-text-muted mt-1">Overview of your store</p>
      </div>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-text-muted mb-4">
          Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard name="Total Products" value={productStats.total} icon={productIcons.total} accent="var(--color-accent-green)" />
          <StatCard name="Active" value={productStats.active} icon={productIcons.active} accent="var(--color-success)" />
          <StatCard name="Draft" value={productStats.draft} icon={productIcons.draft} accent="var(--color-accent-gold)" />
          <StatCard name="Out of Stock" value={productStats.outOfStock} icon={productIcons.outOfStock} accent="var(--color-danger)" />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-text-muted mb-4">
          Orders
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard name="Total Orders" value={orderStats.total} icon={orderIcons.total} accent="var(--color-accent-green)" />
          <StatCard name="Pending" value={orderStats.pending} icon={orderIcons.pending} accent="var(--color-accent-gold)" />
          <StatCard name="Processing" value={orderStats.processing} icon={orderIcons.processing} accent="var(--color-info)" />
          <StatCard name="Completed" value={orderStats.completed} icon={orderIcons.completed} accent="var(--color-success)" />
          <StatCard
            name="Revenue"
            value={`Rp ${(orderStats.revenue || 0).toLocaleString("id-ID")}`}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            accent="var(--color-accent-gold)"
          />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-text-muted">
            Recent Transactions
          </h2>
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span>Today: {transactionStats.today}</span>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <span>Week: {transactionStats.thisWeek}</span>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <span>Total: {transactionStats.total}</span>
          </div>
        </div>
        <div className="bg-bg-soft rounded-xl border border-white/5 divide-y divide-white/5">
          {transactionStats.recent.length === 0 ? (
            <div className="py-12 text-center text-sm text-text-muted">No recent transactions</div>
          ) : (
            transactionStats.recent.map((entry) => (
              <TransactionLog key={entry.id} entry={entry} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
