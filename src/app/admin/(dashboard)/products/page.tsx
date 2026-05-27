import { getProducts, getProductStats } from "@/actions";
import ProductsClient from "./products-client";

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    category?: string;
    plantType?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const sp = await searchParams;
  const page = sp.page ? parseInt(sp.page) : 1;

  const [productsData, stats] = await Promise.all([
    getProducts({
      search: sp.search,
      status: sp.status,
      category: sp.category,
      plantType: sp.plantType,
      page,
      perPage: 10,
    }),
    getProductStats(),
  ]);

  const pagination = {
    ...productsData.pagination,
    pageSize: productsData.pagination.perPage,
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-text-light">Products</h1>
          <p className="text-sm text-text-muted mt-1">Manage your product catalog</p>
        </div>
      </div>

      <ProductsClient
        initialData={productsData.data as unknown as Record<string, unknown>[]}
        initialPagination={pagination}
        stats={stats}
      />
    </div>
  );
}
