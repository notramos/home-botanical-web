"use client";

import Link from "next/link";
import Image from "next/image";
import { cn, formatPrice, getProductImageUrl } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { HeartIcon, StarIcon } from "@/components/shared/icons";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
  category?: string;
  rating?: number;
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;

  const discountPercent = hasDiscount
    ? Math.round(
        ((product.originalPrice! - product.price) / product.originalPrice!) *
          100,
      )
    : 0;

  const displayRating = product.rating ?? 4.5;

  return (
    <div
      className={cn(
        "group relative rounded-xl border border-black/10 bg-bg-soft overflow-hidden transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <Link
        href={`/product/${product.id}`}
        className="block relative aspect-[4/3] overflow-hidden"
      >
        {!imgError ? (
          <>
            <Image
              src={getProductImageUrl(product.id)}
              alt={product.name}
              fill
              className={cn(
                "object-cover transition-transform duration-500",
                isHovered && "scale-110",
              )}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald/25 to-transparent pointer-events-none" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald/10 to-sage/15">
            <svg
              className="w-12 h-12 text-text-muted/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 0 1 3.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </div>
        )}

        {/* Category badge */}
        {product.category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider bg-bg-main/70 backdrop-blur-md text-text-light border border-black/10">
            {product.category}
          </span>
        )}

        {/* Discount badge */}
        {hasDiscount && (
          <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold bg-danger text-white">
            -{discountPercent}%
          </span>
        )}

        {/* Rating badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/30 backdrop-blur-md">
          <StarIcon className="w-3 h-3 text-accent-gold fill-current" />
          <span className="text-[11px] font-medium text-text-light">
            {displayRating}
          </span>
        </div>

        {/* Heart icon on hover */}
        <div
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full bg-black/30 backdrop-blur-md transition-all duration-300",
            isHovered
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-1",
          )}
        >
          <HeartIcon className="w-4 h-4 text-text-light hover:text-danger transition-colors" />
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 space-y-2">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm font-medium text-text-light group-hover:text-emerald transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-base font-heading font-semibold text-emerald">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-text-muted line-through">
              {formatPrice(product.originalPrice!)}
            </span>
          )}
        </div>

        <button
          onClick={() =>
            addItem({
              id: product.id,
              name: product.name,
              price: product.price,
              originalPrice: product.originalPrice,
              image: product.image,
              category: product.category,
            })
          }
          className="w-full h-9 rounded-lg bg-forest/10 border border-forest/20 text-forest text-sm font-medium hover:bg-emerald hover:text-bg-main transition-all duration-200"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
