# Ganti Semua Image dengan Background Colour + Glassmorphism Epipremnum

## Ringkasan Perubahan

### A. Hero Carousel — `src/components/guest/hero-carousel.tsx`

**1. Slide background images (baris 66-83 & 106-122)**
Ganti `backgroundImage: url(${slide.image})` dengan gradient background.
Desktop (lines 74-80):
```
- className="absolute inset-0 bg-cover bg-center transition-transform duration-[8s] ease-out"
- style={{ backgroundImage: `url(${slide.image})` }}
+ className="absolute inset-0 bg-gradient-to-br from-emerald/15 via-forest/10 to-sage/20 transition-transform duration-[8s] ease-out"
```

Mobile (lines 114-120):
```
- className="absolute inset-0 bg-cover bg-center transition-transform duration-[6s] ease-out"
- style={{ backgroundImage: `url(${slide.image})` }}
+ className="absolute inset-0 bg-gradient-to-br from-emerald/20 via-forest/15 to-sage/25 transition-transform duration-[6s] ease-out"
```

Also remove the overlay div on lines 95-100 since it was gradient on image edge—no longer needed.

**2. Epipremnum info card (baris 167-183) — perkuat glassmorphism**
```
- background: "rgba(26,58,40,0.88)",
- backdropFilter: "blur(10px)",
- borderRight: "3px solid var(--color-emerald, #2d9f5e)"
+ background: "rgba(26,58,40,0.18)",
+ backdropFilter: "blur(20px)",
+ WebkitBackdropFilter: "blur(20px)",
+ borderRight: "3px solid var(--color-emerald, #2d9f5e)"
+ boxShadow: "0 8px 32px rgba(0,0,0,0.12)"
```
This makes it more glassy (transparent bg, more blur, subtle shadow).

---

### B. Category Grid — `src/components/guest/category-grid.tsx`

**Baris 42-48 — background image per kategori**
Ganti `backgroundImage` dengan gradient:
```
- className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
- style={{
-   backgroundImage: `url(${
-     CATEGORY_IMAGES[cat.slug] || CATEGORY_IMAGES.default
-   })`,
- }}
+ className="absolute inset-0 bg-gradient-to-br from-emerald/25 to-forest/30 transition-transform duration-500 group-hover:scale-110"
```

Text label already has `drop-shadow-sm text-white` — should be fine on the gradient.

---

### C. Catalog Header — `src/app/(guest)/catalog/page.tsx`

**Baris 26-32 — backgroundImage**
```
- className="absolute inset-0 bg-cover bg-center"
- style={{
-   backgroundImage:
-     'url("https://images.unsplash.com/...")',
- }}
+ className="absolute inset-0 bg-gradient-to-br from-forest/30 to-emerald/20"
```

Remove the overlay div on line 33 (`<div className="absolute inset-0" />`) since it's empty.

---

### D. About Page — `src/app/(guest)/about/page.tsx`

**Line 6 — HERO_BG constant**
Keep the constant but change how it's rendered.

**Baris 20-23 — Hero section background**
```
- className="absolute inset-0 bg-cover bg-center"
- style={{ backgroundImage: `url(${HERO_BG})` }}
+ className="absolute inset-0 bg-gradient-to-br from-forest/30 to-emerald/15"
```

**Baris 79-82 — Mission section image**
```
- className="absolute inset-0 bg-cover bg-center"
- style={{ backgroundImage: `url(${HERO_BG})` }}
+ className="absolute inset-0 bg-gradient-to-br from-emerald/20 to-forest/25"
```
The overlay `bg-gradient-to-br from-forest/70 to-forest/30` on line 83 is fine to keep.

**Baris 164-168 — CTA section background**
```
- className="absolute inset-0 bg-cover bg-center"
- style={{ backgroundImage: `url(${HERO_BG})` }}
+ className="absolute inset-0 bg-gradient-to-br from-forest/35 to-emerald/20"
```

---

### E. Contact Page — `src/app/(guest)/contact/page.tsx`

**Baris 8-11 — Hero background**
```
- className="absolute inset-0 bg-cover bg-center bg-no-repeat"
- style={{ backgroundImage: "url(https://images.unsplash.com/...)" }}
+ className="absolute inset-0 bg-gradient-to-br from-moss/30 to-forest/25"
```

---

### F. Plant Care Page — `src/app/(guest)/plant-care/page.tsx`

**Baris 132-135 — Hero background**
```
- className="absolute inset-0 bg-cover bg-center bg-no-repeat"
- style={{ backgroundImage: "url(https://images.unsplash.com/...)" }}
+ className="absolute inset-0 bg-gradient-to-br from-sage/30 to-forest/20"
```

**Baris 228-231 — Bottom CTA background**
```
- className="absolute inset-0 bg-cover bg-center bg-no-repeat"
- style={{ backgroundImage: "url(https://images.unsplash.com/...)" }}
+ className="absolute inset-0 bg-gradient-to-br from-forest/30 to-emerald/20"
```

---

### G. Homepage — `src/app/(guest)/page.tsx`

**1. Banner CTA (baris 158-166)** — Replace `<Image>` with gradient:
```
- <Image src="..." alt="" fill className="object-cover" sizes="100vw" />
+ <div className="absolute inset-0 bg-gradient-to-br from-forest/30 to-emerald/15" />
```

**2. Categories section bg (baris 228-236)** — Replace `<Image>`:
```
- <Image src="..." alt="" fill className="object-cover" sizes="100vw" />
+ <div className="absolute inset-0 bg-gradient-to-br from-sage/25 to-moss/20" />
```

**3. Plant Care Tips card images (baris 259-266)** — Replace `<Image>`:
```
- <Image src={tip.image} alt={tip.title} fill className="object-cover ..." sizes="..." />
+ <div className="absolute inset-0 bg-gradient-to-br from-emerald/15 to-sage/20" />
```

**4. Featured Products section bg (baris 284-291)** — Replace `<Image>`:
```
- <Image src="..." alt="" fill className="object-cover" sizes="100vw" />
+ <div className="absolute inset-0 bg-gradient-to-br from-forest/25 to-emerald/15" />
```

**5. Reviews card images (baris 354-361)** — Replace `<Image>`:
```
- <Image src={review.image} alt="" fill className="object-cover" sizes="..." />
+ <div className="absolute inset-0 bg-gradient-to-br from-moss/15 to-sage/20" />
```

**6. Instagram section bg (baris 371-378)** — Replace `<Image>`:
```
- <Image src="..." alt="" fill className="object-cover" sizes="100vw" />
+ <div className="absolute inset-0 bg-gradient-to-br from-emerald/20 to-forest/25" />
```

**7. Instagram photo cards (baris 402-409)** — Replace `<Image>`:
```
- <Image src={photo.src} alt={photo.alt} fill className="object-cover ..." sizes="..." />
+ <div className="absolute inset-0 bg-gradient-to-br from-emerald/15 to-forest/20" />
```
Use different bg colours for each photo (cycle through: emerald, sage, forest, moss).

---

### H. Product Card — `src/components/guest/product-card.tsx`

**Baris 58-86 — Image area**
Keep the fallback but enhance with gradient:
```
- <div className="absolute inset-0 flex items-center justify-center bg-bg-main">
+ <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald/10 to-sage/15">
```

---

### I. Product Detail — `src/app/(guest)/product/[id]/page.tsx`

**Baris 87-107 — Gallery image**
The container already has `bg-bg-soft`. For the fallback (when no image), enhance:
```
- <div className="flex items-center justify-center h-full">
-   <Image src={FALLBACK_IMAGE} ... />
- </div>
+ <div className="flex items-center justify-center h-full bg-gradient-to-br from-emerald/10 to-forest/15">
+   <LeafIcon className="w-16 h-16 text-forest/30" />
+ </div>
```

---

### J. Checkout & Payment — `src/app/(guest)/checkout/page.tsx` & `payment/page.tsx`
Already has LeafIcon fallback when `item.image` is falsy — no changes needed unless the cart has items with Unsplash images.

---

## Summary Variasi Warna per Section

| Section | Gradient |
|---------|----------|
| Hero carousel slides | `from-emerald/15 via-forest/10 to-sage/20` |
| Hero carousel info card glassmorphism | `rgba(26,58,40,0.18)` + `blur(20px)` |
| Category grid | `from-emerald/25 to-forest/30` |
| Catalog header | `from-forest/30 to-emerald/20` |
| About hero | `from-forest/30 to-emerald/15` |
| About mission image | `from-emerald/20 to-forest/25` |
| About CTA | `from-forest/35 to-emerald/20` |
| Contact hero | `from-moss/30 to-forest/25` |
| Plant-care hero | `from-sage/30 to-forest/20` |
| Plant-care CTA | `from-forest/30 to-emerald/20` |
| Homepage banner CTA | `from-forest/30 to-emerald/15` |
| Homepage categories bg | `from-sage/25 to-moss/20` |
| Homepage tips cards | `from-emerald/15 to-sage/20` |
| Homepage featured bg | `from-forest/25 to-emerald/15` |
| Homepage review cards | `from-moss/15 to-sage/20` |
| Homepage instagram bg | `from-emerald/20 to-forest/25` |
| Homepage instagram photos | rotasi emerald/sage/forest/moss |
| Product card fallback | `from-emerald/10 to-sage/15` |
| Product detail fallback | `from-emerald/10 to-forest/15` |

## Cara Eksekusi

```bash
# === HERO CAROUSEL ===
# Desktop slide background (line ~74-80)
sed -i 's|className="absolute inset-0 bg-cover bg-center transition-transform duration-\[8s\] ease-out"\n\s*style={{ backgroundImage: `url(\${slide.image})` }}|className="absolute inset-0 bg-gradient-to-br from-emerald/15 via-forest/10 to-sage/20 transition-transform duration-[8s] ease-out"|' src/components/guest/hero-carousel.tsx

# (better to manually edit since the multiline sed is complex)

# === GLOBALS.CSS ===
# Add a reusable placeholder class
```

## Catatan
- Semua perubahan hanya di **guest-facing pages**
- Admin dan data tetap utuh (tidak menghapus URL di constants / seed)
- Mudah direvert: tinggal ganti `bg-gradient-*` kembali ke `bg-cover bg-center` + `backgroundImage`
