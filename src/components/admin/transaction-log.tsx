import { formatDateTime } from "@/lib/utils";

interface TransactionLogEntry {
  id: number;
  type: string;
  action: string;
  referenceId: number;
  referenceNumber: string | null;
  description: string;
  performedBy: string | null;
  createdAt: Date;
}

interface TransactionLogProps {
  entry: TransactionLogEntry;
}

const typeConfig: Record<
  string,
  { icon: React.ReactNode; bg: string; border: string }
> = {
  product: {
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
      </svg>
    ),
    bg: "rgba(74, 124, 89, 0.1)",
    border: "rgba(74, 124, 89, 0.3)",
  },
  order: {
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    bg: "rgba(59, 130, 246, 0.1)",
    border: "rgba(59, 130, 246, 0.3)",
  },
  payment: {
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bg: "rgba(196, 163, 90, 0.1)",
    border: "rgba(196, 163, 90, 0.3)",
  },
};

const defaultConfig = {
  icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  bg: "rgba(156, 163, 175, 0.1)",
  border: "rgba(156, 163, 175, 0.3)",
};

export default function TransactionLog({ entry }: TransactionLogProps) {
  const config = typeConfig[entry.type] || defaultConfig;

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent-green/[1%] transition-colors group">
      {/* Type Icon */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{
          backgroundColor: config.bg,
          border: `1px solid ${config.border}`,
        }}
      >
        {config.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-accent-green group-hover:text-accent-light transition-colors">
          {entry.description}
        </p>
        <div className="flex items-center gap-2 mt-1 text-xs text-accent-green/60">
          {entry.referenceNumber && (
            <>
              <span className="font-mono text-accent-green/80">
                #{entry.referenceNumber}
              </span>
              <span className="w-1 h-1 rounded-full bg-accent-green/20" />
            </>
          )}
          {entry.performedBy && (
            <>
              <span>{entry.performedBy}</span>
              <span className="w-1 h-1 rounded-full bg-accent-green/20" />
            </>
          )}
          <span>{formatDateTime(entry.createdAt, "id")}</span>
        </div>
      </div>

      {/* Type label */}
      <span
        className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
        style={{
          backgroundColor: config.bg,
          color: config.border.replace("0.3", "1"),
        }}
      >
        {entry.type}
      </span>
    </div>
  );
}
