"use client";

import { cn } from "@/lib/utils";

interface FilterOption {
  key: string;
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  filterOptions: FilterOption[];
}

export default function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters,
  onFilterChange,
  filterOptions,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-green/50 pointer-events-none">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full bg-bg-soft border border-accent-green/15 rounded-lg pl-10 pr-3 py-2.5 text-sm text-accent-green placeholder:text-accent-green/50 focus:outline-none focus:ring-2 focus:ring-accent-green/40 focus:border-accent-green transition-all"
        />
        {searchValue && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-accent-green/50 hover:text-accent-green transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {filterOptions.map((filter) => (
          <select
            key={filter.key}
            value={filters[filter.key] || ""}
            onChange={(e) => onFilterChange(filter.key, e.target.value)}
            className="bg-bg-soft border border-accent-green/15 rounded-lg px-3 py-2.5 text-sm text-accent-green focus:outline-none focus:ring-2 focus:ring-accent-green/40 focus:border-accent-green transition-all appearance-none cursor-pointer min-w-[130px]"
          >
            <option value="">
              {filter.placeholder || `All ${filter.label}`}
            </option>
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}

        {/* Active filter count */}
        {Object.values(filters).some((v) => v) && (
          <button
            type="button"
            onClick={() => {
              filterOptions.forEach((f) => onFilterChange(f.key, ""));
            }}
            className="px-3 py-2.5 text-xs font-medium text-accent-green/60 hover:text-accent-green transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
