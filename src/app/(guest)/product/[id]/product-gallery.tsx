"use client";

import Image from "next/image";
import { useState } from "react";
import { resolveProductImage } from "@/lib/utils";

interface ProductGalleryProps {
  productId: number;
  name: string;
  image?: string | null;
  hasDiscount: boolean;
  discountPercent: number;
}

export function ProductGallery({
  productId,
  name,
  image,
  hasDiscount,
  discountPercent,
}: ProductGalleryProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-black/5">
      {!imgError ? (
        <>
          <Image
            src={resolveProductImage(image, productId, 600)}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald/25 to-transparent pointer-events-none" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald/10 to-forest/15">
          <div className="flex items-center justify-center h-full">
            <svg className="w-16 h-16 text-forest/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
            </svg>
          </div>
        </div>
      )}
      {hasDiscount && (
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-danger text-white text-xs font-bold">
          -{discountPercent}%
        </div>
      )}
    </div>
  );
}
