"use client";

import { useState } from "react";
import { useCartStore } from "@/stores/cart-store";
import { MinusIcon, PlusIcon } from "@/components/shared/icons";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface AddToCartProps {
  product: {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    image?: string;
    category?: string;
    stock: number;
  };
}

export function AddToCart({ product }: AddToCartProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Quantity selector */}
      <div>
        <p className="text-sm text-text-muted mb-2">Quantity</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            disabled={qty <= 1}
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-black/10 text-text-light hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Decrease quantity"
          >
            <MinusIcon className="w-4 h-4" />
          </button>
          <span className="w-10 text-center text-lg font-medium text-text-light">
            {qty}
          </span>
          <button
            onClick={() => setQty(Math.min(product.stock, qty + 1))}
            disabled={qty >= product.stock}
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-black/10 text-text-light hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Increase quantity"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add to cart button */}
      <button
        onClick={handleAdd}
        className={cn(
          "w-full h-12 rounded-lg font-medium text-sm transition-all duration-200",
          added
            ? "bg-success text-white"
            : "bg-accent-green text-bg-main hover:bg-accent-light shadow-lg shadow-accent-green/20"
        )}
      >
        {added ? "Added to Cart!" : "Add to Cart"}
      </button>

      {/* Stock info */}
      <p className="text-xs text-text-muted">
        {product.stock > 10
          ? "✓ In Stock"
          : product.stock > 0
            ? `Only ${product.stock} left`
            : "Out of Stock"}
      </p>
    </div>
  );
}
