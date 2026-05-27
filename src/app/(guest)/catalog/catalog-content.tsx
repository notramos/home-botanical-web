"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterBar } from "@/components/guest/filter-bar";
import { ProductCard } from "@/components/guest/product-card";
import { Pagination } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { EmptyIcon } from "@/components/shared/icons";

interface CatalogContentProps {
  products: any[];
  pagination: { page: number; totalPages: number; total: number };
  defaultSearch: string;
  defaultCategory: string;
  defaultPrice: string;
}

export function CatalogContent({
  products,
  pagination,
  defaultSearch,
  defaultCategory,
  defaultPrice,
}: CatalogContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(defaultSearch);
  const [activeCategory, setActiveCategory] = useState(defaultCategory);

  const defaultPriceRange: [number, number] = defaultPrice
    ? (defaultPrice.split("-").map(Number) as [number, number])
    : [0, 200];
  const [priceRange, setPriceRange] =
    useState<[number, number]>(defaultPriceRange);

  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
    setActiveCategory(searchParams.get("category") || "");
    const price = searchParams.get("price") || "";
    if (price) {
      setPriceRange(price.split("-").map(Number) as [number, number]);
    } else {
      setPriceRange([0, 200]);
    }
  }, [searchParams]);

  const buildParams = useCallback(
    (overrides: Record<string, string | undefined>) => {
      const params = new URLSearchParams();
      const currentSearch = searchParams.get("search");
      const currentCategory = searchParams.get("category");
      const currentPrice = searchParams.get("price");
      const currentPage = searchParams.get("page");

      if (currentSearch) params.set("search", currentSearch);
      if (currentCategory) params.set("category", currentCategory);
      if (currentPrice) params.set("price", currentPrice);
      if (currentPage) params.set("page", currentPage);

      Object.entries(overrides).forEach(([key, value]) => {
        if (value && value !== "") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      return params.toString();
    },
    [searchParams],
  );

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    const qs = buildParams({ search: q || undefined, page: undefined });
    router.push(`/catalog?${qs}`);
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    const qs = buildParams({ category: cat || undefined, page: undefined });
    router.push(`/catalog?${qs}`);
  };

  const handlePriceChange = (range: [number, number]) => {
    setPriceRange(range);
    const priceStr = `${range[0]}-${range[1]}`;
    const qs = buildParams({
      price: priceStr === "0-200" ? undefined : priceStr,
      page: undefined,
    });
    router.push(`/catalog?${qs}`);
  };

  const handlePageChange = (p: number) => {
    const qs = buildParams({ page: String(p) });
    router.push(`/catalog?${qs}`);
  };

  const filteredProducts = products.filter((p) => {
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    return true;
  });

  const mappedProducts = filteredProducts.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    originalPrice: p.originalPrice ?? undefined,
    image: p.image ?? undefined,
    category: p.category ?? undefined,
  }));

  return (
    <div className="space-y-8">
      {/* Filter Bar */}
      <FilterBar
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onPriceChange={handlePriceChange}
        activeCategory={activeCategory}
        searchQuery={searchQuery}
        priceRange={priceRange}
      />

      {/* Product count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-muted">
          {pagination.total > 0
            ? `Showing ${mappedProducts.length} of ${pagination.total} plants`
            : "No plants found"}
        </p>
      </div>

      {/* Product Grid */}
      {mappedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mappedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <EmptyIcon className="w-16 h-16 text-text-muted/30 mb-4" />
          <h3 className="text-lg font-heading font-semibold text-text-light mb-2">
            No Plants Found
          </h3>
          <p className="text-sm text-text-muted max-w-sm">
            Try adjusting your filters or search terms to find what you are
            looking for.
          </p>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
        className="pt-4"
      />
    </div>
  );
}
