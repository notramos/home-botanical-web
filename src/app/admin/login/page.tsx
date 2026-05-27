"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LeafIcon } from "@/components/shared/icons";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email atau password salah");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {Array.from({ length: 10 }).map((_, i) => (
            <path
              key={i}
              d={`M${i * 10} 100 Q${i * 10 + 5} 50 ${i * 10} 0`}
              stroke="currentColor"
              strokeWidth="0.5"
              fill="none"
            />
          ))}
        </svg>
      </div>

      <div className="relative w-full max-w-md mx-4">
        <div className="bg-bg-soft border border-white/10 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-green/10 mb-4">
              <LeafIcon className="w-8 h-8 text-accent-green" />
            </div>
            <h1 className="font-heading text-3xl font-semibold text-text-light">
              Home Botanical
            </h1>
            <p className="text-sm text-text-muted mt-1">Admin Console</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-danger/10 border border-danger/20 rounded-lg px-4 py-3">
                <p className="text-sm text-danger">{error}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-text-light">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@homebotanical.com"
                required
                className="w-full bg-bg-main border border-white/10 rounded-lg px-4 py-2.5 text-sm text-text-light placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent-green/40 focus:border-accent-light transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-text-light">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-bg-main border border-white/10 rounded-lg px-4 py-2.5 text-sm text-text-light placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent-green/40 focus:border-accent-light transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-accent-green text-bg-main font-medium rounded-lg hover:bg-accent-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-xs text-text-muted/60">
          &copy; {new Date().getFullYear()} Home Botanical. All rights reserved.
        </p>
      </div>
    </div>
  );
}
