import { ReactNode } from "react";

interface StatCardProps {
  name: string;
  value: string | number;
  sub?: string;
  icon: ReactNode;
  accent: string;
}

export default function StatCard({ name, value, sub, icon, accent }: StatCardProps) {
  return (
    <div className="relative bg-[--color-bg-soft] rounded-xl overflow-hidden group hover:bg-[--color-bg-warm] transition-colors duration-300">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-widest text-[--color-text-muted]">
              {name}
            </p>
            <p
              className="font-heading text-3xl font-semibold text-[--color-text-light] tabular-nums"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {value}
            </p>
            {sub && (
              <p className="text-xs text-[--color-text-muted]">{sub}</p>
            )}
          </div>
          <div
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: `${accent}15`,
              border: `1px solid ${accent}30`,
              color: accent,
            }}
          >
            {icon}
          </div>
        </div>
      </div>
      {/* Bottom accent bar */}
      <div
        className="h-0.5 w-full"
        style={{ backgroundColor: accent }}
      />
    </div>
  );
}
