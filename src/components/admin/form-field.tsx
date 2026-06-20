"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

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
  const id = `field-${name}`;

  const renderInput = () => {
    switch (type) {
      case "select":
        return (
          <Select
            value={String(value)}
            onValueChange={(v) => onChange(v)}
            disabled={disabled}
          >
            <SelectTrigger className={cn(error && "border-destructive")}>
              <SelectValue placeholder={placeholder || `Select ${label}`} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            className={cn(
              "flex min-h-[80px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 resize-y",
              error && "border-destructive"
            )}
          />
        );

      case "checkbox":
        return (
          <div className="flex items-center gap-3">
            <Checkbox
              id={id}
              checked={Boolean(value)}
              onCheckedChange={(checked) => onChange(checked === true)}
              disabled={disabled}
            />
            <Label htmlFor={id} className="text-sm font-normal cursor-pointer">
              {label}
            </Label>
          </div>
        );

      case "url":
        return (
          <div className="space-y-2">
            <div className="relative">
              <Input
                id={id}
                name={name}
                type="url"
                value={String(value)}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder || "https://"}
                disabled={disabled}
                className={cn(error && "border-destructive", "pl-9")}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
              </div>
            </div>
            {imagePreview && typeof value === "string" && value && (
              <div className="relative w-24 h-24 rounded-lg overflow-hidden border bg-muted">
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
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium pointer-events-none z-10">
                {prefix}
              </div>
            )}
            <Input
              id={id}
              name={name}
              type={type}
              value={String(value)}
              onChange={(e) =>
                onChange(type === "number" ? Number(e.target.value) : e.target.value)
              }
              placeholder={placeholder}
              disabled={disabled}
              className={cn(error && "border-destructive", prefix && "pl-10")}
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
          <p className="text-xs text-muted-foreground">{hint}</p>
        )}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {renderInput()}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
