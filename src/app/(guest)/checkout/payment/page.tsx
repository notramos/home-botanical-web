"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatPrice, cn, getProductImageUrl } from "@/lib/utils";
import { ChevronLeftIcon, LeafIcon } from "@/components/shared/icons";
import { useCartStore } from "@/stores/cart-store";

const CARD_BRANDS = [
  { label: "Credit Card", value: "card" },
  { label: "PayPal", value: "paypal" },
  { label: "Bank Transfer", value: "bank" },
];

const MONTHS = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);
const YEARS = Array.from({ length: 10 }, (_, i) =>
  String(2026 + i)
);

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, total, clearCart } = useCartStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setHydrated(true); }, []);

  const cartTotal = hydrated ? total() : 0;

  const [method, setMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardMonth, setCardMonth] = useState("");
  const [cardYear, setCardYear] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const handlePay = () => {
    if (method !== "card" || (cardNumber && cardName && cardMonth && cardYear && cardCvv.length >= 3)) {
      setProcessing(true);
      setTimeout(() => {
        setProcessing(false);
        setPaid(true);
        clearCart();
        setTimeout(() => {
          router.push(`/checkout/success?order=${searchParams.get("order") || "HB-" + Date.now()}`);
        }, 1200);
      }, 2000);
    }
  };

  const orderNumber = searchParams.get("order") || "HB-" + Date.now();

  return (
    <div className="min-h-screen">
      <section className="pt-24 pb-6 md:pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/checkout"
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-emerald transition-colors mb-3"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Back to Checkout
          </Link>
          <h1 className="text-2xl md:text-4xl font-heading font-bold text-text-light">
            Payment
          </h1>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

            {/* Left: Payment Form */}
            <div className="lg:col-span-3 space-y-6">

              {/* Card Preview */}
              <div
                className={cn(
                  "relative w-full max-w-md mx-auto aspect-[1.586/1] rounded-2xl p-6 md:p-8 transition-all duration-500",
                  paid
                    ? "bg-accent-green shadow-lg shadow-accent-green/30"
                    : "bg-gradient-to-br from-forest to-emerald shadow-xl"
                )}
              >
                {paid ? (
                  <div className="flex flex-col items-center justify-center h-full text-bg-main animate-fade-in-up">
                    <svg className="w-12 h-12 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <p className="text-lg font-heading font-bold">Payment Successful</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <LeafIcon className="w-8 h-8 text-white/60" />
                      <div className="flex items-center gap-1">
                        <div className="w-8 h-5 rounded bg-white/20" />
                        <div className="w-8 h-5 rounded bg-white/10" />
                      </div>
                    </div>
                    <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 right-6 md:right-8 space-y-4">
                      <div className="space-y-1">
                        <p className="text-[10px] tracking-widest text-white/50 uppercase font-medium">
                          Card Number
                        </p>
                        <p className="text-lg md:text-xl tracking-[0.15em] text-white font-mono">
                          {cardNumber || "••••  ••••  ••••  ••••"}
                        </p>
                      </div>
                      <div className="flex items-end justify-between">
                        <div className="space-y-1">
                          <p className="text-[10px] tracking-widest text-white/50 uppercase font-medium">
                            Card Holder
                          </p>
                          <p className="text-sm text-white uppercase tracking-wider">
                            {cardName || "Your Name"}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-[10px] tracking-widest text-white/50 uppercase font-medium">
                            Expires
                          </p>
                          <p className="text-sm text-white font-mono">
                            {cardMonth || "MM"}/{cardYear ? cardYear.slice(2) : "YY"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Payment Methods */}
              <div className="rounded-xl border border-forest/15 bg-bg-soft/30 p-5">
                <p className="text-sm font-medium text-forest mb-4">
                  Payment Method
                </p>
                <div className="flex flex-wrap gap-2">
                  {CARD_BRANDS.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => { setMethod(m.value); setPaid(false); }}
                      className={cn(
                        "px-4 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 border",
                        method === m.value
                          ? "bg-emerald text-bg-main border-emerald shadow-sm"
                          : "bg-bg-main text-text-muted border-black/10 hover:border-forest/30 hover:text-emerald"
                      )}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Form */}
              {method === "card" && (
                <div className="rounded-xl border border-forest/15 bg-bg-soft/30 p-5 space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-text-muted">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      className="w-full rounded-lg border border-forest/15 bg-bg-main px-4 py-2.5 text-sm text-accent-green placeholder:text-accent-green/30 font-mono tracking-wider transition-colors focus:outline-none focus:border-emerald focus:ring-1 focus:ring-emerald/30"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-text-muted">
                      Card Holder Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full rounded-lg border border-forest/15 bg-bg-main px-4 py-2.5 text-sm text-accent-green placeholder:text-accent-green/30 transition-colors focus:outline-none focus:border-emerald focus:ring-1 focus:ring-emerald/30"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-text-muted">
                        Month
                      </label>
                      <select
                        value={cardMonth}
                        onChange={(e) => setCardMonth(e.target.value)}
                        className="w-full rounded-lg border border-forest/15 bg-bg-main px-3 py-2.5 text-sm text-accent-green transition-colors focus:outline-none focus:border-emerald focus:ring-1 focus:ring-emerald/30"
                      >
                        <option value="">MM</option>
                        {MONTHS.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-text-muted">
                        Year
                      </label>
                      <select
                        value={cardYear}
                        onChange={(e) => setCardYear(e.target.value)}
                        className="w-full rounded-lg border border-forest/15 bg-bg-main px-3 py-2.5 text-sm text-accent-green transition-colors focus:outline-none focus:border-emerald focus:ring-1 focus:ring-emerald/30"
                      >
                        <option value="">YY</option>
                        {YEARS.map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-text-muted">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="•••"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                        className="w-full rounded-lg border border-accent-green/15 bg-bg-main px-3 py-2.5 text-sm text-accent-green placeholder:text-accent-green/30 font-mono text-center transition-colors focus:outline-none focus:border-emerald focus:ring-1 focus:ring-emerald/30"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PayPal mock */}
              {method === "paypal" && (
                <div className="rounded-xl border border-forest/15 bg-bg-soft/30 p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald/15 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-emerald" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/>
                    </svg>
                  </div>
                  <p className="text-sm text-forest font-medium mb-1">
                    PayPal Checkout
                  </p>
                  <p className="text-xs text-text-muted">
                    You will be redirected to PayPal to complete your payment.
                  </p>
                </div>
              )}

              {/* Bank Transfer mock */}
              {method === "bank" && (
                <div className="rounded-xl border border-forest/15 bg-bg-soft/30 p-5 space-y-3">
                  <p className="text-sm font-medium text-forest">Bank Transfer Details</p>
                  <div className="rounded-lg bg-bg-main border border-black/5 p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Bank</span>
                      <span className="text-text-light font-medium">Green Bank Australia</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Account Name</span>
                      <span className="text-text-light font-medium">Home Botanical Pty Ltd</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">BSB</span>
                      <span className="text-text-light font-mono font-medium">032-089</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Account No.</span>
                      <span className="text-text-light font-mono font-medium">54 7923 456</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Reference</span>
                      <span className="text-emerald font-mono text-xs">{orderNumber}</span>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted">
                    Please include your order number as reference. Orders are processed after payment clears.
                  </p>
                </div>
              )}

              {/* Pay Button */}
              <button
                onClick={handlePay}
                disabled={processing || paid}
                className={cn(
                  "w-full h-14 rounded-xl font-medium text-base tracking-wider transition-all duration-300 flex items-center justify-center gap-2",
                  paid
                    ? "bg-accent-green text-bg-main cursor-default"
                    : "bg-forest text-bg-main hover:bg-emerald hover:-translate-y-0.5 shadow-lg shadow-forest/20 hover:shadow-emerald/30",
                  processing && "opacity-70 cursor-wait"
                )}
              >
                {processing ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing Payment...
                  </>
                ) : paid ? (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Payment Complete
                  </>
                ) : (
                  <>
                    <LeafIcon className="w-5 h-5" />
                    Pay {formatPrice(cartTotal)}
                  </>
                )}
              </button>

              <p className="text-center text-xs text-text-muted">
                Your payment is secured via encrypted connection.
              </p>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-forest/15 bg-bg-soft/30 p-6 sticky top-28 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-semibold text-text-light text-lg">
                    Order Summary
                  </h3>
                  <span className="text-[10px] uppercase tracking-wider text-forest font-medium px-2 py-1 rounded-full bg-forest/10">
                    #{orderNumber}
                  </span>
                </div>

                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 rounded-xl bg-bg-main border border-black/5">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={getProductImageUrl(item.id)}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald/25 to-transparent pointer-events-none" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-light truncate">{item.name}</p>
                        <p className="text-xs text-text-muted">Qty: {item.qty}</p>
                        <p className="text-sm text-emerald font-medium mt-0.5">
                          {formatPrice(item.price * item.qty)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-black/5 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Subtotal</span>
                    <span className="text-text-light">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Shipping</span>
                    <span className="text-emerald">Free</span>
                  </div>
                  <div className="flex justify-between border-t border-black/5 pt-3">
                    <span className="font-heading font-semibold text-text-light">Total</span>
                    <span className="text-xl font-heading font-bold text-emerald">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 text-xs text-text-muted border-t border-black/5">
                  <svg className="w-4 h-4 text-emerald" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                  <span>Secure payment via encrypted connection</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
