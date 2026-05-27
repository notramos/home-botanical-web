import Link from "next/link";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const orderNumber =
    typeof params.order === "string" ? params.order : params.order?.[0];

  return (
    <section className="flex-1 flex items-center justify-center py-24 px-4">
      <div className="max-w-md w-full text-center">
        {/* Checkmark */}
        <div className="w-20 h-20 rounded-full bg-accent-green/20 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-accent-light"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <h1 className="text-2xl md:text-3xl font-heading font-bold text-text-light mb-3">
          Order Placed Successfully!
        </h1>
        <p className="text-text-muted text-sm mb-6 leading-relaxed">
          Thank you for your purchase. You will receive an order confirmation
          email shortly with your order details.
        </p>

        {orderNumber && (
          <div className="inline-block px-6 py-3 rounded-xl bg-bg-soft border border-black/5 mb-8">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
              Order Number
            </p>
            <p className="text-lg font-heading font-semibold text-accent-light">
              {orderNumber}
            </p>
          </div>
        )}

        <Link
          href="/catalog"
          className="inline-flex h-12 px-8 items-center justify-center rounded-lg bg-accent-light text-bg-main font-medium text-sm hover:bg-accent-green/90 transition-all duration-200 shadow-lg shadow-accent-light/20"
        >
          Continue Shopping
        </Link>
      </div>
    </section>
  );
}
