"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  label?: string;
  error?: string;
  prefix?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, prefix, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-muted"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-muted">
              {prefix}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-lg border border-accent-green/15 bg-bg-main px-4 py-2.5 text-sm text-text-light",
              "placeholder:text-text-muted/60",
              "transition-colors duration-200",
              "focus:outline-none focus:border-accent-green/50 focus:ring-1 focus:ring-accent-green/30",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error && "border-danger/50 focus:border-danger focus:ring-danger/30",
              prefix && "pl-10",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-danger/90">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
