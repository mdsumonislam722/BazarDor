
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProductDetails() {
  const params = useParams();
  const slug = params.slug;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getProduct() {
      try {
        const response = await fetch(
          "https://api.api-store.workers.dev/api/bazardor/products"
        );

        if (!response.ok) {
          throw new Error("পণ্যের তথ্য লোড করা যায়নি");
        }

        const result = await response.json();
        const products = Array.isArray(result)
          ? result
          : result.data || result.products || [];

        const found = products.find((item) => item.slug === slug);

        if (!found) {
          setError("পণ্যটি খুঁজে পাওয়া যায়নি।");
        } else {
          setProduct(found);
        }
      } catch {
        setError("সমস্যা হয়েছে। আবার চেষ্টা করো।");
      } finally {
        setLoading(false);
      }
    }

    if (slug) getProduct();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f8f3] p-8 text-center text-gray-700">
        পণ্যের তথ্য লোড হচ্ছে...
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-[#f8f8f3] p-8 text-center">
        <h1 className="mb-4 text-2xl font-bold">{error || "পণ্য পাওয়া যায়নি"}</h1>
        <Link href="/" className="font-semibold text-green-700 underline">
          হোম পেজে ফিরে যাও
        </Link>
      </main>
    );
  }

  const change = Number(product.change?.pct || 0);
  const markets = Array.isArray(product.markets) ? product.markets : [];

  return (
    <main className="min-h-screen bg-[#f8f8f3] px-4 py-8 text-gray-900 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="mb-6 inline-block font-semibold text-green-700">
          ← হোম পেজে ফিরে যাও
        </Link>

        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
          <div className="mb-5 text-5xl">
            {product.categoryIcon || "🛒"}
          </div>

          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-green-700">
            {product.categoryNameBn || product.category || "বাজারদর"}
          </p>

          <h1 className="mb-3 text-3xl font-extrabold sm:text-4xl">
            {product.nameBn}
          </h1>

          <p className="mb-6 text-gray-500">
            একক: {product.unit || "প্রতি কেজি"}
          </p>

          <div className="rounded-2xl bg-green-50 p-6">
            <p className="text-sm text-gray-600">আজকের দাম</p>
            <p className="my-2 text-4xl font-extrabold text-green-800">
              ৳{product.today}
            </p>
            <p className={change > 0 ? "font-semibold text-red-600" : change < 0 ? "font-semibold text-green-700" : "font-semibold text-gray-600"}>
              {change > 0 ? "▲" : change < 0 ? "▼" : "—"}{" "}
              {Math.abs(change)}% গত দিনের তুলনায়
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">গতকালের দাম</p>
              <p className="mt-2 text-xl font-bold">৳{product.yesterday ?? "—"}</p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">গত সপ্তাহের দাম</p>
              <p className="mt-2 text-xl font-bold">৳{product.lastWeek ?? "—"}</p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">গত মাসের দাম</p>
              <p className="mt-2 text-xl font-bold">৳{product.lastMonth ?? "—"}</p>
            </div>
          </div>

          {markets.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-4 text-xl font-bold">বাজারভিত্তিক দাম</h2>

              <div className="space-y-3">
                {markets.map((market, index) => (
                  <div
                    key={market.id || market.name || index}
                    className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 p-4"
                  >
                    <span className="font-medium">
                      {market.nameBn || market.marketNameBn || market.name || market.market || `বাজার ${index + 1}`}
                    </span>
                    <span className="font-bold text-green-800">
                      ৳{market.price ?? market.today ?? "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
