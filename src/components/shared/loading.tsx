import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export function Loading({ size = "md", className, text }: LoadingProps) {
  const sizeMap = { sm: "w-5 h-5", md: "w-8 h-8", lg: "w-12 h-12" };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div
        className={cn(
          "border-2 rounded-full animate-spin",
          sizeMap[size],
          "border-white/10 border-t-accent-green"
        )}
      />
      {text && (
        <p className="text-sm text-text-muted">{text}</p>
      )}
    </div>
  );
}

export function LoadingPage({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loading size="lg" text={text} />
    </div>
  );
}

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-main/60 backdrop-blur-sm">
      <Loading size="lg" />
    </div>
  );
}
