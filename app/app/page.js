
"use client";

import { useEffect, useState } from "react";

const API = "https://api.api-store.workers.dev/api/bazardor/products";

const categories = [
  { name: "সব পণ্য", slug: "" },
  { name: "চাল", slug: "chal" },
  { name: "ডাল", slug: "dal" },
  { name: "তেল", slug: "tel" },
  { name: "সবজি", slug: "sobji" },
  { name: "মাছ", slug: "mach" },
  { name: "মাংস", slug: "mangsho" },
];

const bn = (value) =>
  String(value ?? "").replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);

function getName(p) {
  return p.nameBn || p.name || p.product_name || p.title || "পণ্যের নাম";
}

function getPrice(p) {
  return Number(p.today ?? p.price ?? p.current_price ?? 0);
}

function getChange(p) {
  return Number(
    p.change?.pct ??
    p.change_percentage ??
    p.price_change_percentage ??
    p.percentage_change ??
    0
  );
}

function getUnit(p) {
  const unit = String(p.unit || "kg");
  const units = {
    kg: "কেজি",
    gram: "গ্রাম",
    g: "গ্রাম",
    liter: "লিটার",
    litre: "লিটার",
    l: "লিটার",
    piece: "টি",
    pcs: "টি",
    dozen: "ডজন",
  };

  return units[unit.toLowerCase()] || unit;
}

function getEmoji(p) {
  if (p.image && /\p{Extended_Pictographic}/u.test(p.image)) {
    return p.image;
  }

  if (p.categoryIcon) return p.categoryIcon;

  const text = `${getName(p)} ${p.category || ""}`.toLowerCase();

  if (text.includes("চাল") || text.includes("rice") || text.includes("chal")) return "🍚";
  if (text.includes("ডাল") || text.includes("lentil") || text.includes("dal")) return "🫘";
  if (text.includes("তেল") || text.includes("oil") || text.includes("tel")) return "🫗";
  if (text.includes("মাছ") || text.includes("fish") || text.includes("mach")) return "🐟";
  if (text.includes("মাংস") || text.includes("meat") || text.includes("beef")) return "🥩";
  if (text.includes("ডিম") || text.includes("egg")) return "🥚";
  if (text.includes("আলু") || text.includes("potato")) return "🥔";
  if (text.includes("পেঁয়াজ") || text.includes("পিঁয়াজ") || text.includes("onion")) return "🧅";
  if (text.includes("মরিচ") || text.includes("chili")) return "🌶️";
  if (text.includes("সবজি") || text.includes("vegetable") || text.includes("sobji")) return "🥬";
  if (text.includes("মুরগি") || text.includes("chicken")) return "🍗";

  return "🛒";
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("name");

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch(API);

        if (!response.ok) {
          throw new Error("পণ্যের তথ্য পাওয়া যায়নি");
        }

        const result = await response.json();

        const list = Array.isArray(result)
          ? result
          : result.data?.products ||
            result.data?.data ||
            result.data ||
            result.products ||
            [];

        if (!Array.isArray(list)) {
          throw new Error("পণ্যের তথ্যের ফরম্যাট সঠিক নয়");
        }

        setProducts(list);
      } catch (err) {
        console.error("BazarDor API error:", err);
        setError(
          "এখন পণ্যের তথ্য লোড হচ্ছে না। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করো।"
        );
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filtered = products
    .filter((p) => {
      const name = getName(p).toLowerCase();
      const matchSearch = name.includes(search.toLowerCase());

      const cat = String(p.category || p.category_slug || "").toLowerCase();

      const matchCategory =
        !category ||
        cat === category ||
        String(p.categoryNameBn || "").includes(
          categories.find((c) => c.slug === category)?.name || category
        );

      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sort === "price-low") {
        return getPrice(a) - getPrice(b);
      }

      if (sort === "price-high") {
        return getPrice(b) - getPrice(a);
      }

      if (sort === "change") {
        return getChange(b) - getChange(a);
      }

      return getName(a).localeCompare(getName(b), "bn");
    });

  const risers = [...products]
    .sort((a, b) => getChange(b) - getChange(a))
    .slice(0, 3);

  const fallers = [...products]
    .sort((a, b) => getChange(a) - getChange(b))
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[#f7f8f3] text-[#20291f]">
      <div className="bg-[#183d2a] px-4 py-2 text-center text-xs font-medium text-white sm:text-sm">
        বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর — এক জায়গায়, সহজেই।
      </div>

      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <a href="/" className="flex shrink-0 items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1d5637] text-xl text-white">
              ৳
            </span>
            <span>
              <span className="block text-xl font-black tracking-tight">
                Bazar<span className="text-[#39804e]">Dor</span>
              </span>
              <span className="block text-[10px] font-medium text-gray-500">
                বাজারদর জানুন, বুঝে কিনুন
              </span>
            </span>
          </a>

          <a
            href="/signin"
            className="rounded-full border border-gray-200 px-4 py-2 text-sm font-bold transition hover:bg-gray-100"
          >
            লগইন ↗
          </a>
        </div>

        <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-3 sm:px-6">
          {categories.map((c) => (
            <button
              key={c.slug || "all"}
              onClick={() => setCategory(c.slug)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                category === c.slug
                  ? "bg-[#1d5637] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-green-50"
              }`}
            >
              {c.name}
            </button>
          ))}
        </nav>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 sm:py-16 lg:grid-cols-2 lg:py-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#e4efdf] px-4 py-2 text-xs font-bold text-[#28603a] sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-green-600"></span>
            আপনার প্রতিদিনের বাজার সহযোগী
          </span>

          <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            বাজারের সঠিক দাম,
            <span className="mt-2 block text-[#39804e]">
              সিদ্ধান্ত আপনার।
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
            চাল, ডাল, তেল থেকে শুরু করে নিত্যপ্রয়োজনীয় পণ্যের দাম দেখুন।
            বাজার করার আগে জেনে নিন আজকের দর।
          </p>

          <a
            href="#products"
            className="mt-7 inline-flex items-center gap-3 rounded-xl bg-[#1d5637] px-6 py-4 font-bold text-white shadow-lg shadow-green-900/10 transition hover:bg-[#143e27]"
          >
            আজকের বাজারদর দেখুন <span>↓</span>
          </a>

          <p className="mt-4 text-xs text-gray-500">
            তথ্য API থেকে লোড হয়। কেনার আগে স্থানীয় বাজারে দাম যাচাই করুন।
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] bg-[#e7efdf] p-6 sm:p-10">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[#cbdcbe]"></div>

          <div className="relative rounded-3xl border border-white/80 bg-white/85 p-5 shadow-xl shadow-green-950/5 backdrop-blur sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  আজকের বাজার
                </p>
                <h2 className="mt-1 text-2xl font-black">
                  কী কিনবেন আজ?
                </h2>
              </div>
              <span className="text-4xl">🧺</span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                ["🍚", "চাল", "প্রতিদিনের খাবার", "chal"],
                ["🫘", "ডাল", "প্রোটিনের উৎস", "dal"],
                ["🥬", "সবজি", "তাজা পুষ্টি", "sobji"],
                ["🐟", "মাছ", "প্রিয় বাঙালি খাবার", "mach"],
              ].map(([emoji, title, sub, slug]) => (
                <button
                  key={title}
                  onClick={() => {
                    setSearch("");
                    setCategory(slug);
                    document
                      .getElementById("products")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="rounded-2xl border border-gray-100 bg-white p-4 text-left transition hover:-translate-y-1 hover:border-green-200 hover:shadow-md"
                >
                  <span className="text-3xl">{emoji}</span>
                  <span className="mt-3 block font-bold">{title}</span>
                  <span className="mt-1 block text-xs text-gray-500">
                    {sub}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <p className="relative mt-4 text-center text-xs font-medium text-[#44634a]">
            সহজ তথ্য • স্মার্ট কেনাকাটা • সচেতন বাজেট
          </p>
        </div>
      </section>

      <section className="border-y border-[#e5e9df] bg-white py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 text-sm sm:px-6">
          <span className="font-black text-[#1d5637]">বাজার আপডেট</span>
          <span className="text-gray-600">দাম তুলনা করুন</span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-600">বাজেট বুঝে বাজার করুন</span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-600">
            নিত্যপণ্যের দর এক জায়গায়
          </span>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#39804e]">
              Market Trends
            </p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              দামের ওঠানামা
            </h2>
          </div>
          <span className="text-xs text-gray-500">
            API-তে পাওয়া তথ্য অনুযায়ী
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-green-100 bg-white p-5 sm:p-6">
            <h3 className="flex items-center gap-2 font-bold">
              <span className="rounded-lg bg-green-100 p-2">↗</span>
              দাম বাড়ার তালিকা
            </h3>

            {loading ? (
              <p className="mt-5 animate-pulse text-sm text-gray-400">
                তথ্য লোড হচ্ছে...
              </p>
            ) : risers.length ? (
              <div className="mt-4 divide-y divide-gray-100">
                {risers.map((p) => (
                  <div
                    key={p.id ?? p.slug ?? getName(p)}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <span className="text-sm font-semibold">
                      {getEmoji(p)} {getName(p)}
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        getChange(p) > 0
                          ? "text-red-600"
                          : getChange(p) < 0
                            ? "text-green-700"
                            : "text-gray-500"
                      }`}
                    >
                      {getChange(p) > 0 ? "+" : ""}
                      {bn(getChange(p))}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-500">
                এখনো তথ্য পাওয়া যায়নি।
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-blue-100 bg-white p-5 sm:p-6">
            <h3 className="flex items-center gap-2 font-bold">
              <span className="rounded-lg bg-blue-100 p-2">↘</span>
              দাম কমার তালিকা
            </h3>

            {loading ? (
              <p className="mt-5 animate-pulse text-sm text-gray-400">
                তথ্য লোড হচ্ছে...
              </p>
            ) : fallers.length ? (
              <div className="mt-4 divide-y divide-gray-100">
                {fallers.map((p) => (
                  <div
                    key={p.id ?? p.slug ?? getName(p)}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <span className="text-sm font-semibold">
                      {getEmoji(p)} {getName(p)}
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        getChange(p) < 0
                          ? "text-green-700"
                          : getChange(p) > 0
                            ? "text-red-600"
                            : "text-gray-500"
                      }`}
                    >
                      {getChange(p) > 0 ? "+" : ""}
                      {bn(getChange(p))}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-500">
                এখনো তথ্য পাওয়া যায়নি।
              </p>
            )}
          </div>
        </div>
      </section>

      <section id="products" className="bg-[#edf1e9] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#39804e]">
                Daily Essentials
              </p>
              <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                সব পণ্যের বাজারদর
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                পণ্য খুঁজুন এবং দাম অনুযায়ী সাজান।
              </p>
            </div>
            <span className="w-fit rounded-full bg-white px-4 py-2 text-sm font-bold">
              {bn(filtered.length)}টি পণ্য
            </span>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
              <span className="text-lg">⌕</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="পণ্যের নাম লিখে খুঁজুন..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold outline-none"
            >
              <option value="name">নাম অনুযায়ী</option>
              <option value="price-low">দাম: কম থেকে বেশি</option>
              <option value="price-high">দাম: বেশি থেকে কম</option>
              <option value="change">দাম পরিবর্তন অনুযায়ী</option>
            </select>
          </div>

          {loading ? (
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="animate-pulse rounded-2xl bg-white p-5"
                >
                  <div className="h-14 w-14 rounded-xl bg-gray-200"></div>
                  <div className="mt-5 h-4 w-2/3 rounded bg-gray-200"></div>
                  <div className="mt-3 h-4 w-1/2 rounded bg-gray-100"></div>
                  <div className="mt-6 h-10 rounded bg-gray-100"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="mt-7 rounded-2xl border border-red-100 bg-white p-6 text-center">
              <p className="font-bold text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded-lg bg-[#1d5637] px-5 py-3 text-sm font-bold text-white"
              >
                আবার চেষ্টা করুন
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-7 rounded-2xl bg-white p-10 text-center">
              <span className="text-4xl">🔎</span>
              <p className="mt-3 font-bold">কোনো পণ্য পাওয়া যায়নি</p>
              <p className="mt-1 text-sm text-gray-500">
                অন্য নাম দিয়ে খুঁজে দেখুন।
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("");
                }}
                className="mt-4 font-bold text-green-800 underline"
              >
                সব পণ্য দেখুন
              </button>
            </div>
          ) : (
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p, i) => {
                const change = getChange(p);
                const slug = p.slug || p.id || p.product_id;

                return (
                  <article
                    key={slug ?? getName(p) + i}
                    className="group rounded-2xl border border-gray-100 bg-white p-5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-green-950/5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f0f4eb] text-4xl">
                        {getEmoji(p)}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                          change > 0
                            ? "bg-red-50 text-red-600"
                            : change < 0
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {change > 0 ? "↗ +" : change < 0 ? "↘ " : "— "}
                        {bn(Math.abs(change))}%
                      </span>
                    </div>

                    <h3 className="mt-5 text-lg font-black">
                      {getName(p)}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      প্রতি {getUnit(p)}
                    </p>

                    <div className="mt-5 flex items-end justify-between gap-3 border-t border-gray-100 pt-4">
                      <div>
                        <p className="text-xs text-gray-500">বর্তমান দাম</p>
                        <p className="mt-1 text-2xl font-black text-[#1d5637]">
                          ৳{bn(getPrice(p))}
                        </p>
                      </div>

                      <a
                        href={slug ? `/product/${slug}` : "/signin"}
                        className="rounded-xl bg-[#edf3e9] px-4 py-3 text-sm font-bold text-[#1d5637] transition group-hover:bg-[#1d5637] group-hover:text-white"
                      >
                        বিস্তারিত ↗
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <footer className="bg-[#153a27] px-4 py-10 text-white sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-2xl font-black">
              BazarDor<span className="text-[#a6d49a]">.</span>
            </p>
            <p className="mt-2 max-w-md text-sm leading-6 text-green-100/75">
              বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর জানতে আপনার সহজ সঙ্গী।
            </p>
          </div>

          <div className="text-sm text-green-100/75">
            <p>© {bn(new Date().getFullYear())} BazarDor</p>
            <p className="mt-2">সচেতন বাজার, সাশ্রয়ী জীবন।</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
