import { transporter } from "./nodemailer";
import { SITE_NAME } from "./constants";

const fromEmail = process.env.SMTP_USER || "noreply@homebotanical.com";
const adminEmail = process.env.ADMIN_EMAIL || "admin@homebotanical.com";

function formatPrice(price: number | string): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return `Rp ${Math.round(num).toLocaleString("id-ID")}`;
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface OrderItemData {
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface OrderData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  shippingAddress?: string | null;
  total: number;
  status: string;
  items: OrderItemData[];
}

const statusLabels: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

function itemsHtml(items: OrderItemData[]): string {
  return items
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
}

function itemsPlain(items: OrderItemData[]): string {
  return items
    .map(
      (item) =>
        `${item.productName} x${item.quantity} - ${formatPrice(item.subtotal)}`
    )
    .join("\n");
}

const SITE_ADDRESS = "123 Green Street, Sydney NSW 2000, Australia";

async function sendMail(to: string, subject: string, html: string, text: string) {
  if (!transporter) return;
  try {
    await transporter.sendMail({
      from: `"${SITE_NAME}" <${fromEmail}>`,
      to,
      subject,
      text,
      html,
      headers: {
        "List-Unsubscribe": `<mailto:unsubscribe@homebotanical.com?subject=unsubscribe>`,
        "Precedence": "bulk",
        "X-Auto-Response-Suppress": "OOF, AutoReply",
      },
    });
  } catch (error) {
    console.error("Gagal mengirim email:", error);
  }
}

export async function sendOrderConfirmation(order: OrderData) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f5f5f0;">
      <div style="max-width:600px;margin:24px auto;font-family:Arial,Helvetica,sans-serif;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:#4a7c59;padding:24px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700;">${SITE_NAME}</h1>
          <p style="color:#d1d5db;margin:4px 0 0;font-size:14px;">Premium Indoor Plants</p>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#1c1917;margin:0 0 8px;font-size:20px;">Hi ${order.customerName},</h2>
          <p style="color:#6b7280;margin:0 0 24px;font-size:15px;line-height:1.6;">Thank you for your order! We've received it and will start processing shortly. Here are your order details:</p>

          <div style="background:#fafaf9;border-radius:8px;padding:16px;margin-bottom:24px;border:1px solid #e5e7eb;font-size:14px;">
            <p style="margin:0 0 4px;"><strong style="color:#374151;">Order Number:</strong> <span style="color:#4a7c59;">${order.orderNumber}</span></p>
            <p style="margin:0 0 4px;"><strong style="color:#374151;">Date:</strong> ${formatDate()}</p>
            <p style="margin:0 0 4px;"><strong style="color:#374151;">Status:</strong> ${statusLabels[order.status] || order.status}</p>
            ${order.shippingAddress ? `<p style="margin:0;"><strong style="color:#374151;">Shipping to:</strong> ${order.shippingAddress}</p>` : ""}
          </div>

          <h3 style="color:#1c1917;margin:0 0 12px;font-size:16px;">Order Items</h3>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:14px;">
            <thead>
              <tr style="background:#f3f4f6;">
                <th style="padding:10px 12px;text-align:left;font-size:13px;color:#6b7280;font-weight:600;">Product</th>
                <th style="padding:10px 12px;text-align:center;font-size:13px;color:#6b7280;font-weight:600;">Qty</th>
                <th style="padding:10px 12px;text-align:right;font-size:13px;color:#6b7280;font-weight:600;">Price</th>
                <th style="padding:10px 12px;text-align:right;font-size:13px;color:#6b7280;font-weight:600;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml(order.items)}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding:12px;text-align:right;font-weight:bold;color:#1c1917;border-top:2px solid #e5e7eb;">Total</td>
                <td style="padding:12px;text-align:right;font-weight:bold;color:#4a7c59;font-size:18px;border-top:2px solid #e5e7eb;">${formatPrice(order.total)}</td>
              </tr>
            </tfoot>
          </table>

          <p style="color:#6b7280;font-size:14px;line-height:1.6;">We'll send you updates on your order status via email. If you have any questions, feel free to reply to this email.</p>
        </div>
        <div style="background:#1c1917;padding:24px;text-align:center;font-size:12px;color:#9ca3af;">
          <p style="margin:0 0 4px;">${SITE_NAME} &mdash; ${SITE_ADDRESS}</p>
          <p style="margin:0;">&copy; ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.</p>
          <p style="margin:4px 0 0;">
            <a href="mailto:unsubscribe@homebotanical.com?subject=unsubscribe" style="color:#6b7280;text-decoration:underline;">Unsubscribe</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = [
    `${SITE_NAME} - Order Confirmation`,
    "",
    `Hi ${order.customerName},`,
    "",
    "Thank you for your order! Here are your order details:",
    "",
    `Order Number: ${order.orderNumber}`,
    `Date: ${formatDate()}`,
    `Status: ${statusLabels[order.status] || order.status}`,
    order.shippingAddress ? `Shipping to: ${order.shippingAddress}` : "",
    "",
    "Order Items:",
    itemsPlain(order.items),
    "",
    `Total: ${formatPrice(order.total)}`,
    "",
    "We'll send you updates on your order status via email.",
    "",
    "Best regards,",
    `${SITE_NAME} Team`,
    "",
    "---",
    `${SITE_ADDRESS}`,
  ]
    .filter(Boolean)
    .join("\n");

  await sendMail(order.customerEmail, `Order Confirmation #${order.orderNumber} - ${SITE_NAME}`, html, text);
}

export async function sendAdminNotification(order: OrderData) {
  const itemsHtmlStr = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${item.productName}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${formatPrice(item.subtotal)}</td>
        </tr>`
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f5f5f0;">
      <div style="max-width:600px;margin:24px auto;font-family:Arial,Helvetica,sans-serif;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:#4a7c59;padding:24px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;">New Order Received!</h1>
        </div>
        <div style="padding:32px;">
          <div style="background:#fafaf9;border-radius:8px;padding:16px;margin-bottom:20px;border:1px solid #e5e7eb;font-size:14px;">
            <p style="margin:0 0 4px;"><strong style="color:#374151;">Order Number:</strong> ${order.orderNumber}</p>
            <p style="margin:0 0 4px;"><strong style="color:#374151;">Date:</strong> ${formatDate()}</p>
            <p style="margin:0 0 4px;"><strong style="color:#374151;">Customer:</strong> ${order.customerName}</p>
            <p style="margin:0 0 4px;"><strong style="color:#374151;">Email:</strong> ${order.customerEmail}</p>
            ${order.customerPhone ? `<p style="margin:0 0 4px;"><strong style="color:#374151;">Phone:</strong> ${order.customerPhone}</p>` : ""}
            ${order.shippingAddress ? `<p style="margin:0;"><strong style="color:#374151;">Address:</strong> ${order.shippingAddress}</p>` : ""}
          </div>

          <h3 style="color:#1c1917;margin:0 0 12px;">Order Items</h3>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:14px;">
            <thead>
              <tr style="background:#f3f4f6;">
                <th style="padding:10px 12px;text-align:left;font-size:13px;color:#6b7280;">Product</th>
                <th style="padding:10px 12px;text-align:center;font-size:13px;color:#6b7280;">Qty</th>
                <th style="padding:10px 12px;text-align:right;font-size:13px;color:#6b7280;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtmlStr}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding:12px;text-align:right;font-weight:bold;color:#1c1917;border-top:2px solid #e5e7eb;">Total</td>
                <td style="padding:12px;text-align:right;font-weight:bold;color:#4a7c59;font-size:18px;border-top:2px solid #e5e7eb;">${formatPrice(order.total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = [
    "NEW ORDER RECEIVED",
    "",
    `Order Number: ${order.orderNumber}`,
    `Date: ${formatDate()}`,
    `Customer: ${order.customerName}`,
    `Email: ${order.customerEmail}`,
    order.customerPhone ? `Phone: ${order.customerPhone}` : "",
    order.shippingAddress ? `Address: ${order.shippingAddress}` : "",
    "",
    "Order Items:",
    itemsPlain(order.items),
    "",
    `Total: ${formatPrice(order.total)}`,
    "",
    "Please process this order in the admin dashboard.",
  ]
    .filter(Boolean)
    .join("\n");

  await sendMail(adminEmail, `[Admin] New Order #${order.orderNumber} - ${SITE_NAME}`, html, text);
}

export async function sendOrderStatusUpdate(order: OrderData) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f5f5f0;">
      <div style="max-width:600px;margin:24px auto;font-family:Arial,Helvetica,sans-serif;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:#4a7c59;padding:24px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700;">${SITE_NAME}</h1>
          <p style="color:#d1d5db;margin:4px 0 0;font-size:14px;">Premium Indoor Plants</p>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#1c1917;margin:0 0 8px;font-size:20px;">Hi ${order.customerName},</h2>
          <p style="color:#6b7280;margin:0 0 24px;font-size:15px;line-height:1.6;">Your order status has been updated:</p>

          <div style="background:#fafaf9;border-radius:8px;padding:24px;margin-bottom:24px;border:1px solid #e5e7eb;text-align:center;">
            <p style="margin:0 0 8px;color:#6b7280;font-size:14px;">Current Status</p>
            <p style="margin:0;font-size:28px;font-weight:bold;color:#4a7c59;">${statusLabels[order.status] || order.status}</p>
          </div>

          <div style="background:#fafaf9;border-radius:8px;padding:16px;margin-bottom:24px;border:1px solid #e5e7eb;font-size:14px;">
            <p style="margin:0 0 4px;"><strong style="color:#374151;">Order Number:</strong> ${order.orderNumber}</p>
            <p style="margin:0;"><strong style="color:#374151;">Total:</strong> ${formatPrice(order.total)}</p>
          </div>

          <p style="color:#6b7280;font-size:14px;line-height:1.6;">Thank you for shopping at ${SITE_NAME}!</p>
        </div>
        <div style="background:#1c1917;padding:24px;text-align:center;font-size:12px;color:#9ca3af;">
          <p style="margin:0 0 4px;">${SITE_NAME} &mdash; ${SITE_ADDRESS}</p>
          <p style="margin:0;">&copy; ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.</p>
          <p style="margin:4px 0 0;">
            <a href="mailto:unsubscribe@homebotanical.com?subject=unsubscribe" style="color:#6b7280;text-decoration:underline;">Unsubscribe</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = [
    `${SITE_NAME} - Order Status Update`,
    "",
    `Hi ${order.customerName},`,
    "",
    "Your order status has been updated:",
    "",
    `Status: ${statusLabels[order.status] || order.status}`,
    `Order Number: ${order.orderNumber}`,
    `Total: ${formatPrice(order.total)}`,
    "",
    "Thank you for shopping at Home Botanical!",
    "",
    "Best regards,",
    `${SITE_NAME} Team`,
    "",
    "---",
    `${SITE_ADDRESS}`,
  ].join("\n");

  await sendMail(order.customerEmail, `Order Status Update #${order.orderNumber} - ${SITE_NAME}`, html, text);
}
