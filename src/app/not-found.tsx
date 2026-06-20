import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LeafIcon } from "@/components/shared/icons";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-6">
          <LeafIcon className="w-10 h-10 text-emerald" />
        </div>
        <h1 className="text-6xl font-heading font-bold text-emerald mb-4">
          404
        </h1>
        <h2 className="text-2xl font-heading font-bold text-text-light mb-3">
          Page Not Found
        </h2>
        <p className="text-text-muted mb-8 leading-relaxed">
          Looks like this leaf has blown away. The page you&apos;re looking for
          doesn&apos;t exist or has been moved.
        </p>
        <Button asChild size="lg">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
