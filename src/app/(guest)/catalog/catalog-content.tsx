"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterBar } from "@/components/guest/filter-bar";
import { ProductCard } from "@/components/guest/product-card";
import { Pagination } from "@/components/ui/pagination";
import { cn, categories } from "@/lib/utils";
import Link from "next/link";
import { EmptyIcon, ChevronDownIcon } from "@/components/shared/icons";

const categoryIcons: Record<string, string> = {
  succulents: "\ud83c\udf35",
  tropical: "\ud83c\udf34",
  herbs: "\ud83c\udf3f",
  ferns: "\ud83c\udf43",
  flowering: "\ud83c\udf38",
  air_plants: "\ud83e\udeb4",
  pots: "\ud83c\udffa",
  tools: "\ud83d\udd27",
};

const pricePresets = [
  { label: "Under $50", value: [0, 50] as [number, number] },
  { label: "$50 \u2014 $100", value: [50, 100] as [number, number] },
  { label: "$100+", value: [100, 200] as [number, number] },
];

interface CatalogContentProps {
  products: any[];
  pagination: { page: number; totalPages: number; total: number };
  defaultSearch: string;
  defaultCategory: string;
  defaultPrice: string;
}

type SortOption = "default" | "price-asc" | "price-desc" | "name-asc";
type ViewMode = "grid" | "list";

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
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

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

  const handleReset = () => {
    setSearchQuery("");
    setActiveCategory("");
    setPriceRange([0, 200]);
    router.push("/catalog");
  };

  const handleSort = (option: SortOption) => {
    setSortBy(option);
  };

  const hasActiveFilters = searchQuery || activeCategory || priceRange[0] > 0 || priceRange[1] < 200;

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      return true;
    });

    switch (sortBy) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [products, priceRange, sortBy]);

  const mappedProducts = filteredProducts.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    originalPrice: p.originalPrice ?? undefined,
    image: p.image ?? undefined,
    category: p.category ?? undefined,
  }));

  const activeCategoryLabel = categories.find((c) => c.value === activeCategory)?.label;

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <FilterBar
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onPriceChange={handlePriceChange}
        activeCategory={activeCategory}
        searchQuery={searchQuery}
        priceRange={priceRange}
      />

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {activeCategory && activeCategoryLabel && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald/10 text-emerald border border-emerald/20">
              {categoryIcons[activeCategory] && <span>{categoryIcons[activeCategory]}</span>}
              {activeCategoryLabel}
              <button
                onClick={() => handleCategoryChange("")}
                className="ml-0.5 hover:text-emerald/70 transition-colors"
              >
                &times;
              </button>
            </span>
          )}
          {(priceRange[0] > 0 || priceRange[1] < 200) && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald/10 text-emerald border border-emerald/20">
              ${priceRange[0]} &mdash; ${priceRange[1]}
              <button
                onClick={() => handlePriceChange([0, 200])}
                className="ml-0.5 hover:text-emerald/70 transition-colors"
              >
                &times;
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald/10 text-emerald border border-emerald/20">
              &ldquo;{searchQuery}&rdquo;
              <button
                onClick={() => handleSearchChange("")}
                className="ml-0.5 hover:text-emerald/70 transition-colors"
              >
                &times;
              </button>
            </span>
          )}
          <button
            onClick={handleReset}
            className="px-3 py-1 rounded-full text-xs font-medium text-text-muted hover:text-danger hover:bg-danger/5 border border-transparent hover:border-danger/20 transition-all"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Quick price presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-text-muted/60 font-medium uppercase tracking-wider mr-1">
          Quick:
        </span>
        {pricePresets.map((preset) => {
          const isActive =
            priceRange[0] === preset.value[0] &&
            priceRange[1] === preset.value[1];
          return (
            <button
              key={preset.label}
              onClick={() => handlePriceChange(isActive ? [0, 200] : preset.value)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-all duration-200",
                isActive
                  ? "bg-emerald text-bg-main"
                  : "bg-forest/5 text-text-muted hover:bg-forest/10 hover:text-forest",
              )}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {/* Toolbar: count + sort + view toggle */}
      <div className="flex items-center justify-between border-b border-forest/10 pb-4">
        <p className="text-sm text-text-muted">
          {pagination.total > 0 ? (
            <>
              <span className="font-medium text-text-light">{mappedProducts.length}</span>{" "}
              of{" "}
              <span className="font-medium text-text-light">
                {pagination.total}
              </span>{" "}
              plants
            </>
          ) : (
            "No plants found"
          )}
        </p>

        <div className="flex items-center gap-3">
          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value as SortOption)}
              className="appearance-none bg-transparent text-xs text-text-muted font-medium pr-5 py-1 cursor-pointer hover:text-text-light transition-colors focus:outline-none"
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
            <ChevronDownIcon className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-text-muted pointer-events-none" />
          </div>

          {/* View toggle */}
          <div className="flex items-center border-l border-forest/10 pl-3 gap-1">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                viewMode === "grid"
                  ? "bg-emerald/10 text-emerald"
                  : "text-text-muted hover:text-text-light hover:bg-black/5",
              )}
              aria-label="Grid view"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                viewMode === "list"
                  ? "bg-emerald/10 text-emerald"
                  : "text-text-muted hover:text-text-light hover:bg-black/5",
              )}
              aria-label="List view"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid / List */}
      {mappedProducts.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "flex sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none scrollbar-hide -mx-4 sm:mx-0 px-4 sm:px-0"
              : "space-y-4"
          }
        >
          {mappedProducts.map((product) =>
            viewMode === "grid" ? (
              <div key={product.id} className="snap-start shrink-0 w-[75vw] sm:w-auto">
                <ProductCard product={product} />
              </div>
            ) : (
              <ProductListItem key={product.id} product={product} />
            ),
          )}
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
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="mt-4 px-4 py-2 rounded-lg bg-emerald text-bg-main text-sm font-medium hover:bg-forest/90 transition-colors"
            >
              Reset Filters
            </button>
          )}
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

function ProductListItem({ product }: { product: any }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-forest/10 bg-bg-soft/50 hover:border-forest/25 hover:-translate-y-0.5 transition-all duration-300">
      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-emerald/10 to-sage/15 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-text-muted/30"
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
      <div className="flex-1 min-w-0">
        <Link
          href={`/product/${product.id}`}
          className="text-sm font-heading font-semibold text-text-light hover:text-emerald transition-colors truncate block"
        >
          {product.name}
        </Link>
        {product.category && (
          <p className="text-xs text-text-muted/60 mt-0.5">
            {product.category}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-bold text-emerald">
            ${product.price}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-text-muted/50 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
