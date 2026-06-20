import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LeafIcon } from "@/components/shared/icons";
import { VALUES } from "@/lib/constants";
import { getBackgroundImageUrl } from "@/lib/utils";

const HERO_BG = "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1920&q=80";

const MILESTONES = [
  { year: "2020", desc: "A seed of an idea" },
  { year: "2022", desc: "First store opened" },
  { year: "2024", desc: "1000+ plants delivered" },
  { year: "2026", desc: "Australia's favourite" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-bg-main">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_BG})` }}
        />
        <div className="absolute right-[12%] top-[15%] w-28 h-28 rounded-full border border-sage/40 pointer-events-none"
             style={{ animation: "float 6s ease-in-out infinite" }} />
        <div className="absolute left-[8%] bottom-[20%] w-16 h-16 rounded-full bg-emerald/10 pointer-events-none"
             style={{ animation: "float-slow 8s ease-in-out infinite" }} />
        <div className="absolute right-[20%] bottom-[30%] w-10 h-10 rounded-full border border-emerald/30 pointer-events-none"
             style={{ animation: "float 7s ease-in-out infinite 2s" }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald/10 border border-emerald/20 text-emerald text-sm mb-6">
            <LeafIcon className="w-4 h-4" />
            <span>Our Story</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 leading-tight">
            Bringing Nature
            <br />
            <span className="text-white">Indoors</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Home Botanical was born from a simple belief: every space deserves
            the warmth and vitality of living plants. We curate the finest
            indoor greenery to transform houses into homes.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 pointer-events-none z-[3]">
          <svg viewBox="0 0 1440 120" className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M0,35 C240,95 720,-5 1440,50 L1440,120 L0,120 Z"
              fill="var(--color-bg-main, #f5f2eb)"
            />
          </svg>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-forest/[2%] border-t border-black/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-forest">
                Our <span className="text-emerald">Mission</span>
              </h2>
              <div className="w-12 h-0.5 bg-emerald" />
              <p className="text-text-muted leading-relaxed">
                We&apos;re on a mission to make plant parenthood accessible,
                enjoyable, and sustainable. From our hands to your home, every
                plant is nurtured with care and delivered with love.
              </p>
              <p className="text-text-muted leading-relaxed">
                Our team of horticulturists hand-selects each variety for its
                beauty, air-purifying qualities, and ability to thrive indoors.
                We partner with sustainable growers who share our commitment to
                peat-free soil, biodegradable pots, and ethical practices.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden relative">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${getBackgroundImageUrl(0, 600)})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-forest/60 to-emerald/40" />
                <div className="relative w-full h-full flex items-center justify-center">
                  <LeafIcon className="w-32 h-32 text-white/40" />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-xl bg-emerald/10 border border-emerald/20 flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl font-heading font-bold text-emerald">2026</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones / Timeline */}
      <section className="relative border-t border-black/5 overflow-hidden">
        <div className="absolute -right-20 top-10 w-64 h-64 rounded-full border border-emerald/10 pointer-events-none" />
        <div className="absolute -left-32 bottom-0 w-80 h-80 rounded-full bg-forest/[1%] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-emerald mb-4">
              Our Journey
            </h2>
            <p className="text-text-muted max-w-xl mx-auto">
              From a humble beginning to a national favourite.
            </p>
          </div>
          <div className="flex items-start justify-center gap-8 md:gap-16">
            {MILESTONES.map((m, i) => (
              <div key={m.year} className="flex flex-col items-center text-center flex-1 max-w-[180px]">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-emerald ring-4 ring-emerald/20" />
                  {i < MILESTONES.length - 1 && (
                    <div className="w-0.5 h-14 bg-emerald/20 md:h-20" />
                  )}
                </div>
                <span className="text-xl md:text-2xl font-heading font-bold text-emerald mt-3">{m.year}</span>
                <p className="text-sm text-text-muted mt-1 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative border-t border-black/5 bg-forest/[1.5%] overflow-hidden">
        <div className="absolute right-0 top-1/3 w-72 h-72 rounded-full border border-emerald/[3%] pointer-events-none" />
        <div className="absolute left-[20%] bottom-10 w-40 h-40 rounded-full bg-emerald/[2%] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-emerald mb-4">
              What We <span className="text-forest">Stand For</span>
            </h2>
            <p className="text-text-muted max-w-xl mx-auto">
              Every plant we deliver carries our promise of quality, care, and
              sustainability.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {VALUES.map((value, i) => (
              <div
                key={value.title}
                className="group rounded-2xl border border-forest/15 bg-bg-soft/50 p-8 hover:bg-bg-soft hover:border-forest/30 hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-emerald/15 flex items-center justify-center mb-5 group-hover:bg-emerald/25 group-hover:scale-110 transition-all">
                  <LeafIcon className="w-6 h-6 text-forest" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-forest mb-3">
                  {value.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-black/5">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${getBackgroundImageUrl(4)})` }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-forest/40 to-emerald/25"
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
            Ready to Start Your{" "}
            <span className="text-white">Green Journey</span>?
          </h2>
          <p className="text-white/80 max-w-lg mx-auto mb-8">
            Browse our curated collection and find the perfect plant to bring
            life into your space.
          </p>
          <Button asChild size="lg">
            <Link href="/catalog">Explore Plants</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
