"use client";

import { useCartStore } from "@/stores/cart-store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CloseIcon, PlusIcon, MinusIcon } from "@/components/shared/icons";
import { formatPrice, cn, getProductImageUrl } from "@/lib/utils";
import { useEffect, useCallback } from "react";

export function CartSidebar() {
  const { items, isOpen, setOpen, removeItem, updateQuantity, clearCart, total } =
    useCartStore();
  const router = useRouter();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    },
    [setOpen]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-full max-w-md bg-bg-soft border-l border-black/10 shadow-2xl transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/10">
          <h2 className="text-lg font-heading font-semibold text-text-light">
            Shopping Cart
            {items.length > 0 && (
              <span className="ml-2 text-sm text-text-muted font-normal">
                ({items.length} {items.length === 1 ? "item" : "items"})
              </span>
            )}
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-full text-text-muted hover:text-text-light hover:bg-black/5 transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100%-140px)] px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
            </div>
            <p className="text-text-muted mb-1">Your cart is empty</p>
            <p className="text-sm text-text-muted/60">
              Add some plants to get started
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-y-auto h-[calc(100%-220px)] px-6 py-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-xl bg-black/[0.02] border border-black/5"
                >
                  {/* Image */}
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={getProductImageUrl(item.id)}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald/25 to-transparent pointer-events-none" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-text-light truncate">
                      {item.name}
                    </h3>
                    {item.category && (
                      <p className="text-xs text-text-muted mt-0.5 capitalize">
                        {item.category}
                      </p>
                    )}
                    <p className="text-sm text-emerald font-medium mt-1">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Qty controls */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-text-muted hover:text-danger transition-colors"
                      aria-label={`Remove ${item.name}`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                    <div className="flex items-center gap-1.5 bg-black/5 rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.qty - 1)}
                        className="p-0.5 text-text-muted hover:text-text-light transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <MinusIcon className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center text-xs text-text-light font-medium">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.qty + 1)}
                        className="p-0.5 text-text-muted hover:text-text-light transition-colors"
                        aria-label="Increase quantity"
                      >
                        <PlusIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-black/10 bg-bg-soft px-6 py-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Subtotal</span>
                <span className="text-lg font-heading font-semibold text-emerald">
                  {formatPrice(total())}
                </span>
              </div>
              <p className="text-xs text-text-muted/60">
                Shipping & taxes calculated at checkout
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setOpen(false);
                    router.push("/checkout");
                  }}
                  className="flex-1 h-11 rounded-lg bg-emerald text-bg-main font-medium text-sm hover:bg-forest/90 transition-colors"
                >
                  Checkout
                </button>
                <button
                  onClick={clearCart}
                  className="px-4 h-11 rounded-lg border border-black/20 text-text-muted text-sm hover:text-danger hover:border-danger/50 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}
