import { LeafIcon } from "@/components/shared/icons";
import { getBackgroundImageUrl } from "@/lib/utils";

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[70vh] md:min-h-[75vh] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${getBackgroundImageUrl(5)})` }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-moss/40 to-forest/30"
        />
        {/* Decorative circles */}
        <div className="absolute right-[12%] top-[15%] w-28 h-28 rounded-full border border-sage/40 pointer-events-none" style={{ animation: "float 6s ease-in-out infinite" }} />
        <div className="absolute left-[8%] bottom-[22%] w-16 h-16 rounded-full bg-emerald/10 pointer-events-none" style={{ animation: "float-slow 8s ease-in-out infinite" }} />
        <div className="absolute right-[18%] bottom-[28%] w-10 h-10 rounded-full border border-emerald/15 pointer-events-none" style={{ animation: "float 7s ease-in-out infinite 2s" }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald/10 border border-emerald/20 text-emerald text-sm mb-6">
            <LeafIcon className="w-4 h-4" />
            <span>Get in Touch</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 leading-tight">
            We&apos;d Love to{" "}
            <span className="text-white">Hear From You</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Whether you have a question about plant care, an order inquiry, or
            just want to say hello — we&apos;re all ears.
          </p>
        </div>
        {/* Wave SVG separator */}
        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 pointer-events-none">
          <svg viewBox="0 0 1440 120" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,35 C240,95 720,-5 1440,50 L1440,120 L0,120 Z" fill="var(--color-bg-main, #f5f2eb)" />
          </svg>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative border-t border-black/5 bg-forest/[2%] overflow-hidden">
        <div className="absolute -left-20 top-10 w-60 h-60 rounded-full border border-emerald/10 pointer-events-none" />
        <div className="absolute -right-16 bottom-20 w-48 h-48 rounded-full bg-forest/[2%] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-5 gap-12 md:gap-16">
            {/* Form */}
            <div className="md:col-span-3">
                <h2 className="text-2xl font-heading font-bold text-forest mb-2">
                  Send Us a Message
                </h2>
                <p className="text-sm text-text-muted mb-8">
                We typically respond within 24 hours.
              </p>

              <form className="space-y-5">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block text-sm font-medium text-forest">
                    Full Name
                  </label>
                  <div className="relative">
                    <LeafIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-green/40 pointer-events-none" />
                    <input
                      id="name"
                      type="text"
                      placeholder="Jane Doe"
                      className="w-full rounded-lg border border-forest/15 bg-bg-main/80 px-10 py-2.5 text-sm text-accent-green placeholder:text-text-muted/40 transition-colors duration-200 focus:outline-none focus:border-forest/50 focus:ring-1 focus:ring-forest/30"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-sm font-medium text-accent-green">
                    Email Address
                  </label>
                  <div className="relative">
                    <LeafIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-green/40 pointer-events-none" />
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-forest/15 bg-bg-main/80 px-10 py-2.5 text-sm text-accent-green placeholder:text-text-muted/40 transition-colors duration-200 focus:outline-none focus:border-forest/50 focus:ring-1 focus:ring-forest/30"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="block text-sm font-medium text-accent-green">
                    Message
                  </label>
                  <div className="relative">
                    <LeafIcon className="absolute left-3 top-3 w-4 h-4 text-accent-green/40 pointer-events-none" />
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Tell us how we can help..."
                      className="w-full rounded-lg border border-accent-green/15 bg-bg-main/80 px-10 py-2.5 text-sm text-accent-green placeholder:text-accent-green/40 transition-colors duration-200 focus:outline-none focus:border-accent-green/50 focus:ring-1 focus:ring-accent-green/30 resize-y min-h-[120px]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg bg-emerald text-bg-main font-medium h-12 px-8 text-base gap-2 hover:bg-emerald/90 hover:-translate-y-0.5 shadow-sm transition-all duration-200"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Info */}
            <div className="md:col-span-2 space-y-8">
              <div className="rounded-xl border border-forest/15 bg-bg-soft/30 p-5">
                <LeafIcon className="w-5 h-5 text-emerald mb-3" />
                <h3 className="text-lg font-heading font-semibold text-forest mb-4">
                  Visit Us
                </h3>
                  <div className="space-y-3 text-sm text-text-muted">
                  <p>Home Botanical Studio</p>
                  <p>42 Green Valley Lane</p>
                  <p>Sydney, NSW 2000</p>
                  <p>Australia</p>
                </div>
              </div>

              <div className="rounded-xl border border-forest/15 bg-bg-soft/30 p-5">
                <LeafIcon className="w-5 h-5 text-emerald mb-3" />
                <h3 className="text-lg font-heading font-semibold text-forest mb-4">
                  Contact Details
                </h3>
                <div className="space-y-3 text-sm">
                  <p>
                    <span className="text-text-muted">Email: </span>
                    <a href="mailto:hello@homebotanical.com" className="text-forest hover:text-forest/80 transition-colors">
                      hello@homebotanical.com
                    </a>
                  </p>
                  <p>
                    <span className="text-text-muted">Phone: </span>
                    <a href="tel:+61255550123" className="text-forest hover:text-forest/80 transition-colors">
                      +61 2 5555 0123
                    </a>
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-forest/15 bg-bg-soft/30 p-5">
                <LeafIcon className="w-5 h-5 text-emerald mb-3" />
                <h3 className="text-lg font-heading font-semibold text-forest mb-4">
                  Hours
                </h3>
                <div className="space-y-2 text-sm text-text-muted">
                  <div className="flex justify-between">
                    <span>Mon – Fri</span>
                    <span>9:00 AM – 6:00 PM</span>
                  </div>
                  <div className="border-t border-forest/10 my-2" />
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM – 4:00 PM</span>
                  </div>
                  <div className="border-t border-forest/10 my-2" />
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="text-text-muted/50">Closed</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-forest/15 bg-bg-soft/30 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <LeafIcon className="w-5 h-5 text-emerald shrink-0" />
                  <p className="text-sm font-medium text-forest">
                    Plant Help Hotline
                  </p>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  Stuck on plant care? Call our plant experts during business
                  hours for free advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative border-t border-black/5 overflow-hidden">
        <div className="absolute right-[10%] top-1/4 w-40 h-40 rounded-full border border-forest/10 pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-56 h-56 rounded-full bg-forest/[1.5%] pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <h2 className="text-3xl font-heading font-bold text-forest text-center mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-text-muted text-center mb-12">
            Everything you need to know before reaching out.
          </p>

          <div className="space-y-4">
            <div className="border border-forest/15 bg-bg-soft/30 rounded-xl p-5">
              <p className="text-sm font-medium text-emerald">How long does delivery take?</p>
              <p className="text-xs text-text-muted mt-2">We deliver within 3-5 business days across Australia.</p>
            </div>
            <div className="border border-forest/15 bg-bg-soft/30 rounded-xl p-5">
              <p className="text-sm font-medium text-emerald">What if my plant arrives damaged?</p>
              <p className="text-xs text-text-muted mt-2">We offer a 7-day replacement guarantee. Just send us a photo.</p>
            </div>
            <div className="border border-forest/15 bg-bg-soft/30 rounded-xl p-5">
              <p className="text-sm font-medium text-emerald">Do you offer plant care advice?</p>
              <p className="text-xs text-text-muted mt-2">Absolutely! Our plant experts are available via email or phone during business hours.</p>
            </div>
            <div className="border border-forest/15 bg-bg-soft/30 rounded-xl p-5">
              <p className="text-sm font-medium text-emerald">Can I return a plant?</p>
              <p className="text-xs text-text-muted mt-2">We accept returns within 14 days for store credit.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
