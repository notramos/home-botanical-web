"use client";

import { cn } from "@/lib/utils";

interface DeleteModalProps {
  show: boolean;
  title: string;
  itemName: string;
  onClose: () => void;
  onConfirm: () => void;
  processing?: boolean;
}

export default function DeleteModal({
  show,
  title,
  itemName,
  onClose,
  onConfirm,
  processing,
}: DeleteModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={!processing ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-bg-soft border border-accent-green/10 rounded-xl shadow-2xl animate-scale-in">
        <div className="p-6">
          {/* Icon */}
          <div className="mx-auto w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-accent-green text-center mb-2">
            {title}
          </h3>

          {/* Warning Text */}
          <p className="text-sm text-accent-green/70 text-center mb-6">
            Apakah Anda yakin ingin menghapus{" "}
            <span className="text-accent-green font-medium">{itemName}</span>
            ? Tindakan ini tidak dapat dibatalkan.
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={processing}
              className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg border border-accent-green/15 text-accent-green/60 hover:text-accent-green hover:bg-accent-green/[3%] transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={processing}
              className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg bg-danger text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {processing ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
