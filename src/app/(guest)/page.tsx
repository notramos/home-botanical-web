import { prisma } from "@/lib/db";
import { HeroCarousel } from "@/components/guest/hero-carousel";
import { CategoryGrid } from "@/components/guest/category-grid";
import { ProductCard } from "@/components/guest/product-card";
import Image from "next/image";
import { FEATURED_PRODUCTS, VALUES, CATEGORIES, HERO_SLIDES } from "@/lib/constants";
import { LeafIcon } from "@/components/shared/icons";
import Link from "next/link";

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { status: "active", isFeatured: true, deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 8,
    });
    return products.length > 0 ? products : null;
  } catch {
    return null;
  }
}

async function getCategoriesFromDb() {
  try {
    const result = await prisma.product.findMany({
      where: { status: "active", deletedAt: null },
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });
    const cats = result
      .map((r) => r.category)
      .filter((c): c is string => c !== null)
      .map((c) => ({
        slug: c,
        name: c.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      }));
    return cats.length > 0 ? cats : null;
  } catch {
    return null;
  }
}

const trustBadges = [
  { label: "Peat-free & sustainable" },
  { label: "Nursery-fresh, hand-picked" },
  { label: "Safe delivery guarantee" },
  { label: "30-day happy-plant promise" },
];

const careSteps = [
  {
    step: "01",
    title: "Water Wisely",
    desc: "Let the top inch of soil dry between waterings. When in doubt, wait a day — most houseplants prefer a little thirst over soggy roots.",
    icon: (
      <path d="M12 2.5s6 6.5 6 11a6 6 0 1 1-12 0c0-4.5 6-11 6-11z" />
    ),
  },
  {
    step: "02",
    title: "Find the Light",
    desc: "Bright, indirect light is the sweet spot. An east or north-facing window keeps foliage lush without scorching those leaves.",
    icon: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </>
    ),
  },
  {
    step: "03",
    title: "Boost Humidity",
    desc: "Tropicals love moisture. Group plants together, mist regularly, or sit pots on a pebble tray to recreate that jungle feel.",
    icon: (
      <>
        <path d="M8 3s3 3.5 3 6a3 3 0 1 1-6 0c0-2.5 3-6 3-6z" />
        <path d="M17 9s2.5 3 2.5 5a2.5 2.5 0 1 1-5 0c0-2 2.5-5 2.5-5z" />
      </>
    ),
  },
];

const reviews = [
  {
    name: "Emily R.",
    location: "Melbourne",
    avatar: "E",
    text: "My Monstera arrived in perfect condition and is thriving. The packaging was eco-friendly and the plant looked healthier than any I've bought in-store.",
  },
  {
    name: "James K.",
    location: "Sydney",
    avatar: "J",
    text: "I was nervous ordering plants online, but Home Botanical exceeded every expectation. The Fiddle Leaf Fig is stunning and settled in beautifully.",
  },
  {
    name: "Sophia L.",
    location: "Brisbane",
    avatar: "S",
    text: "A beautiful selection of low-light plants for my apartment. Customer service genuinely helped me choose the right ones for my space.",
  },
];

export default async function HomePage() {
  const [featuredProducts, dbCategories] = await Promise.all([
    getFeaturedProducts(),
    getCategoriesFromDb(),
  ]);

  const displayProducts = featuredProducts
    ? featuredProducts.map((p) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
        image: p.image ?? undefined,
        category: p.category ?? undefined,
      }))
    : FEATURED_PRODUCTS.map((p, i) => ({
        id: i + 1,
        name: p.name,
        price: parseFloat(p.price.replace("$", "")),
        image: p.photo,
      }));

  const categories =
    dbCategories ??
    CATEGORIES.filter((c) => c !== "All Plants").map((c) => ({
      slug: c.toLowerCase().replace(/\s+/g, "_"),
      name: c,
    }));

  return (
    <>
      <HeroCarousel />

      {/* ── Trust strip ─────────────────────────────────────── */}
      <section className="border-y border-forest/10 bg-bg-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex flex-wrap items-center justify-center md:justify-between gap-x-8 gap-y-3 py-5 list-none m-0">
            {trustBadges.map((b, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-xs md:text-sm text-text-muted tracking-wide"
              >
                <LeafIcon className="w-4 h-4 text-emerald shrink-0" />
                {b.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Editorial intro ─────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image collage */}
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl shadow-forest/15">
                <Image
                  src={HERO_SLIDES[0].image}
                  alt="A sunlit corner styled with indoor plants"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* Floating accent card */}
              <div className="absolute -bottom-6 -right-2 md:-right-6 w-40 md:w-48 aspect-square rounded-2xl overflow-hidden border-4 border-bg-main shadow-xl hidden sm:block">
                <Image
                  src={HERO_SLIDES[1].image}
                  alt="Trailing pothos detail"
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
              {/* Organic decor blob */}
              <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-sage/25 -z-10 hidden md:block" />
            </div>

            {/* Copy */}
            <div className="max-w-xl">
              <p className="text-emerald text-xs font-medium tracking-[0.25em] uppercase mb-5">
                Our Little Green Philosophy
              </p>
              <h2 className="font-heading text-3xl md:text-5xl font-semibold text-text-light leading-tight mb-6">
                Bring the calm of the outdoors into every room
              </h2>
              <p className="text-text-muted text-base md:text-lg leading-relaxed mb-6">
                Home Botanical began with a simple belief — that a home full of
                thriving plants is a home that breathes easier. Every plant in
                our collection is nursery-grown, hand-selected, and cared for
                until the moment it reaches your door.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8 border-t border-forest/10 pt-6">
                {[
                  { value: "120+", label: "Plant varieties" },
                  { value: "8k+", label: "Happy plant parents" },
                  { value: "4.9", label: "Average rating" },
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="font-heading text-2xl md:text-3xl font-bold text-forest">
                      {stat.value}
                    </p>
                    <p className="text-xs text-text-muted mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/about"
                className="inline-flex h-12 px-8 items-center justify-center rounded-full bg-forest text-bg-main text-sm font-medium tracking-wider no-underline transition-all duration-300 hover:bg-emerald hover:-translate-y-0.5"
              >
                Read Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16 md:py-24 bg-bg-warm/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-emerald text-xs font-medium tracking-[0.25em] uppercase mb-3">
              Why Home Botanical
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-semibold text-text-light">
              Plant parenthood, made joyful
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {VALUES.map((value, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-forest/12 bg-bg-soft p-8 text-center transition-all duration-300 hover:border-emerald/40 hover:shadow-xl hover:shadow-forest/10 hover:-translate-y-1"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald/12 flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald/20 transition-colors">
                  <LeafIcon className="w-7 h-7 text-emerald" />
                </div>
                <h3 className="text-xl md:text-2xl font-heading font-semibold text-text-light mb-3">
                  {value.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ──────────────────────────────────────── */}
      <section id="categories">
        <CategoryGrid categories={categories} title="Shop by Category" />
      </section>

      {/* ── Featured products ───────────────────────────────── */}
      <section className="relative overflow-hidden py-16 md:py-24 bg-bg-warm/60" id="best-sellers">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <p className="text-emerald text-xs font-medium tracking-[0.25em] uppercase mb-3">
                Handpicked by our team
              </p>
              <h2 className="text-3xl md:text-5xl font-heading font-semibold text-forest">
                Best Sellers
              </h2>
            </div>
            <Link
              href="/catalog"
              className="text-sm font-medium text-forest hover:text-emerald transition-colors self-start md:self-auto"
            >
              View all plants →
            </Link>
          </div>
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none scrollbar-hide -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            {displayProducts.map((product) => (
              <div
                key={product.id}
                className="snap-start shrink-0 w-[75vw] sm:w-[45vw] md:w-auto"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Plant Care 101 ──────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-emerald text-xs font-medium tracking-[0.25em] uppercase mb-3">
              Plant Care 101
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-semibold text-text-light mb-3">
              Keep your greenery thriving
            </h2>
            <p className="text-text-muted text-base max-w-xl mx-auto">
              Three simple habits that make all the difference — no green thumb
              required.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {careSteps.map((tip, i) => (
              <div
                key={i}
                className="relative rounded-2xl border border-forest/12 bg-bg-soft p-8 pt-10 transition-all duration-300 hover:border-emerald/40 hover:-translate-y-1"
              >
                <span className="absolute top-6 right-7 font-heading text-5xl font-bold text-forest/8 select-none">
                  {tip.step}
                </span>
                <div className="w-14 h-14 rounded-xl bg-emerald/12 flex items-center justify-center mb-6">
                  <svg
                    className="w-7 h-7 text-emerald"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {tip.icon}
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-semibold text-text-light mb-2">
                  {tip.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {tip.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/plant-care"
              className="inline-flex h-12 px-8 items-center justify-center rounded-full border border-forest/30 text-forest text-sm font-medium tracking-wider no-underline transition-all duration-300 hover:bg-forest hover:text-bg-main"
            >
              Full Plant Care Guide
            </Link>
          </div>
        </div>
      </section>

      {/* ── Reviews ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16 md:py-24 bg-forest">
        {/* subtle botanical texture */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sage text-xs font-medium tracking-[0.25em] uppercase mb-3">
              Loved by plant parents
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-semibold text-bg-main">
              Real reviews, real green thumbs
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {reviews.map((review, i) => (
              <figure
                key={i}
                className="rounded-2xl bg-bg-main/8 border border-bg-main/12 backdrop-blur-sm p-8 transition-all duration-300 hover:bg-bg-main/12"
              >
                <div className="flex text-accent-gold text-sm tracking-[3px] mb-4">
                  {"★".repeat(5)}
                </div>
                <blockquote className="text-bg-main/85 text-sm leading-relaxed mb-6">
                  &ldquo;{review.text}&rdquo;
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-sage/25 flex items-center justify-center text-bg-main font-heading font-bold text-lg">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-bg-main">
                      {review.name}
                    </p>
                    <p className="text-xs text-sage">{review.location}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ─────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={HERO_SLIDES[2].image}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest/95 via-forest/80 to-forest/50" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-xl">
            <LeafIcon className="w-8 h-8 text-sage mb-5" />
            <h2 className="text-3xl md:text-5xl font-heading font-semibold text-bg-main leading-tight mb-5">
              Not sure where to start?
            </h2>
            <p className="text-bg-main/80 text-base md:text-lg leading-relaxed mb-8">
              Tell us about your space and lifestyle — we&apos;ll match you with
              the perfect low-effort, high-joy green companion.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/catalog"
                className="inline-flex h-12 px-10 items-center justify-center rounded-full bg-bg-main text-forest text-sm font-medium tracking-wider no-underline transition-all duration-300 hover:bg-sage hover:-translate-y-0.5"
              >
                Browse Collection
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 px-10 items-center justify-center rounded-full bg-transparent text-bg-main text-sm tracking-wider no-underline border border-bg-main/40 transition-all duration-300 hover:border-sage hover:bg-bg-main/10"
              >
                Talk to a Plant Expert
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
