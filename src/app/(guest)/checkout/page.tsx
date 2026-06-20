"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart-store";
import { createOrder } from "@/actions/admin";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations";
import { formatPrice, cn, getProductImageUrl } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeafIcon, ChevronLeftIcon } from "@/components/shared/icons";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const router = useRouter();

  const [formData, setFormData] = useState<CheckoutInput>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutInput, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback(
    (field: keyof CheckoutInput, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    },
    [errors]
  );

  const cartTotal = total();
  const isEmpty = items.length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = checkoutSchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof CheckoutInput, string>> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof CheckoutInput;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const order = await createOrder({
        customerName: parsed.data.customerName,
        customerEmail: parsed.data.customerEmail,
        customerPhone: parsed.data.customerPhone || null,
        shippingAddress: parsed.data.shippingAddress,
        status: "pending",
        paymentStatus: "unpaid",
        items: items.map((item) => ({
          productId: item.id,
          productName: item.name,
          quantity: item.qty,
          price: item.price,
        })),
      });

      router.push(`/checkout/payment?order=${order.orderNumber}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Header */}
      <section className="pt-24 pb-6 md:pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-emerald transition-colors mb-3"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Back to Catalog
          </Link>
          <h1 className="text-2xl md:text-4xl font-heading font-bold text-text-light">
            Checkout
          </h1>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left: Checkout Form */}
            <div className="lg:col-span-3">
              {isEmpty ? (
                <Card>
                  <CardContent className="py-16 text-center">
                    <LeafIcon className="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
                    <p className="text-text-muted mb-4">
                      Your cart is empty
                    </p>
                    <Button
                      variant="outline"
                      asChild
                    >
                      <Link href="/catalog">Browse Plants</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="customerName">Full Name</Label>
                        <Input
                          id="customerName"
                          placeholder="John Doe"
                          value={formData.customerName}
                          onChange={(e) =>
                            handleChange("customerName", e.target.value)
                          }
                          className={errors.customerName ? "border-destructive" : ""}
                        />
                        {errors.customerName && <p className="text-xs text-destructive">{errors.customerName}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="customerEmail">Email Address</Label>
                        <Input
                          id="customerEmail"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.customerEmail}
                          onChange={(e) =>
                            handleChange("customerEmail", e.target.value)
                          }
                          className={errors.customerEmail ? "border-destructive" : ""}
                        />
                        {errors.customerEmail && <p className="text-xs text-destructive">{errors.customerEmail}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="customerPhone">Phone Number (optional)</Label>
                        <Input
                          id="customerPhone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={formData.customerPhone || ""}
                          onChange={(e) =>
                            handleChange("customerPhone", e.target.value)
                          }
                          className={errors.customerPhone ? "border-destructive" : ""}
                        />
                        {errors.customerPhone && <p className="text-xs text-destructive">{errors.customerPhone}</p>}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Shipping Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1.5">
                        <Label htmlFor="shippingAddress">Address</Label>
                        <Input
                          id="shippingAddress"
                          placeholder="123 Plant Street, Apt 4B"
                          value={formData.shippingAddress}
                          onChange={(e) =>
                            handleChange("shippingAddress", e.target.value)
                          }
                          className={errors.shippingAddress ? "border-destructive" : ""}
                        />
                        {errors.shippingAddress && <p className="text-xs text-destructive">{errors.shippingAddress}</p>}
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={submitting}
                  >
                    {submitting ? "Processing..." : "Place Order"}
                  </Button>
                </form>
              )}
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-2">
              <Card className="sticky top-28">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 p-3 rounded-xl bg-black/[0.02] border border-black/5"
                      >
                         <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                           <Image
                             src={getProductImageUrl(item.id)}
                             alt={item.name}
                             fill
                             className="object-cover"
                             sizes="64px"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-emerald/25 to-transparent pointer-events-none" />
                         </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-light truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-text-muted">
                            Qty: {item.qty}
                          </p>
                          <p className="text-sm text-emerald font-medium mt-0.5">
                            {formatPrice(item.price * item.qty)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="border-t border-black/5 pt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-muted">Subtotal</span>
                      <span className="text-text-light">
                        {formatPrice(cartTotal)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-muted">Shipping</span>
                      <span className="text-emerald">Free</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-muted">Tax</span>
                      <span className="text-text-light">
                        {formatPrice(0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-black/5 pt-3">
                      <span className="text-base font-heading font-semibold text-text-light">
                        Total
                      </span>
                      <span className="text-xl font-heading font-bold text-emerald">
                        {formatPrice(cartTotal)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
