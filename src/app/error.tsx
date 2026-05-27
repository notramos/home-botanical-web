"use client";

import { Button } from "@/components/ui/button";
import { LeafIcon } from "@/components/shared/icons";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main px-4">
      <div className="text-center max-w-md animate-scale-in">
        <div className="w-20 h-20 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-6">
          <LeafIcon className="w-10 h-10 text-danger" />
        </div>
        <h1 className="text-3xl font-heading font-bold text-text-light mb-3">
          Something Went Wrong
        </h1>
        <p className="text-text-muted mb-2 leading-relaxed">
          An unexpected error occurred. Please try again.
        </p>
        {error.digest && (
          <p className="text-xs text-text-muted/50 mb-8 font-mono">
            Error ID: {error.digest}
          </p>
        )}
        <Button onClick={reset} size="lg">
          Try Again
        </Button>
      </div>
    </div>
  );
}
