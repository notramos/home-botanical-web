import { cn } from "@/lib/utils";
import { statusColors } from "@/lib/utils";

type BadgeVariant = keyof typeof statusColors | "default";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const color =
    variant !== "default" && statusColors[variant]
      ? statusColors[variant]
      : { bg: "rgba(142, 195, 179, 0.15)", text: "var(--color-accent-green)" };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        className
      )}
      style={{
        backgroundColor: color.bg,
        color: color.text,
      }}
    >
      {children}
    </span>
  );
}
