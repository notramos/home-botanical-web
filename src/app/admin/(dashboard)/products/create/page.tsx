"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FormField from "@/components/admin/form-field";
import { createProduct } from "@/actions/admin";
import { categories, slugify } from "@/lib/utils";
import toast from "react-hot-toast";

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

const plantTypeOptions = [
  { value: "indoor", label: "Indoor" },
  { value: "outdoor", label: "Outdoor" },
  { value: "both", label: "Both" },
];

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    originalPrice: "",
    stock: "0",
    sku: "",
    image: "",
    category: "",
    status: "draft",
    plantType: "indoor",
    scientificName: "",
    lightRequirement: "",
    waterRequirement: "",
    careInstructions: "",
    isFeatured: false,
  });

  function handleChange(name: string) {
    return (value: string | number | boolean) => {
      setForm((prev) => {
        const next = { ...prev, [name]: value };
        if (name === "name" && !prev.slug) {
          next.slug = slugify(String(value));
        }
        return next;
      });
      if (errors[name]) {
        setErrors((prev) => {
          const copy = { ...prev };
          delete copy[name];
          return copy;
        });
      }
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await createProduct({
        name: form.name,
        slug: form.slug || undefined,
        description: form.description || undefined,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        stock: Number(form.stock),
        sku: form.sku || null,
        image: form.image || null,
        category: form.category || null,
        status: form.status as "active" | "draft" | "archived",
        plantType: form.plantType as "indoor" | "outdoor" | "both",
        scientificName: form.scientificName || null,
        lightRequirement: form.lightRequirement || null,
        waterRequirement: form.waterRequirement || null,
        careInstructions: form.careInstructions || null,
        isFeatured: form.isFeatured,
      });
      toast.success("Product created successfully");
      router.push("/admin/products");
    } catch (err: unknown) {
      if (err instanceof Error) {
        try {
          const parsed = JSON.parse(err.message);
          if (parsed.errors) {
            const fieldErrors: Record<string, string> = {};
            for (const e of parsed.errors) {
              fieldErrors[e.path?.[0] || e.message] = e.message;
            }
            setErrors(fieldErrors);
          }
        } catch {
          setErrors({ form: err.message });
        }
      } else {
        setErrors({ form: "Failed to create product" });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-text-light">Create Product</h1>
          <p className="text-sm text-text-muted mt-1">Add a new product to your catalog</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {errors.form && (
          <div className="bg-danger/10 border border-danger/20 rounded-lg px-4 py-3">
            <p className="text-sm text-danger">{errors.form}</p>
          </div>
        )}

        <div className="bg-bg-soft rounded-xl border border-accent-green/10 p-6 space-y-4">
          <h2 className="text-lg font-heading font-semibold text-accent-green">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Name" name="name" value={form.name} onChange={handleChange("name")} error={errors.name} placeholder="Product name" />
            <FormField label="Slug" name="slug" value={form.slug} onChange={handleChange("slug")} error={errors.slug} placeholder="product-slug" hint="Auto-generated from name" />
          </div>
          <FormField label="Description" name="description" type="textarea" value={form.description} onChange={handleChange("description")} error={errors.description} placeholder="Product description..." rows={4} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Price" name="price" type="number" value={form.price} onChange={handleChange("price")} error={errors.price} placeholder="0" prefix="$" />
            <FormField label="Original Price" name="originalPrice" type="number" value={form.originalPrice} onChange={handleChange("originalPrice")} error={errors.originalPrice} placeholder="0" prefix="$" hint="Optional, for showing discount" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Stock" name="stock" type="number" value={form.stock} onChange={handleChange("stock")} error={errors.stock} placeholder="0" />
            <FormField label="SKU" name="sku" value={form.sku} onChange={handleChange("sku")} error={errors.sku} placeholder="SKU-001" />
          </div>
          <FormField label="Image URL" name="image" type="url" value={form.image} onChange={handleChange("image")} error={errors.image} placeholder="https://" imagePreview />
        </div>

        <div className="bg-bg-soft rounded-xl border border-accent-green/10 p-6 space-y-4">
          <h2 className="text-lg font-heading font-semibold text-accent-green">Classification</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Category" name="category" type="select" value={form.category} onChange={handleChange("category")} error={errors.category} options={categories} placeholder="Select category" />
            <FormField label="Status" name="status" type="select" value={form.status} onChange={handleChange("status")} error={errors.status} options={statusOptions} />
            <FormField label="Plant Type" name="plantType" type="select" value={form.plantType} onChange={handleChange("plantType")} error={errors.plantType} options={plantTypeOptions} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Scientific Name" name="scientificName" value={form.scientificName} onChange={handleChange("scientificName")} error={errors.scientificName} placeholder="e.g. Monstera deliciosa" />
            <FormField label="Light Requirement" name="lightRequirement" value={form.lightRequirement} onChange={handleChange("lightRequirement")} error={errors.lightRequirement} placeholder="e.g. Bright indirect light" />
            <FormField label="Water Requirement" name="waterRequirement" value={form.waterRequirement} onChange={handleChange("waterRequirement")} error={errors.waterRequirement} placeholder="e.g. Water once a week" />
          </div>
          <FormField label="Care Instructions" name="careInstructions" type="textarea" value={form.careInstructions} onChange={handleChange("careInstructions")} error={errors.careInstructions} placeholder="Care instructions..." rows={3} />
        </div>

        <div className="bg-bg-soft rounded-xl border border-accent-green/10 p-6 space-y-4">
          <h2 className="text-lg font-heading font-semibold text-accent-green">Promotion</h2>
          <FormField label="Featured Product" name="isFeatured" type="checkbox" value={form.isFeatured} onChange={handleChange("isFeatured")} hint="Show this product in featured sections" />
        </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-accent-green/10">
          <Link
            href="/admin/products"
              className="px-6 py-2.5 text-sm font-medium rounded-lg border border-accent-green/15 text-accent-green/60 hover:text-accent-green hover:bg-accent-green/[3%] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-accent-green text-bg-main text-sm font-medium rounded-lg hover:bg-accent-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {loading ? "Creating..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
