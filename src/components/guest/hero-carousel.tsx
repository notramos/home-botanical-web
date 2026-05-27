"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { HERO_SLIDES } from "@/lib/constants";

interface HeroCarouselProps {
  className?: string;
}

export function HeroCarousel({ className }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const slides = HERO_SLIDES;

  const goTo = useCallback(
    (index: number) => {
      setCurrent(((index % slides.length) + slides.length) % slides.length);
    },
    [slides.length]
  );

  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, slides.length]);

  if (!slides.length) return null;

  return (
    <section
      className={cn("relative min-h-screen flex items-center overflow-hidden bg-bg-main", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ======================= */}
      {/* DESKTOP: Abstract layout */}
      {/* ======================= */}
      <div className="hidden md:block absolute inset-0">

        {/* Organic blob — left side */}
        <div className="absolute left-0 top-0 bottom-0 w-[58%] pointer-events-none">
          <svg viewBox="0 0 800 1000" className="w-full h-full" preserveAspectRatio="xMinYMid meet">
            <path
              d="M0,0 C280,0 520,140 560,400 C600,660 420,860 0,1000Z"
              fill="rgba(46,125,79,0.15)"
            />
          </svg>
        </div>

        {/* Image section — right side with organic clip */}
        <div
          className="absolute right-0 top-0 bottom-0 w-[65%] overflow-hidden"
          style={{ clipPath: "polygon(8% 0%, 100% 0%, 100% 100%, 0% 100%, 4% 50%)" }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                index === current ? "opacity-100" : "opacity-0"
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 bg-cover bg-center transition-transform duration-[8s] ease-out",
                  index === current && "scale-110"
                )}
                style={{ backgroundImage: `url(${slide.image})` }}
              />
            </div>
          ))}
        </div>

        {/* Abstract floating circles */}
        <div className="absolute right-[18%] top-[12%] w-28 h-28 rounded-full border border-accent-green/20 pointer-events-none"
             style={{ animation: "float 6s ease-in-out infinite" }} />
        <div className="absolute left-[42%] bottom-[18%] w-16 h-16 rounded-full border border-accent-light/30 pointer-events-none"
             style={{ animation: "float-slow 8s ease-in-out infinite" }} />
        <div className="absolute right-[8%] bottom-[25%] w-12 h-12 rounded-full bg-accent-light/10 pointer-events-none"
             style={{ animation: "float 7s ease-in-out infinite 2s" }} />
        <div className="absolute left-[50%] top-[22%] w-6 h-6 rounded-full bg-accent-green/8 pointer-events-none"
             style={{ animation: "float-slow 5s ease-in-out infinite 1s" }} />

        {/* Overlay subtle gradient on image edge */}
        <div className="absolute right-0 top-0 bottom-0 w-[65%] pointer-events-none"
             style={{
               background: "linear-gradient(90deg, rgba(46,125,79,0.12) 0%, transparent 10%, transparent 100%)"
             }} />
      </div>

      {/* ======================= */}
      {/* MOBILE: Full bg image    */}
      {/* ======================= */}
      <div className="md:hidden absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              index === current ? "opacity-100" : "opacity-0"
            )}
          >
            <div
              className={cn(
                "absolute inset-0 bg-cover bg-center transition-transform duration-[6s] ease-out",
                index === current && "scale-110"
              )}
              style={{ backgroundImage: `url(${slide.image})` }}
            />
          </div>
        ))}
        <div className="absolute inset-0 z-[1]" style={{
          background: "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)"
        }} />
      </div>

      {/* ======================= */}
      {/* Content                  */}
      {/* ======================= */}
      <div className="relative z-[2] w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center min-h-screen">
          {/* Left: Text */}
          <div className="animate-fade-in-up max-w-[560px] py-32 md:pr-8">
            <p className="text-accent-light text-[0.7rem] font-medium tracking-[0.25em] uppercase mb-6">
              Curated Indoor Plants
            </p>
            <h1 className="font-heading font-normal md:text-text-light text-accent-light leading-[1.15] mb-6"
                style={{ fontSize: "clamp(2.4rem, 4.5vw, 4rem)" }}>
              Add a little{" "}
              <span className="font-semibold text-accent-light">
                {slides[current].title}
              </span>{" "}
              to your space
            </h1>
            <p className="text-base leading-relaxed mb-8 max-w-[540px] font-light md:text-text-muted text-accent-green/70">
              {slides[current].desc}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-sm bg-accent-green text-bg-main text-sm tracking-wider no-underline transition-all duration-300 hover:bg-accent-light hover:-translate-y-0.5"
              >
                Shop Collection
              </Link>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-sm bg-transparent md:text-text-light text-accent-light text-sm tracking-wider no-underline border border-solid transition-all duration-300 md:hover:border-text-light hover:border-accent-light md:hover:bg-black/5 hover:bg-accent-green/10"
                 style={{ borderColor: "rgba(46,125,79,0.3)" }}
              >
                View Catalog
              </Link>
            </div>
          </div>

          {/* Right: Plant info card (desktop only) */}
          <div className="hidden md:flex items-end justify-end h-full py-32">
            <div className="p-6 rounded-sm max-w-[340px] w-full animate-fade-in-right"
                 style={{
                   background: "rgba(26,46,34,0.85)",
                   backdropFilter: "blur(10px)",
                    borderRight: "3px solid var(--color-accent-light, #7dd181)"
                 }}>
              <div className="text-right">
                <p className="font-heading italic text-lg text-accent-green mb-2">
                  {slides[current].latin}
                </p>
                <p className="text-sm leading-relaxed text-accent-green/70">
                  {slides[current].desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={goPrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-accent-green/30 backdrop-blur-md text-accent-light hover:bg-accent-green/50 transition-all hidden md:flex"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        onClick={goNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-accent-green/30 backdrop-blur-md text-accent-light hover:bg-accent-green/50 transition-all hidden md:flex"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === current
                ? "bg-accent-light w-6"
                : "md:bg-black/15 bg-accent-green/30 md:hover:bg-black/30 hover:bg-accent-green/50 w-2"
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Bottom wave separator */}
      <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 pointer-events-none z-[3]">
        <svg viewBox="0 0 1440 120" className="w-full h-full" preserveAspectRatio="none">
          <path
            d="M0,35 C240,95 720,-5 1440,50 L1440,120 L0,120 Z"
            fill="var(--color-bg-main, #f5f2eb)"
          />
        </svg>
      </div>
    </section>
  );
}
