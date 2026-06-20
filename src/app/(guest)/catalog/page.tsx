import { getProducts } from "@/actions";
import { CatalogContent } from "./catalog-content";
import { getBackgroundImageUrl } from "@/lib/utils";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const category = params.category || "";
  const search = params.search || "";
  const price = params.price || "";
  const page = parseInt(params.page || "1", 10);

  const result = await getProducts({
    category: category || undefined,
    search: search || undefined,
    page,
    perPage: 12,
    status: "active",
  });

  return (
    <>
      <section className="relative pt-24 pb-12 md:pt-24 md:pb-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${getBackgroundImageUrl(1)})` }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-forest/40 to-emerald/25"
        />

        <div
          className="absolute left-[5%] top-[55%] w-16 h-16 rounded-full border border-forest/25"
          style={{ animation: "float 7s ease-in-out infinite 2s" }}
        />
        <div
          className="absolute right-[20%] bottom-[25%] w-12 h-12 rounded-full bg-forest/10"
          style={{ animation: "float-slow 9s ease-in-out infinite" }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest bg-emerald/20 text-emerald/90 backdrop-blur-sm mb-4">
            Explore
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4">
            Our Plant Collection
          </h1>
          <p className="text-white/85 text-base md:text-lg max-w-xl mx-auto">
            Discover the perfect green companion for your home. From
            low-maintenance beauties to statement-making showstoppers.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 pointer-events-none">
          <svg
            viewBox="0 0 1440 120"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-emerald)" stopOpacity="0.08" />
                <stop offset="100%" stopColor="var(--color-bg-main)" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path
              d="M0,35 C240,95 720,-5 1440,50 L1440,120 L0,120 Z"
              fill="url(#waveGrad)"
            />
          </svg>
        </div>
      </section>

      <section className="relative pb-20 overflow-hidden">
        <div className="absolute -left-16 top-20 w-56 h-56 rounded-full bg-forest/[1.5%] pointer-events-none" />
        <div className="absolute -right-10 bottom-10 w-36 h-36 rounded-full border border-forest/10 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CatalogContent
            key={`${category}-${search}-${price}-${page}`}
            products={result.data as any[]}
            pagination={result.pagination}
            defaultSearch={search}
            defaultCategory={category}
            defaultPrice={price}
          />
        </div>
      </section>
    </>
  );
}
