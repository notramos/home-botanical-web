import { resend } from "./resend";
import { SITE_NAME } from "./constants";

const fromEmail = process.env.ADMIN_EMAIL || "noreply@homebotanical.com";
const adminEmail = process.env.ADMIN_EMAIL || "admin@homebotanical.com";

function formatPrice(price: number | string): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return `Rp ${num.toLocaleString("id-ID")}`;
}

function formatDate(): string {
  return new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface OrderData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  shippingAddress?: string | null;
  total: number;
  status: string;
  items: { productName: string; quantity: number; price: number; subtotal: number }[];
}

const statusLabels: Record<string, string> = {
  pending: "Menunggu Konfirmasi",
  processing: "Diproses",
  shipped: "Dikirim",
  delivered: "Selesai",
  cancelled: "Dibatalkan",
  refunded: "Dikembalikan",
};

export async function sendOrderConfirmation(order: OrderData) {
  if (!resend) return;

  const itemsHtml = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${item.productName}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${formatPrice(item.price)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${formatPrice(item.subtotal)}</td>
        </tr>`
    )
    .join("");

  try {
    await resend.emails.send({
      from: `${SITE_NAME} <${fromEmail}>`,
      to: [order.customerEmail],
      subject: `Konfirmasi Pesanan #${order.orderNumber} - ${SITE_NAME}`,
      html: `
        <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;">
          <div style="background:#4a7c59;padding:24px;text-align:center;border-radius:12px 12px 0 0;">
            <h1 style="color:#fff;margin:0;font-size:24px;">${SITE_NAME}</h1>
          </div>
          <div style="background:#fafaf9;padding:32px;border:1px solid #e5e7eb;border-top:0;">
            <h2 style="color:#1c1917;margin:0 0 8px;">Halo ${order.customerName},</h2>
            <p style="color:#6b7280;margin:0 0 20px;">Pesanan Anda telah kami terima. Berikut detail pesanan Anda:</p>

            <div style="background:#fff;border-radius:8px;padding:16px;margin-bottom:20px;border:1px solid #e5e7eb;">
              <p style="margin:0 0 4px;"><strong>No. Pesanan:</strong> ${order.orderNumber}</p>
              <p style="margin:0 0 4px;"><strong>Tanggal:</strong> ${formatDate()}</p>
              <p style="margin:0 0 4px;"><strong>Status:</strong> ${statusLabels[order.status] || order.status}</p>
              ${order.shippingAddress ? `<p style="margin:0;"><strong>Alamat:</strong> ${order.shippingAddress}</p>` : ""}
            </div>

            <h3 style="color:#1c1917;margin:0 0 12px;">Detail Produk</h3>
            <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
              <thead>
                <tr style="background:#f3f4f6;">
                  <th style="padding:8px 12px;text-align:left;font-size:13px;color:#6b7280;">Produk</th>
                  <th style="padding:8px 12px;text-align:center;font-size:13px;color:#6b7280;">Qty</th>
                  <th style="padding:8px 12px;text-align:right;font-size:13px;color:#6b7280;">Harga</th>
                  <th style="padding:8px 12px;text-align:right;font-size:13px;color:#6b7280;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding:12px;text-align:right;font-weight:bold;color:#1c1917;">Total</td>
                  <td style="padding:12px;text-align:right;font-weight:bold;color:#4a7c59;font-size:18px;">${formatPrice(order.total)}</td>
                </tr>
              </tfoot>
            </table>

            <p style="color:#6b7280;font-size:14px;">Kami akan mengirimkan update status pesanan melalui email dan WhatsApp. Terima kasih telah berbelanja di ${SITE_NAME}!</p>
          </div>
          <div style="background:#1c1917;padding:16px;text-align:center;border-radius:0 0 12px 12px;">
            <p style="color:#9ca3af;margin:0;font-size:12px;">© ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.</p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Gagal mengirim email konfirmasi:", error);
  }
}

export async function sendAdminNotification(order: OrderData) {
  if (!resend) return;

  const itemsHtml = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${item.productName}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${formatPrice(item.subtotal)}</td>
        </tr>`
    )
    .join("");

  try {
    await resend.emails.send({
      from: `${SITE_NAME} <${fromEmail}>`,
      to: [adminEmail],
      subject: `[Notifikasi Admin] Pesanan Baru #${order.orderNumber} - ${SITE_NAME}`,
      html: `
        <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;">
          <div style="background:#4a7c59;padding:24px;text-align:center;border-radius:12px 12px 0 0;">
            <h1 style="color:#fff;margin:0;font-size:24px;">Pesanan Baru Masuk!</h1>
          </div>
          <div style="background:#fafaf9;padding:32px;border:1px solid #e5e7eb;border-top:0;">
            <div style="background:#fff;border-radius:8px;padding:16px;margin-bottom:20px;border:1px solid #e5e7eb;">
              <p style="margin:0 0 4px;"><strong>No. Pesanan:</strong> ${order.orderNumber}</p>
              <p style="margin:0 0 4px;"><strong>Tanggal:</strong> ${formatDate()}</p>
              <p style="margin:0 0 4px;"><strong>Pelanggan:</strong> ${order.customerName}</p>
              <p style="margin:0 0 4px;"><strong>Email:</strong> ${order.customerEmail}</p>
              ${order.customerPhone ? `<p style="margin:0 0 4px;"><strong>Telepon:</strong> ${order.customerPhone}</p>` : ""}
              ${order.shippingAddress ? `<p style="margin:0;"><strong>Alamat:</strong> ${order.shippingAddress}</p>` : ""}
            </div>

            <h3 style="color:#1c1917;margin:0 0 12px;">Detail Produk</h3>
            <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
              <thead>
                <tr style="background:#f3f4f6;">
                  <th style="padding:8px 12px;text-align:left;font-size:13px;color:#6b7280;">Produk</th>
                  <th style="padding:8px 12px;text-align:center;font-size:13px;color:#6b7280;">Qty</th>
                  <th style="padding:8px 12px;text-align:right;font-size:13px;color:#6b7280;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding:12px;text-align:right;font-weight:bold;color:#1c1917;">Total</td>
                  <td style="padding:12px;text-align:right;font-weight:bold;color:#4a7c59;font-size:18px;">${formatPrice(order.total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Gagal mengirim notifikasi admin:", error);
  }
}

export async function sendOrderStatusUpdate(order: OrderData) {
  if (!resend) return;

  try {
    await resend.emails.send({
      from: `${SITE_NAME} <${fromEmail}>`,
      to: [order.customerEmail],
      subject: `Update Status Pesanan #${order.orderNumber} - ${SITE_NAME}`,
      html: `
        <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;">
          <div style="background:#4a7c59;padding:24px;text-align:center;border-radius:12px 12px 0 0;">
            <h1 style="color:#fff;margin:0;font-size:24px;">${SITE_NAME}</h1>
          </div>
          <div style="background:#fafaf9;padding:32px;border:1px solid #e5e7eb;border-top:0;">
            <h2 style="color:#1c1917;margin:0 0 8px;">Halo ${order.customerName},</h2>
            <p style="color:#6b7280;margin:0 0 20px;">Status pesanan Anda telah diperbarui:</p>

            <div style="background:#fff;border-radius:8px;padding:16px;margin-bottom:20px;border:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0 0 8px;color:#6b7280;font-size:14px;">Status Pesanan</p>
              <p style="margin:0;font-size:24px;font-weight:bold;color:#4a7c59;">${statusLabels[order.status] || order.status}</p>
            </div>

            <div style="background:#fff;border-radius:8px;padding:16px;margin-bottom:20px;border:1px solid #e5e7eb;">
              <p style="margin:0 0 4px;"><strong>No. Pesanan:</strong> ${order.orderNumber}</p>
              <p style="margin:0;"><strong>Total:</strong> ${formatPrice(order.total)}</p>
            </div>

            <p style="color:#6b7280;font-size:14px;">Terima kasih telah berbelanja di ${SITE_NAME}!</p>
          </div>
          <div style="background:#1c1917;padding:16px;text-align:center;border-radius:0 0 12px 12px;">
            <p style="color:#9ca3af;margin:0;font-size:12px;">© ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.</p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Gagal mengirim email update status:", error);
  }
}
