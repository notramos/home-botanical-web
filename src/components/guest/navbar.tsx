"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { CartIcon, MenuIcon, CloseIcon, SearchIcon } from "@/components/shared/icons";
import { useEffect, useState, useRef } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/catalog" },
  { label: "Our Story", href: "/about" },
  { label: "Plant Care", href: "/plant-care" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const cartCount = useCartStore((s) => s.count());
  const prevCartCount = useRef(cartCount);
  const setOpen = useCartStore((s) => s.setOpen);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [badgeBounce, setBadgeBounce] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (cartCount > prevCartCount.current) {
      setBadgeBounce(true);
      const timer = setTimeout(() => setBadgeBounce(false), 400);
      prevCartCount.current = cartCount;
      return () => clearTimeout(timer);
    }
    prevCartCount.current = cartCount;
  }, [cartCount]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <nav
          className={cn(
            "pointer-events-auto transition-all duration-700 ease-out",
            scrolled
              ? "w-[calc(100%-60px)] max-w-[900px] h-14 mt-4 rounded-2xl shadow-lg shadow-black/5 bg-bg-main/80 backdrop-blur-2xl saturate-[1.8] border border-black/[0.06] px-5"
              : "w-full h-16 md:h-20 bg-transparent px-4 sm:px-6 lg:px-8"
          )}
        >
          <div className={cn(
            "mx-auto flex items-center justify-between h-full",
            scrolled ? "max-w-full" : "max-w-7xl"
          )}>
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                "md:hidden p-2 transition-colors",
                scrolled ? "text-accent-green hover:text-accent-light" : "text-accent-green hover:text-accent-light"
              )}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <CloseIcon className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>

            {/* Logo */}
            <Link
              href="/"
              className={cn(
                "font-heading font-bold tracking-wide transition-all duration-300",
                scrolled
                  ? "text-2xl text-accent-green hover:text-accent-light"
                  : "text-xl md:text-2xl md:text-accent-light text-accent-light md:drop-shadow-none drop-shadow-sm"
              )}
            >
              Home Botanical
            </Link>

            {/* Desktop nav */}
            <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className={cn(
                        "relative px-2 py-2 text-sm font-bold uppercase tracking-[0.12em] no-underline transition-colors duration-200",
                        "after:absolute after:bottom-0 after:left-2 after:h-[2px] after:rounded-full after:transition-all after:duration-300",
                        active
                          ? "after:w-[calc(100%-16px)] after:bg-accent-light"
                          : "after:w-0 after:bg-accent-light hover:after:w-[calc(100%-16px)]",
                        scrolled
                          ? active ? "text-accent-light" : "text-accent-green hover:text-accent-light"
                          : "md:text-accent-light drop-shadow-sm"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <div className="relative hidden md:block" ref={searchRef}>
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className={cn(
                    "p-2 transition-colors",
                    scrolled ? "text-accent-green hover:text-accent-light" : "md:text-accent-green md:hover:text-accent-light text-accent-green/70 hover:text-accent-light"
                  )}
                  aria-label="Toggle search"
                >
                  <SearchIcon className="w-5 h-5" />
                </button>
                <div
                  className={cn(
                    "absolute right-0 top-1/2 -translate-y-1/2 overflow-hidden transition-all duration-300",
                    searchOpen ? "w-48 opacity-100" : "w-0 opacity-0 pointer-events-none"
                  )}
                >
                  <input
                    type="text"
                    placeholder="Search plants..."
                    className={cn(
                      "w-full h-9 pl-3 pr-8 text-sm rounded-lg border outline-none transition-colors",
                      scrolled
                        ? "bg-bg-main border-accent-green/20 text-accent-green placeholder:text-accent-green/50 focus:border-accent-green/50"
                        : "bg-accent-green/10 border-accent-green/20 text-accent-green placeholder:text-accent-green/50 focus:border-accent-green/50"
                    )}
                    autoFocus={searchOpen}
                  />
                </div>
              </div>

              {/* Cart */}
              <button
                onClick={() => setOpen(true)}
                className={cn(
                  "relative p-2 transition-colors",
                  scrolled ? "text-accent-green hover:text-accent-light" : "md:text-accent-green md:hover:text-accent-light text-accent-green hover:text-accent-light"
                )}
                aria-label="Open cart"
              >
                <CartIcon className="w-5 h-5" />
                    <span
                      className={cn(
                        "absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold text-bg-main bg-accent-light rounded-full leading-none transition-transform duration-200",
                      badgeBounce && "scale-125",
                      cartCount === 0 && "hidden",
                      !mounted && "hidden"
                    )}
                  >
                    {mounted ? (cartCount > 99 ? "99+" : cartCount) : ""}
                  </span>
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile menu — slide-in drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden transition-all duration-300",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer */}
        <div
          className={cn(
            "absolute top-0 right-0 h-full w-72 max-w-[85vw] bg-bg-main shadow-2xl shadow-black/10 border-l border-black/5 transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-black/5">
            <span className="font-heading text-xl font-bold text-accent-green">Menu</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1.5 text-accent-green hover:text-accent-green transition-colors"
              aria-label="Close menu"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="px-4 py-6 space-y-1">
            {[
              { href: "/", label: "Home" },
              { href: "/catalog", label: "Shop" },
              { href: "/about", label: "Our Story" },
              { href: "/plant-care", label: "Plant Care" },
              { href: "/contact", label: "Contact" },
            ].map((item, i) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block px-4 py-3 rounded-lg text-base font-medium no-underline transition-all duration-300",
                    active
                      ? "bg-accent-green/10 text-accent-light"
                      : "text-accent-green hover:bg-accent-green/10 hover:text-accent-light"
                  )}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    animation: mobileOpen ? `fadeInRight 0.4s ease-out ${i * 60}ms both` : "none"
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
