import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatPrice, cn } from "@/lib/utils";
import { StarIcon, ChevronLeftIcon } from "@/components/shared/icons";
import { Badge } from "@/components/ui/badge";
import { AddToCart } from "./add-to-cart";
import { ProductGallery } from "./product-gallery";
import Link from "next/link";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = parseInt(id, 10);

  if (isNaN(productId)) notFound();

  let product;
  try {
    product = await prisma.product.findUnique({
      where: { id: productId },
    });
  } catch {
    notFound();
  }

  if (!product || product.status !== "active") notFound();

  const price = Number(product.price);
  const originalPrice = product.originalPrice ? Number(product.originalPrice) : null;

  const hasDiscount = !!(originalPrice && originalPrice > price);
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice! - price) / originalPrice!) * 100)
    : 0;

  return (
    <>
      {/* Breadcrumb */}
      <section className="pt-24 pb-4 md:pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-text-muted mb-2">
            <Link href="/" className="hover:text-emerald transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/catalog"
              className="hover:text-emerald transition-colors"
            >
              Catalog
            </Link>
            {product.category && (
              <>
                <span>/</span>
                <Link
                  href={`/catalog?category=${product.category}`}
                  className="hover:text-emerald transition-colors"
                >
                  {product.category.replace(/_/g, " ")}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-text-light">{product.name}</span>
          </nav>

          <Link
            href="/catalog"
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-emerald transition-colors"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Back to Catalog
          </Link>
        </div>
      </section>

      {/* Product Detail */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <ProductGallery
                productId={product.id}
                name={product.name}
                hasDiscount={hasDiscount}
                discountPercent={discountPercent}
              />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category + Badge */}
              <div className="flex items-center gap-3">
                {product.category && (
                  <Badge variant="default" className="capitalize">
                    {product.category.replace(/_/g, " ")}
                  </Badge>
                )}
                <Badge variant={product.stock > 0 ? "default" : "outline"}>
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>

              {/* Name + Scientific Name */}
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-text-light leading-tight">
                  {product.name}
                </h1>
                {product.scientificName && (
                  <p className="text-text-muted italic mt-1">
                    {product.scientificName}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl md:text-4xl font-heading font-bold text-emerald">
                  {formatPrice(price)}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-text-muted line-through">
                    {formatPrice(originalPrice!)}
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-text-muted leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Care Details */}
              {(product.lightRequirement ||
                product.waterRequirement ||
                product.careInstructions) && (
                <div className="space-y-3 p-5 rounded-xl bg-bg-soft/50 border border-black/5">
                  <h3 className="text-sm font-heading font-semibold text-text-light uppercase tracking-wider">
                    Care Details
                  </h3>
                  {product.lightRequirement && (
                    <div className="flex items-start gap-3">
                      <span className="text-emerald text-lg mt-0.5">☀</span>
                      <div>
                        <p className="text-xs text-text-muted uppercase tracking-wider">
                          Light
                        </p>
                        <p className="text-sm text-text-light">
                          {product.lightRequirement}
                        </p>
                      </div>
                    </div>
                  )}
                  {product.waterRequirement && (
                    <div className="flex items-start gap-3">
                      <span className="text-emerald text-lg mt-0.5">💧</span>
                      <div>
                        <p className="text-xs text-text-muted uppercase tracking-wider">
                          Water
                        </p>
                        <p className="text-sm text-text-light">
                          {product.waterRequirement}
                        </p>
                      </div>
                    </div>
                  )}
                  {product.careInstructions && (
                    <div className="flex items-start gap-3">
                      <span className="text-emerald text-lg mt-0.5">🌱</span>
                      <div>
                        <p className="text-xs text-text-muted uppercase tracking-wider">
                          Care
                        </p>
                        <p className="text-sm text-text-light">
                          {product.careInstructions}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Plant type */}
              {product.plantType && (
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <span className="capitalize">
                    {product.plantType === "both"
                      ? "Indoor / Outdoor"
                      : product.plantType}
                  </span>
                  <span className="text-white/10">|</span>
                  <span>SKU: {product.sku || "N/A"}</span>
                </div>
              )}

              {/* Add to Cart */}
              <div className="pt-2">
                <AddToCart
                  product={{
                    id: product.id,
                    name: product.name,
                    price,
                    originalPrice: originalPrice ?? undefined,
                    image: product.image ?? undefined,
                    category: product.category ?? undefined,
                    stock: product.stock,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-black/5 pt-12">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-text-light mb-8">
              Customer Reviews
            </h2>
            <div className="text-center py-12 border border-black/5 rounded-2xl bg-bg-soft/20">
              <StarIcon className="w-10 h-10 text-text-muted/30 mx-auto mb-3" />
              <p className="text-text-muted text-sm">
                No reviews yet. Be the first to review this plant!
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
