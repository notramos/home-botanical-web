"use client";

import { cn } from "@/lib/utils";
import { SearchIcon } from "@/components/shared/icons";
import { categories } from "@/lib/utils";

interface FilterBarProps {
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onPriceChange: (range: [number, number]) => void;
  activeCategory: string;
  searchQuery: string;
  priceRange: [number, number];
  minPrice?: number;
  maxPrice?: number;
  className?: string;
}

export function FilterBar({
  onSearchChange,
  onCategoryChange,
  onPriceChange,
  activeCategory,
  searchQuery,
  priceRange,
  minPrice = 0,
  maxPrice = 200,
  className,
}: FilterBarProps) {
  return (
    <div className={cn("space-y-5", className)}>
      {/* Search */}
      <div className="relative">
        <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search plants..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded-lg border border-black/10 bg-bg-main text-sm text-text-light placeholder:text-text-muted/60 focus:outline-none focus:border-accent-green/50 focus:ring-1 focus:ring-accent-green/30 transition-colors"
        />
      </div>

      {/* Category buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange("")}
          className={cn(
            "px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
            activeCategory === ""
              ? "bg-accent-light text-bg-main"
              : "bg-black/5 text-text-muted hover:text-accent-light hover:bg-accent-light/10"
          )}
        >
          All Plants
        </button>
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
              activeCategory === cat.value
                ? "bg-accent-light text-bg-main"
                : "bg-black/5 text-text-muted hover:text-accent-light hover:bg-accent-light/10"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Price range */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted">Price Range</span>
          <span className="text-xs text-text-light font-medium">
            ${priceRange[0]} — ${priceRange[1]}
          </span>
        </div>
        <div className="relative h-1.5 rounded-full bg-black/10">
          <div
            className="absolute h-full rounded-full bg-accent-light/40"
            style={{
              left: `${(priceRange[0] / maxPrice) * 100}%`,
              width: `${((priceRange[1] - priceRange[0]) / maxPrice) * 100}%`,
            }}
          />
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={priceRange[0]}
            onChange={(e) => {
              const val = Number(e.target.value);
              onPriceChange([Math.min(val, priceRange[1] - 5), priceRange[1]]);
            }}
            className="absolute top-1/2 -translate-y-1/2 w-full h-1.5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-light [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
            style={{ zIndex: 3 }}
          />
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={priceRange[1]}
            onChange={(e) => {
              const val = Number(e.target.value);
              onPriceChange([priceRange[0], Math.max(val, priceRange[0] + 5)]);
            }}
            className="absolute top-1/2 -translate-y-1/2 w-full h-1.5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-light [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
            style={{ zIndex: 4 }}
          />
        </div>
      </div>
    </div>
  );
}
