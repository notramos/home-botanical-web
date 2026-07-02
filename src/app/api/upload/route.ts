import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { Jimp } from "jimp";

// Needs the Node runtime for the filesystem + jimp (not Edge).
export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_WIDTH = 1200;

export async function POST(req: NextRequest) {
  // Only admins may upload — this is a public route otherwise.
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  let file: File | null = null;
  try {
    const formData = await req.formData();
    const value = formData.get("file");
    if (value instanceof File) file = value;
  } catch {
    return NextResponse.json({ error: "Request tidak valid." }, { status: 400 });
  }

  if (!file) {
    return NextResponse.json({ error: "Tidak ada file yang diunggah." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "File harus berupa gambar (JPEG, PNG, WebP, atau GIF)." },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Ukuran gambar maksimal 5 MB." }, { status: 400 });
  }

  const inputBuffer = Buffer.from(await file.arrayBuffer());

  // Re-encode + downscale with jimp. This also strips any non-image payload
  // for the common formats. Animated GIFs can't be re-encoded, so we fall
  // back to storing the validated original bytes.
  let outputBuffer: Buffer = inputBuffer;
  let ext = "jpg";
  try {
    const image = await Jimp.read(inputBuffer);
    if (image.bitmap.width > MAX_WIDTH) {
      const height = Math.round((image.bitmap.height * MAX_WIDTH) / image.bitmap.width);
      image.resize({ w: MAX_WIDTH, h: height });
    }
    outputBuffer = await image.getBuffer("image/jpeg", { quality: 82 });
    ext = "jpg";
  } catch {
    outputBuffer = inputBuffer;
    ext =
      file.type === "image/png"
        ? "png"
        : file.type === "image/webp"
          ? "webp"
          : file.type === "image/gif"
            ? "gif"
            : "jpg";
  }

  try {
    const dir = path.join(process.cwd(), "public", "uploads", "products");
    await mkdir(dir, { recursive: true });
    const filename = `${randomUUID()}.${ext}`;
    await writeFile(path.join(dir, filename), outputBuffer);
    return NextResponse.json({ url: `/uploads/products/${filename}` });
  } catch {
    return NextResponse.json({ error: "Gagal menyimpan gambar." }, { status: 500 });
  }
}
