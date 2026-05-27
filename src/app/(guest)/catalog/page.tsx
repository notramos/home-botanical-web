import { getProducts } from "@/actions";
import { CatalogContent } from "./catalog-content";

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
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="absolute inset-0 " />

        <div
          className="absolute right-[15%] top-[15%] w-24 h-24 rounded-full border border-accent-green/20"
          style={{ animation: "float 6s ease-in-out infinite" }}
        />
        <div
          className="absolute left-[10%] bottom-[20%] w-14 h-14 rounded-full bg-accent-green/5"
          style={{ animation: "float-slow 8s ease-in-out infinite" }}
        />
        <div
          className="absolute right-[10%] bottom-[30%] w-10 h-10 rounded-full border border-accent-green/15"
          style={{ animation: "float 7s ease-in-out infinite 2s" }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4">
            Our Plant Collection
          </h1>
          <p className="text-white text-base md:text-lg max-w-xl mx-auto">
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
            <path
              d="M0,35 C240,95 720,-5 1440,50 L1440,120 L0,120 Z"
              fill="var(--color-bg-main, #f5f2eb)"
            />
          </svg>
        </div>
      </section>

      <section className="relative pb-20 overflow-hidden">
        <div className="absolute -left-16 top-20 w-56 h-56 rounded-full bg-accent-green/[1.5%] pointer-events-none" />
        <div className="absolute -right-10 bottom-10 w-36 h-36 rounded-full border border-accent-green/10 pointer-events-none" />
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
