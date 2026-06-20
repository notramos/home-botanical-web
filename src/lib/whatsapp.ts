const fonnteApiKey = process.env.FONNTE_API_KEY;
const adminPhone = process.env.ADMIN_PHONE || "";

const FONNTE_URL = "https://api.fonnte.com/send";

function formatPrice(price: number | string): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return `Rp ${num.toLocaleString("id-ID")}`;
}

const statusLabels: Record<string, string> = {
  pending: "Menunggu Konfirmasi",
  processing: "Diproses",
  shipped: "Dikirim",
  delivered: "Selesai",
  cancelled: "Dibatalkan",
  refunded: "Dikembalikan",
};

interface OrderData {
  orderNumber: string;
  customerName: string;
  customerPhone?: string | null;
  total: number;
  status: string;
}

async function sendWA(target: string, message: string): Promise<void> {
  if (!fonnteApiKey || !target) return;

  try {
    const formData = new FormData();
    formData.append("target", target);
    formData.append("message", message);

    const res = await fetch(FONNTE_URL, {
      method: "POST",
      headers: {
        Authorization: fonnteApiKey,
      },
      body: formData,
    });

    const result = await res.json();
    if (!result.status) {
      console.error("Fonnte error:", result);
    }
  } catch (error) {
    console.error("Gagal mengirim WhatsApp:", error);
  }
}

export async function sendOrderConfirmation(order: OrderData) {
  if (!order.customerPhone) return;

  const message = `🌿 *Home Botanical*
Hai ${order.customerName},

Pesanan Anda telah kami terima! ✅

*No. Pesanan:* ${order.orderNumber}
*Total:* ${formatPrice(order.total)}
*Status:* ${statusLabels[order.status] || order.status}

Kami akan mengirimkan update status pesanan melalui WhatsApp. Terima kasih telah berbelanja di Home Botanical! 🌱`;

  await sendWA(order.customerPhone, message);
}

export async function sendAdminNotification(order: OrderData) {
  if (!adminPhone) return;

  const message = `🔔 *PESANAN BARU* 🔔

*No. Pesanan:* ${order.orderNumber}
*Pelanggan:* ${order.customerName}
${order.customerPhone ? `*Telepon:* ${order.customerPhone}` : ""}
*Total:* ${formatPrice(order.total)}

Silakan proses pesanan ini di dashboard admin.`;

  await sendWA(adminPhone, message);
}

export async function sendOrderStatusUpdate(order: OrderData) {
  if (!order.customerPhone) return;

  const message = `🌿 *Home Botanical*
Hai ${order.customerName},

Status pesanan Anda telah diperbarui! 📦

*No. Pesanan:* ${order.orderNumber}
*Status:* ${statusLabels[order.status] || order.status}
*Total:* ${formatPrice(order.total)}

Terima kasih telah berbelanja di Home Botanical! 🌱`;

  await sendWA(order.customerPhone, message);
}
