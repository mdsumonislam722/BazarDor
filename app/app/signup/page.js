
"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (result.error) {
        setMessage(result.error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।");
      } else {
        setMessage("অ্যাকাউন্ট তৈরি হয়েছে! এখন Login পেজে যাও।");
      }
    } catch {
      setMessage("সমস্যা হয়েছে। ডাটাবেস ও সার্ভার সেটআপ পরীক্ষা করো।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f8f3] px-4 py-10 text-gray-900">
      <section className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-7 shadow-sm sm:p-9">
        <Link href="/" className="text-xl font-black text-green-800">
          🛒 BAZAR DOR
        </Link>

        <h1 className="mt-8 text-3xl font-extrabold">
          নতুন অ্যাকাউন্ট তৈরি করুন
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Bazar Dor-এ যোগ দিন।
        </p>

        <form onSubmit={handleSignup} className="mt-7 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold">আপনার নাম</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="নাম লিখুন"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-700"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">ইমেইল</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="আপনার ইমেইল লিখুন"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-700"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">পাসওয়ার্ড</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="কমপক্ষে ৮ অক্ষর"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-700"
            />
          </div>

          {message && (
            <p role="status" className="rounded-lg bg-gray-100 p-3 text-sm">
              {message}
            </p>
          )}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-green-800 px-4 py-3 font-bold text-white hover:bg-green-900 disabled:opacity-60"
          >
            {loading ? "অপেক্ষা করো..." : "অ্যাকাউন্ট তৈরি করুন"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          আগে থেকেই অ্যাকাউন্ট আছে?{" "}
          <Link href="/login" className="font-bold text-green-800 underline">
            Login করুন
          </Link>
        </p>

        <Link href="/" className="mt-5 block text-center text-sm text-gray-500">
          ← হোম পেজে ফিরে যান
        </Link>
      </section>
    </main>
  );
}
