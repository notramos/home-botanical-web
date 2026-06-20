import Link from "next/link";
import { cn } from "@/lib/utils";
import { CATEGORY_IMAGES } from "@/lib/constants";

interface Category {
  slug: string;
  name: string;
}

interface CategoryGridProps {
  categories: Category[];
  title?: string;
  className?: string;
}

export function CategoryGrid({
  categories,
  title,
  className,
}: CategoryGridProps) {
  if (!categories.length) return null;

  return (
    <section className={cn("py-12 md:py-16", className)}>
      {title && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-forest text-center">
            {title}
          </h2>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex md:grid md:grid-cols-4 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none scrollbar-hide -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          {categories.map((cat) => (
            <div key={cat.slug} className="snap-start shrink-0 w-[45vw] md:w-auto">
            <Link
              href={`/catalog?category=${cat.slug}`}
              className="group relative aspect-[4/5] rounded-xl overflow-hidden"
            >
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${CATEGORY_IMAGES[cat.slug] || CATEGORY_IMAGES.default})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/60 to-transparent transition-transform duration-500 group-hover:scale-110" />

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                  <h3 className="text-base md:text-lg font-heading font-semibold text-white drop-shadow-sm group-hover:text-emerald transition-colors">
                  {cat.name}
                </h3>
              </div>

              {/* Hover accent line */}
              <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-emerald scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
