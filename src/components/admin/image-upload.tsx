"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface ImageUploadProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  error?: string;
}

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export default function ImageUpload({
  label = "Product Image",
  value,
  onChange,
  hint,
  error,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showUrl, setShowUrl] = useState(false);

  async function upload(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar.");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Ukuran gambar maksimal 5 MB.");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload gagal.");
      onChange(data.url as string);
      toast.success("Gambar terunggah.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload gagal.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <button
          type="button"
          onClick={() => setShowUrl((s) => !s)}
          className="text-xs text-accent-green/70 hover:text-accent-green transition-colors"
        >
          {showUrl ? "Sembunyikan URL" : "Tempel URL"}
        </button>
      </div>

      {value ? (
        <div className="flex items-start gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="w-28 h-28 rounded-lg object-cover border border-accent-green/15 bg-muted"
            onError={(e) => {
              (e.target as HTMLImageElement).style.opacity = "0.4";
            }}
          />
          <div className="flex flex-col gap-2 pt-1">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="text-sm px-3 py-1.5 rounded-lg border border-accent-green/20 text-accent-green hover:bg-accent-green/[6%] transition-colors disabled:opacity-50"
            >
              {uploading ? "Mengunggah..." : "Ganti gambar"}
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-sm px-3 py-1.5 rounded-lg border border-danger/20 text-danger hover:bg-danger/10 transition-colors"
            >
              Hapus
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files?.[0];
            if (f) upload(f);
          }}
          disabled={uploading}
          className={cn(
            "w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors",
            dragOver
              ? "border-emerald bg-emerald/5"
              : "border-accent-green/25 hover:border-accent-green/50 hover:bg-accent-green/[3%]",
            error && "border-destructive"
          )}
        >
          {uploading ? (
            <svg className="w-6 h-6 animate-spin text-accent-green" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-7 h-7 text-accent-green/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          )}
          <span className="text-sm text-accent-green/80">
            {uploading ? "Mengunggah..." : "Klik atau seret gambar ke sini"}
          </span>
          <span className="text-xs text-text-muted">JPEG, PNG, WebP, GIF — maks. 5 MB</span>
        </button>
      )}

      {showUrl && (
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://contoh.com/gambar.jpg"
          className="w-full mt-1 bg-bg-main border border-accent-green/15 rounded-lg px-3 py-2 text-sm text-accent-green placeholder:text-accent-green/40 focus:outline-none focus:ring-2 focus:ring-accent-green/40 transition-all"
        />
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
        }}
      />

      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
