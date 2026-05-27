"use client";

import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "@/components/shared/icons";
import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, label, error, options, placeholder, id, ...props },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-text-muted"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "w-full appearance-none rounded-lg border border-accent-green/15 bg-bg-main px-4 py-2.5 pr-10 text-sm text-text-light",
              "transition-colors duration-200",
              "focus:outline-none focus:border-accent-green/50 focus:ring-1 focus:ring-accent-green/30",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error && "border-danger/50 focus:border-danger focus:ring-danger/30",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-muted">
            <ChevronDownIcon className="w-4 h-4" />
          </div>
        </div>
        {error && <p className="text-xs text-danger/90">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
