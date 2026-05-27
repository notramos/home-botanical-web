"use client";

import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "number" | "email" | "select" | "textarea" | "checkbox" | "url";
  value: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
  error?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  prefix?: string;
  disabled?: boolean;
  hint?: string;
  imagePreview?: boolean;
}

export default function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  options,
  rows = 4,
  prefix,
  disabled,
  hint,
  imagePreview,
}: FormFieldProps) {
  const baseInputClasses =
    "w-full bg-bg-main border rounded-lg px-3 py-2.5 text-sm text-accent-green placeholder:text-accent-green/50 focus:outline-none focus:ring-2 focus:ring-accent-green/40 focus:border-accent-green transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const errorClasses = error ? "border-danger focus:ring-danger/40 focus:border-danger" : "border-accent-green/15 hover:border-accent-green/30";

  const id = `field-${name}`;

  const renderInput = () => {
    switch (type) {
      case "select":
        return (
          <select
            id={id}
            name={name}
            value={String(value)}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={cn(baseInputClasses, errorClasses, "appearance-none cursor-pointer")}
          >
            <option value="" disabled>
              {placeholder || `Select ${label}`}
            </option>
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case "textarea":
        return (
          <textarea
            id={id}
            name={name}
            value={String(value)}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            className={cn(baseInputClasses, errorClasses, "resize-vertical min-h-[80px]")}
          />
        );

      case "checkbox":
        return (
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              id={id}
              name={name}
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => onChange(e.target.checked)}
              disabled={disabled}
              className="w-4 h-4 rounded border-accent-green/20 bg-bg-main text-accent-green focus:ring-accent-green/40 focus:ring-2 transition-colors"
            />
            <span className="text-sm text-accent-green group-hover:text-accent-light transition-colors">
              {label}
            </span>
          </label>
        );

      case "url":
        return (
          <div className="space-y-2">
            <div className="relative">
              <input
                id={id}
                name={name}
                type="url"
                value={String(value)}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder || "https://"}
                disabled={disabled}
                className={cn(baseInputClasses, errorClasses, "pl-9")}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-green/50">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
              </div>
            </div>
            {imagePreview && typeof value === "string" && value && (
              <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-accent-green/10 bg-bg-main">
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' fill='%23a8c4bb'%3E%3Crect width='96' height='96' fill='%23f5f2eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='10'%3ENo Image%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="relative">
            {prefix && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-green/50 text-sm font-medium pointer-events-none">
                {prefix}
              </div>
            )}
            <input
              id={id}
              name={name}
              type={type}
              value={String(value)}
              onChange={(e) =>
                onChange(type === "number" ? Number(e.target.value) : e.target.value)
              }
              placeholder={placeholder}
              disabled={disabled}
              className={cn(baseInputClasses, errorClasses, prefix && "pl-10")}
            />
          </div>
        );
    }
  };

  if (type === "checkbox") {
    return (
      <div className="space-y-1">
        {renderInput()}
        {hint && !error && (
          <p className="text-xs text-accent-green/60">{hint}</p>
        )}
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-accent-green"
      >
        {label}
      </label>
      {renderInput()}
      {hint && !error && (
        <p className="text-xs text-[--color-text-muted]">{hint}</p>
      )}
      {error && <p className="text-xs text-[--color-danger]">{error}</p>}
    </div>
  );
}
