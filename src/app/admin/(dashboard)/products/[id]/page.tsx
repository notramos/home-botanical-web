import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatPrice, formatDateTime, categories } from "@/lib/utils";
import StatusBadge from "@/components/admin/status-badge";
import TransactionLog from "@/components/admin/transaction-log";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

const plantTypeLabels: Record<string, string> = {
  indoor: "Indoor",
  outdoor: "Outdoor",
  both: "Indoor & Outdoor",
};

const categoryLabels = Object.fromEntries(
  categories.map((c) => [c.value, c.label])
);

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const productId = parseInt(id);
  if (isNaN(productId)) notFound();

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product || product.deletedAt) notFound();

  const transactions = await prisma.transactionLog.findMany({
    where: { referenceId: product.id, type: "product" },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const infoRows: { label: string; value: string }[] = [
    { label: "SKU", value: product.sku || "—" },
    { label: "Slug", value: product.slug },
    { label: "Scientific Name", value: product.scientificName || "—" },
    { label: "Category", value: categoryLabels[product.category || ""] || product.category || "—" },
    { label: "Plant Type", value: plantTypeLabels[product.plantType] || product.plantType },
    { label: "Light", value: product.lightRequirement || "—" },
    { label: "Water", value: product.waterRequirement || "—" },
    { label: "Featured", value: product.isFeatured ? "Yes" : "No" },
    { label: "Views", value: String(product.viewCount) },
    { label: "Created", value: formatDateTime(product.createdAt, "id") },
    { label: "Updated", value: formatDateTime(product.updatedAt, "id") },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/products"
              className="text-text-muted hover:text-text-light transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </Link>
            <h1 className="font-heading text-3xl font-semibold text-text-light">
              {product.name}
            </h1>
            <StatusBadge status={product.status} />
          </div>
          {product.scientificName && (
            <p className="text-sm text-text-muted mt-1 italic">
              {product.scientificName}
            </p>
          )}
        </div>
        <Link
          href={`/admin/products/${product.id}/edit`}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent-green text-bg-main text-sm font-medium rounded-lg hover:bg-accent-light transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
          Edit Product
        </Link>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          {product.image && (
            <div className="bg-bg-soft rounded-xl border border-accent-green/10 overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div className="bg-bg-soft rounded-xl border border-accent-green/10 p-6">
              <h2 className="text-lg font-heading font-semibold text-accent-green mb-3">
                Description
              </h2>
              <p className="text-sm text-text-light whitespace-pre-wrap leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Care Instructions */}
          {product.careInstructions && (
            <div className="bg-bg-soft rounded-xl border border-accent-green/10 p-6">
              <h2 className="text-lg font-heading font-semibold text-accent-green mb-3">
                Care Instructions
              </h2>
              <p className="text-sm text-text-light whitespace-pre-wrap leading-relaxed">
                {product.careInstructions}
              </p>
            </div>
          )}

          {/* Transaction History */}
          <div className="bg-bg-soft rounded-xl border border-accent-green/10 p-6">
            <h2 className="text-lg font-heading font-semibold text-accent-green mb-4">
              Transaction History
            </h2>
            {transactions.length === 0 ? (
              <p className="text-sm text-text-muted">No transactions recorded.</p>
            ) : (
              <div className="divide-y divide-accent-green/10">
                {transactions.map((tx) => (
                  <TransactionLog key={tx.id} entry={tx} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <div className="bg-bg-soft rounded-xl border border-accent-green/10 p-6">
            <h2 className="text-lg font-heading font-semibold text-accent-green mb-4">
              Pricing & Stock
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-text-muted mb-1">Price</p>
                <p className="text-2xl font-heading font-bold text-accent-green">
                  {formatPrice(Number(product.price), "IDR")}
                </p>
              </div>
              {product.originalPrice && Number(product.originalPrice) > 0 && (
                <div>
                  <p className="text-xs text-text-muted mb-1">Original Price</p>
                  <p className="text-sm text-text-muted line-through">
                    {formatPrice(Number(product.originalPrice), "IDR")}
                  </p>
                  {Number(product.originalPrice) > Number(product.price) && (
                    <p className="text-xs text-success font-medium mt-1">
                      {Math.round(
                        (1 - Number(product.price) / Number(product.originalPrice)) * 100
                      )}
                      % off
                    </p>
                  )}
                </div>
              )}
              <div>
                <p className="text-xs text-text-muted mb-1">Stock</p>
                <p className="text-sm font-medium text-text-light">{product.stock}</p>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-bg-soft rounded-xl border border-accent-green/10 p-6">
            <h2 className="text-lg font-heading font-semibold text-accent-green mb-4">
              Details
            </h2>
            <dl className="space-y-3">
              {infoRows.map((row) => (
                <div key={row.label}>
                  <dt className="text-xs text-text-muted">{row.label}</dt>
                  <dd className="text-sm text-text-light mt-0.5">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
