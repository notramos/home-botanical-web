# Fix Remaining Color Issues

## 1. `src/lib/utils.ts` — Update old hex/RGB di statusColors

**Baris 63:**
```
- processing: { bg: "rgba(59, 130, 246, 0.1)", text: "#3b82f6" },
+ processing: { bg: "rgba(91, 155, 213, 0.1)", text: "#5b9bd5" },
```

**Baris 67:**
```
- refunded: { bg: "rgba(220, 38, 38, 0.1)", text: "#dc2626" },
+ refunded: { bg: "rgba(217, 74, 74, 0.1)", text: "#d94a4a" },
```

**Baris 70:**
```
- failed: { bg: "rgba(220, 38, 38, 0.1)", text: "#dc2626" },
+ failed: { bg: "rgba(217, 74, 74, 0.1)", text: "#d94a4a" },
```

---

## 2. `src/components/admin/transaction-log.tsx` — Update info blue RGB

**Baris 38-39:**
```
- bg: "rgba(59, 130, 246, 0.1)",
- border: "rgba(59, 130, 246, 0.3)",
+ bg: "rgba(91, 155, 213, 0.1)",
+ border: "rgba(91, 155, 213, 0.3)",
```

**Baris 80:** `group-hover:text-accent-light` → `group-hover:text-emerald`

---

## 3. `src/app/globals.css` — Update skeleton loader colors

**Baris 114-115 (pulse-dot):**
```
- box-shadow: 0 0 0 3px rgba(92, 191, 138, 0.18);
- box-shadow: 0 0 0 6px rgba(92, 191, 138, 0.07);
+ box-shadow: 0 0 0 3px rgba(45, 159, 94, 0.18);
+ box-shadow: 0 0 0 6px rgba(45, 159, 94, 0.07);
```

**Baris 139 (skeleton):**
```
- background: linear-gradient(90deg, rgba(92, 191, 138, 0.08) 25%, rgba(92, 191, 138, 0.15) 50%, rgba(92, 191, 138, 0.08) 75%);
+ background: linear-gradient(90deg, rgba(45, 159, 94, 0.08) 25%, rgba(45, 159, 94, 0.15) 50%, rgba(45, 159, 94, 0.08) 75%);
```

---

## 4. `accent-light` → `emerald` di 14 file admin (29 occurrences)

Global replace `accent-light` → `emerald` di file berikut:

| # | File | Occurrences |
|---|------|-------------|
| 1 | `src/app/admin/(dashboard)/orders/[id]/page.tsx` | 1 (`hover:bg-accent-light`) |
| 2 | `src/app/admin/(dashboard)/orders/create/page.tsx` | 5 (`focus:border-accent-light` x4, `hover:bg-accent-light` x1) |
| 3 | `src/app/admin/(dashboard)/products/[id]/edit/edit-product-client.tsx` | 1 (`hover:bg-accent-light`) |
| 4 | `src/app/admin/(dashboard)/products/create/page.tsx` | 1 (`hover:bg-accent-light`) |
| 5 | `src/app/admin/(dashboard)/transactions/page.tsx` | 1 (`text-accent-light`) |
| 6 | `src/app/admin/login/page.tsx` | 3 (`focus:border-accent-light` x2, `hover:bg-accent-light` x1) |
| 7 | `src/app/admin/(dashboard)/orders/[id]/order-status-actions.tsx` | 3 (`text-accent-light` x2, `bg-accent-light` x1) |
| 8 | `src/app/admin/(dashboard)/orders/[id]/order-payment-form.tsx` | 4 (`focus:border-accent-light` x3, `hover:bg-accent-light` x1) |
| 9 | `src/app/admin/(dashboard)/orders/[id]/edit/edit-order-client.tsx` | 5 (`focus:border-accent-light` x4, `hover:bg-accent-light` x1) |
| 10 | `src/app/admin/(dashboard)/orders/orders-client.tsx` | 1 (`hover:bg-accent-light`) |
| 11 | `src/app/admin/(dashboard)/products/products-client.tsx` | 1 (`hover:bg-accent-light`) |
| 12 | `src/components/admin/sidebar.tsx` | 1 (`bg-accent-light`) |
| 13 | `src/components/admin/transaction-log.tsx` | 1 (`group-hover:text-accent-light`) |
| 14 | `src/components/admin/form-field.tsx` | 1 (`group-hover:text-accent-light`) |

Total: 14 files, 29 occurrences. Semua `accent-light` → `emerald`.

---

## Cara apply

```bash
# Jika ada sed:
# 1. utils.ts
sed -i 's/rgba(59, 130, 246, 0.1)/rgba(91, 155, 213, 0.1)/g; s/#3b82f6/#5b9bd5/g; s/rgba(220, 38, 38, 0.1)/rgba(217, 74, 74, 0.1)/g; s/#dc2626/#d94a4a/g' src/lib/utils.ts

# 2. transaction-log.tsx
sed -i 's/rgba(59, 130, 246, 0.1)/rgba(91, 155, 213, 0.1)/g; s/rgba(59, 130, 246, 0.3)/rgba(91, 155, 213, 0.3)/g' src/components/admin/transaction-log.tsx
sed -i 's/accent-light/emerald/g' src/components/admin/transaction-log.tsx

# 3. globals.css
sed -i 's/rgba(92, 191, 138, 0.18)/rgba(45, 159, 94, 0.18)/g; s/rgba(92, 191, 138, 0.07)/rgba(45, 159, 94, 0.07)/g; s/rgba(92, 191, 138, 0.08)/rgba(45, 159, 94, 0.08)/g; s/rgba(92, 191, 138, 0.15)/rgba(45, 159, 94, 0.15)/g' src/app/globals.css

# 4. accent-light → emerald di admin files
for f in \
  src/app/admin/\(\dashboard\)/orders/\[id\]/page.tsx \
  src/app/admin/\(\dashboard\)/orders/create/page.tsx \
  src/app/admin/\(\dashboard\)/products/\[id\]/edit/edit-product-client.tsx \
  src/app/admin/\(\dashboard\)/products/create/page.tsx \
  src/app/admin/\(\dashboard\)/transactions/page.tsx \
  src/app/admin/login/page.tsx \
  src/app/admin/\(\dashboard\)/orders/\[id\]/order-status-actions.tsx \
  src/app/admin/\(\dashboard\)/orders/\[id\]/order-payment-form.tsx \
  src/app/admin/\(\dashboard\)/orders/\[id\]/edit/edit-order-client.tsx \
  src/app/admin/\(\dashboard\)/orders/orders-client.tsx \
  src/app/admin/\(\dashboard\)/products/products-client.tsx \
  src/components/admin/sidebar.tsx \
  src/components/admin/form-field.tsx; do
  echo "Processing $f..."
  sed -i 's/accent-light/emerald/g' "$f"
done

# 5. Build untuk verifikasi
npm run build
```
