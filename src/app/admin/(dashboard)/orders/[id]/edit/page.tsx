import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import EditOrderClient from "./edit-order-client";

interface EditOrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditOrderPage({ params }: EditOrderPageProps) {
  const { id } = await params;
  const orderId = parseInt(id);
  if (isNaN(orderId)) notFound();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) notFound();

  return <EditOrderClient order={JSON.parse(JSON.stringify(order))} />;
}
