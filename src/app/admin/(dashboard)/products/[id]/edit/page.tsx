import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import EditProductClient from "./edit-product-client";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const productId = parseInt(id);
  if (isNaN(productId)) notFound();

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || product.deletedAt) notFound();

  return <EditProductClient product={JSON.parse(JSON.stringify(product))} />;
}
