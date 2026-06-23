import {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
} from "@whiskeysockets/baileys";

let sock: ReturnType<typeof makeWASocket> | null = null;
let connected = false;

const adminPhone = process.env.ADMIN_PHONE || "";

async function initWA() {
  const { state, saveCreds } = await useMultiFileAuthState("wa_session");

  sock = makeWASocket({ auth: state });

  sock.ev.on("creds.update", saveCreds);

  if (!sock.authState.creds?.registered) {
    const phone = adminPhone.replace(/[^0-9]/g, "");
    if (phone) {
      setTimeout(async () => {
        try {
          const code = await sock!.requestPairingCode(phone);
          console.log("\n═══════════════════════════════════════════");
          console.log("  🔑 WhatsApp Pairing Code:");
          console.log(`  ${code}`);
          console.log("═══════════════════════════════════════════");
          console.log("  Buka WhatsApp > Settings > Linked Devices");
          console.log("  > Link a Device > masukkan kode di atas\n");
        } catch (err) {
          console.error("Gagal generate pairing code:", err);
        }
      }, 2000);
    }
  }

  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "open") {
      connected = true;
      console.log("✅ WhatsApp terhubung!");
    } else if (connection === "close") {
      connected = false;
      const shouldReconnect =
        (lastDisconnect?.error as any)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      if (shouldReconnect) initWA();
    }
  });
}

let initPromise: Promise<void> | null = null;

function ensureConnected() {
  if (!initPromise) {
    initPromise = initWA().catch(() => {
      initPromise = null;
    });
  }
}

function formatPrice(price: number | string): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return `Rp ${num.toLocaleString("id-ID")}`;
}

interface OrderData {
  orderNumber: string;
  customerName: string;
  customerPhone?: string | null;
  total: number;
  status: string;
}

async function sendWA(target: string, message: string): Promise<void> {
  if (!sock || !connected) {
    console.warn("WhatsApp belum terhubung, pesan tidak terkirim");
    return;
  }
  try {
    const jid = target.includes("@s.whatsapp.net")
      ? target
      : `${target}@s.whatsapp.net`;
    await sock.sendMessage(jid, { text: message });
  } catch (error) {
    console.error("Gagal mengirim WhatsApp:", error);
  }
}

export async function sendAdminNotification(order: OrderData) {
  ensureConnected();
  if (!adminPhone) return;

  const message = `🔔 *PESANAN BARU* 🔔

*No. Pesanan:* ${order.orderNumber}
*Pelanggan:* ${order.customerName}
${order.customerPhone ? `*Telepon:* ${order.customerPhone}` : ""}
*Total:* ${formatPrice(order.total)}

Silakan proses pesanan ini di dashboard admin.`;

  await sendWA(adminPhone, message);
}
