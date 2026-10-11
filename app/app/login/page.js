"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        setMessage(result.error.message || "Login করা যায়নি। তথ্য যাচাই করুন।");
        return;
      }

      setMessage("Login সফল হয়েছে!");
      router.push("/");
      router.refresh();
    } catch (error) {
      setMessage(
        error.message || "Login ব্যর্থ হয়েছে। আবার চেষ্টা করুন।"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0b0d0c] px-4 py-12 text-white">
      <div className="mx-auto max-w-md">
        <Link href="/" className="text-xl font-black tracking-wider text-green-400">
          🛒 BAZAR DOR
        </Link>

        <section className="mt-8 rounded-2xl border border-white/10 bg-[#141715] p-6 sm:p-8">
          <h1 className="text-2xl font-bold">আবার ফিরে আসুন</h1>
          <p className="mt-2 text-sm text-gray-400">
            আপনার অ্যাকাউন্টে Login করুন।
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm">
                ইমেইল
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="আপনার ইমেইল লিখুন"
                className="w-full rounded-lg border border-white/10 bg-[#0b0d0c] px-4 py-3 outline-none focus:border-green-400"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm">
                পাসওয়ার্ড
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="আপনার পাসওয়ার্ড লিখুন"
                className="w-full rounded-lg border border-white/10 bg-[#0b0d0c] px-4 py-3 outline-none focus:border-green-400"
              />
            </div>

            {message && (
              <p role="status" className="text-sm text-yellow-300">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-400 px-4 py-3 font-bold text-black transition hover:bg-green-300 disabled:opacity-60"
            >
              {loading ? "Login হচ্ছে..." : "Login করুন"}
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-400">
            নতুন অ্যাকাউন্ট লাগবে?{" "}
            <Link href="/signup" className="font-semibold text-green-400">
              Sign up করুন
            </Link>
          </p>
        </section>

        <Link href="/" className="mt-6 inline-block text-sm text-gray-400 hover:text-white">
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}