import { LeafIcon } from "@/components/shared/icons";
import { getBackgroundImageUrl } from "@/lib/utils";

const guideSections = [
  {
    title: "Light Requirements",
    icon: "sun",
    content: [
      "Most indoor plants thrive in bright, indirect light. Place them near east- or north-facing windows for best results.",
      "Low-light plants like Snake Plants, ZZ Plants, and Pothos can tolerate spots further from windows.",
      "Direct sunlight can scorch leaves on many tropical plants. Use sheer curtains to diffuse harsh afternoon sun.",
      "Rotate your plants every few weeks to ensure even growth on all sides.",
    ],
  },
  {
    title: "Watering Guide",
    icon: "droplet",
    content: [
      "The golden rule: water thoroughly, then let the soil dry out before watering again.",
      "Stick your finger about an inch into the soil — if it feels dry, it's time to water.",
      "Overwatering is the #1 cause of houseplant death. Yellowing leaves often signal too much water.",
      "Use room-temperature water, and always use pots with drainage holes to prevent root rot.",
    ],
  },
  {
    title: "Humidity",
    icon: "wind",
    content: [
      "Tropical plants crave humidity. Most homes sit at 30-50% humidity, while tropical plants prefer 60%+.",
      "Group plants together to create a microclimate with higher humidity.",
      "Use a pebble tray with water beneath the pot, or invest in a small humidifier for your plant corner.",
      "Misting leaves can help temporarily, but consistent humidity through other methods is more effective.",
    ],
  },
  {
    title: "Fertilizing",
    icon: "nutrient",
    content: [
      "Feed your plants during the growing season (spring through early fall) every 2-4 weeks.",
      "Use a balanced, water-soluble fertilizer diluted to half strength to avoid burning roots.",
      "Reduce or stop fertilizing in winter when most plants enter dormancy.",
      "Organic options like worm castings or liquid seaweed provide gentle, natural nutrition.",
    ],
  },
  {
    title: "Repotting",
    icon: "refresh",
    content: [
      "Repot when roots circle the bottom of the pot or grow through drainage holes — typically every 12-18 months.",
      "Choose a pot 1-2 inches larger in diameter than the current one. Too-large pots can lead to overwatering.",
      "Spring is the best time to repot, as plants are entering their active growth phase.",
      "Use fresh potting mix appropriate for your plant type. Most indoor plants prefer well-draining soil.",
    ],
  },
  {
    title: "Common Issues",
    icon: "alert",
    content: [
      "Yellow leaves: usually overwatering or poor drainage. Check soil moisture and adjust your schedule.",
      "Brown leaf tips: often low humidity or fluoride in tap water. Try filtered water and increase humidity.",
      "Drooping leaves: could be underwatering or temperature stress. Check soil and move away from drafts.",
      "Pests (spider mites, mealybugs): wipe leaves with neem oil solution and isolate affected plants.",
    ],
  },
];

function SectionIcon({ type }: { type: string }) {
  const props = { className: "w-6 h-6 text-white" };

  switch (type) {
    case "sun":
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      );
    case "droplet":
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      );
    case "wind":
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
        </svg>
      );
    case "nutrient":
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M2 12h20" />
          <path d="M12 2a10 10 0 0 1 10 10" />
          <path d="M12 2a10 10 0 0 0-10 10" />
          <path d="M2 12a10 10 0 0 0 10 10" />
          <path d="M12 22a10 10 0 0 0 10-10" />
        </svg>
      );
    case "refresh":
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 4 23 10 17 10" />
          <polyline points="1 20 1 14 7 14" />
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
      );
    case "alert":
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    default:
      return <LeafIcon className="w-6 h-6 text-white" />;
  }
}

export default function PlantCarePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[70vh] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${getBackgroundImageUrl(6)})` }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-sage/40 to-forest/30"
        />
        {/* Floating decorative circles */}
        <div className="absolute right-[15%] top-[12%] w-24 h-24 rounded-full border border-sage/40 pointer-events-none" style={{ animation: "float 6s ease-in-out infinite" }} />
        <div className="absolute left-[10%] bottom-[18%] w-14 h-14 rounded-full bg-emerald/10 pointer-events-none" style={{ animation: "float-slow 8s ease-in-out infinite" }} />
        <div className="absolute right-[8%] bottom-[25%] w-8 h-8 rounded-full border border-white/15 pointer-events-none" style={{ animation: "float 7s ease-in-out infinite 2s" }} />

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 pointer-events-none">
          <svg viewBox="0 0 1440 120" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,35 C240,95 720,-5 1440,50 L1440,120 L0,120 Z" fill="var(--color-bg-main, #f5f2eb)" />
          </svg>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-sm mb-6">
            <LeafIcon className="w-4 h-4" />
            <span>Plant Care Guide</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 leading-tight">
            Help Your Plants{" "}
            <span className="text-white">Thrive</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know to keep your green friends happy and
            healthy — from light and water to humidity and repotting.
          </p>
        </div>
      </section>

      {/* Quick Reference */}
      <section className="relative border-t border-white/10 bg-gradient-to-br from-forest/40 to-emerald/25 overflow-hidden">
        <div className="absolute -right-12 top-5 w-36 h-36 rounded-full border border-emerald/10 pointer-events-none" />
        <div className="absolute left-[15%] bottom-0 w-24 h-24 rounded-full bg-forest/[2%] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-white text-center mb-10">
            Plant Emergency?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { q: "Overwatered?", a: "Let soil dry out" },
              { q: "Drooping?", a: "Check watering & light" },
              { q: "Yellow Leaves?", a: "Reduce watering" },
              { q: "Pests?", a: "Try neem oil" },
            ].map((tip) => (
              <div
                key={tip.q}
                className="border border-white/15 bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 hover:border-white/30 transition-all duration-300"
              >
                <LeafIcon className="w-6 h-6 text-emerald mx-auto mb-3" />
                <p className="text-sm font-medium text-white mb-1">{tip.q}</p>
                <p className="text-xs text-white/70">{tip.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guide Sections */}
      <section className="relative border-t border-white/10 bg-gradient-to-br from-forest/30 to-emerald/20 overflow-hidden">
        <div className="absolute -left-24 top-20 w-80 h-80 rounded-full bg-black/10 pointer-events-none" />
        <div className="absolute right-0 bottom-10 w-48 h-48 rounded-full border border-emerald/[3%] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {guideSections.map((section, i) => (
              <div
                key={section.title}
                className="group rounded-2xl border border-white/15 bg-white/5 p-8 hover:bg-white/10 hover:border-white/30 hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 group-hover:scale-110 transition-all">
                    <SectionIcon type={section.icon} />
                  </div>
                  <h2 className="text-xl font-heading font-semibold text-white">
                    {section.title}
                  </h2>
                </div>
                <ul className="space-y-3">
                  {section.content.map((tip, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-white/70 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald mt-2 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${getBackgroundImageUrl(7)})` }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-forest/40 to-emerald/25"
        />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <LeafIcon className="w-10 h-10 text-white/60 mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
            Still Have Questions?
          </h2>
          <p className="text-white/80 mb-2">
            Every plant is unique. If you need personalized advice, we&apos;re
            here to help.
          </p>
          <p className="text-white/80">
            Reach out at{" "}
            <a href="mailto:care@homebotanical.com" className="text-white hover:text-white/80 transition-colors">
              care@homebotanical.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
