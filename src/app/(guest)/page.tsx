import { prisma } from "@/lib/db";
import { HeroCarousel } from "@/components/guest/hero-carousel";
import { CategoryGrid } from "@/components/guest/category-grid";
import { ProductCard } from "@/components/guest/product-card";
import Image from "next/image";
import { FEATURED_PRODUCTS, VALUES, CATEGORIES } from "@/lib/constants";
import { LeafIcon, StarIcon } from "@/components/shared/icons";
import { formatPrice, getBackgroundImageUrl, getProductImageUrl } from "@/lib/utils";
import Link from "next/link";

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { status: "active", isFeatured: true },
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
      where: { status: "active" },
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

async function getDbStatus() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

const reviews = [
  {
    name: "Emily R.",
    avatar: "E",
    text: "My Monstera arrived in perfect condition and is thriving! The packaging was eco-friendly and the plant was so healthy.",
    image:
      "https://images.unsplash.com/photo-1586282391129-76a6df230234?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "James K.",
    avatar: "J",
    text: "I was nervous ordering plants online, but Home Botanical exceeded my expectations. The Fiddle Leaf Fig is stunning.",
    image:
      "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Sophia L.",
    avatar: "S",
    text: "Beautiful selection of low-light plants for my apartment. Customer service was incredibly helpful in choosing the right plants.",
    image:
      "https://images.unsplash.com/photo-1774053054226-ecabae8bbde6?auto=format&fit=crop&w=400&q=80",
  },
];

const plantCareTips = [
  {
    title: "Water Wisely",
    desc: "Most indoor plants thrive when you let the soil dry out between waterings. Stick your finger an inch deep — if it's dry, it's time to water.",
    image:
      "https://images.unsplash.com/photo-1557187666-4fd70cf76254?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Perfect Light",
    desc: "Bright indirect light is the sweet spot for most houseplants. Near an east or north-facing window is ideal for lush, happy growth.",
    image:
      "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Humidity Boost",
    desc: "Tropical plants love humidity. Mist them regularly, group plants together, or place a tray of water nearby to create a mini greenhouse effect.",
    image:
      "https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?auto=format&fit=crop&w=600&q=80",
  },
];

const instagramPhotos = [
  {
    src: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=600&q=80",
    alt: "Potted plant collection",
  },
  {
    src: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80",
    alt: "Ceramic pots display",
  },
  {
    src: "https://images.unsplash.com/photo-1778079840490-af5643183fcd?auto=format&fit=crop&w=600&q=80",
    alt: "Indoor garden setup",
  },
  {
    src: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=80",
    alt: "Succulent arrangement",
  },
];

export default async function HomePage() {
  const [dbOk, featuredProducts, dbCategories] = await Promise.all([
    getDbStatus(),
    getFeaturedProducts(),
    getCategoriesFromDb(),
  ]);

  const displayProducts =
    dbOk && featuredProducts
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
    dbOk && dbCategories
      ? dbCategories
      : CATEGORIES.filter((c) => c !== "All Plants").map((c) => ({
          slug: c.toLowerCase().replace(/\s+/g, "_"),
          name: c,
        }));

  const values = VALUES;

  return (
    <>
      <HeroCarousel />

      {/* Banner CTA — full width with botanical gradient */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${getBackgroundImageUrl(2)})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-forest/40 to-emerald/25" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <LeafIcon className="w-8 h-8 text-emerald/80 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-bg-main mb-4">
            Not sure which plant is right for you?
          </h2>
          <p className="text-bg-main/80 text-base md:text-lg mb-8 max-w-2xl mx-auto">
            Take our quick plant quiz and we will match you with the perfect
            green companion for your space and lifestyle.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/catalog"
                className="inline-flex h-12 px-10 items-center justify-center rounded-sm bg-forest text-bg-main text-sm font-medium tracking-wider no-underline transition-all duration-300 hover:bg-emerald hover:-translate-y-0.5"
            >
              Browse Collection
            </Link>
            <Link
              href="/plant-care"
              className="inline-flex h-12 px-10 items-center justify-center rounded-sm bg-transparent text-bg-main text-sm tracking-wider no-underline border border-bg-main/40 transition-all duration-300 hover:bg-emerald/10 hover:border-emerald"
            >
              Plant Care Guide
            </Link>
          </div>
        </div>
      </section>

      {/* Values — card style with icons */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold text-text-light mb-3">
              Why Home Botanical?
            </h2>
            <p className="text-text-muted text-base max-w-xl mx-auto">
              We make plant parenthood easy, sustainable, and joyful.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {values.map((value, i) => (
              <div
                key={i}
                className="group rounded-xl border border-forest/15 bg-bg-soft/50 p-8 text-center transition-all duration-300 hover:border-forest/30 hover:bg-bg-soft hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-full bg-emerald/15 flex items-center justify-center mx-auto mb-5 group-hover:bg-emerald/25 transition-colors">
                  <LeafIcon className="w-6 h-6 text-emerald" />
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

      {/* Categories Grid — full botanical gradient */}
      <section className="relative overflow-hidden" id="categories">
        <div className="absolute inset-0 bg-gradient-to-br from-sage/25 to-moss/20" />
        <div className="relative z-10">
          <CategoryGrid categories={categories} title="Shop by Category" />
        </div>
      </section>

      {/* Plant Care Tips */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold text-text-light mb-3">
              Plant Care 101
            </h2>
            <p className="text-text-muted text-base max-w-xl mx-auto">
              Simple tips to keep your greenery thriving all year round.
            </p>
          </div>
            <div className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none scrollbar-hide -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
              {plantCareTips.map((tip, i) => (
              <div
                key={i}
                className="snap-start shrink-0 w-[75vw] sm:w-[45vw] md:w-auto group rounded-xl overflow-hidden border border-emerald/15 bg-bg-soft/50 transition-all duration-300 hover:border-emerald/30 hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={tip.image}
                    alt={tip.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald/25 to-transparent pointer-events-none" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-heading font-semibold text-text-light mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {tip.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products — full botanical gradient */}
      <section className="relative overflow-hidden" id="best-sellers">
        <div className="absolute inset-0 bg-gradient-to-br from-forest/25 to-emerald/15" />
        <div className="relative z-10 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-heading font-semibold text-forest mb-3">
                Aussie Favourites
              </h2>
              <p className="text-accent-green/80 text-base max-w-xl mx-auto">
                Handpicked by our team — these are the plants Australia loves
                most.
              </p>
            </div>
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none scrollbar-hide -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
              {displayProducts.map((product) => (
                <div key={product.id} className="snap-start shrink-0 w-[75vw] sm:w-[45vw] md:w-auto">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link
                href="/catalog"
              className="inline-flex h-12 px-10 items-center justify-center rounded-sm bg-forest text-bg-main text-sm font-medium tracking-wider no-underline transition-all duration-300 hover:bg-emerald hover:-translate-y-0.5"
              >
                View All Plants
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews — 3-column grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold text-text-light mb-3">
              Loved by Plant Parents
            </h2>
            <p className="text-text-muted text-base max-w-xl mx-auto">
              Real reviews from real plant lovers across Australia.
            </p>
          </div>
          <div className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none scrollbar-hide -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            {reviews.map((review, i) => (
              <div
                key={i}
                className="snap-start shrink-0 w-[75vw] sm:w-[45vw] md:w-auto rounded-xl border border-forest/10 bg-bg-soft/30 p-6 transition-all duration-300 hover:border-forest/25 hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-forest/15 flex items-center justify-center text-forest font-heading font-bold text-lg flex-shrink-0">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-light">
                      {review.name}
                    </p>
                    <div className="flex text-accent-gold text-xs tracking-[2px] mt-0.5">
                      {"★".repeat(5)}
                    </div>
                  </div>
                </div>
                <p className="text-text-muted text-sm leading-relaxed mb-4">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="relative h-32 rounded-lg overflow-hidden">
                  <Image
                    src={review.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald/25 to-transparent pointer-events-none" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Feed — full botanical gradient */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${getBackgroundImageUrl(3)})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald/30 to-forest/25" />
        <div className="relative z-10 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-semibold text-white mb-3">
                Follow Us
              </h2>
              <p className="text-white/80 text-base max-w-xl mx-auto">
                Tag{" "}
                <span className="text-emerald font-medium">
                  @homebotanical
                </span>{" "}
                for a chance to be featured.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {instagramPhotos.map((photo, i) => (
                <a
                  key={i}
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square rounded-xl overflow-hidden"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald/25 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-emerald/0 group-hover:bg-emerald/20 transition-colors duration-300 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-bg-main opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
