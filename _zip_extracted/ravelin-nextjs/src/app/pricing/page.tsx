import React from "react";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 space-y-10">
      <div className="space-y-2">
        <div className="font-mono text-xs text-emerald uppercase">Transparent Pricing</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Pay only for what you use</h1>
        <p className="text-sm text-neutral-400">
          Every plan gets the same co-located node, private sends, revert protection, and 90% backrun rebates.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { name: "Free", price: "$0 forever", units: "5M request units", rpm: "1,000 req / min" },
          { name: "Builder", price: "$29 / 30 days", units: "50M request units", rpm: "12,000 req / min" },
          { name: "Pro (Most Picked)", price: "$199 / 30 days", units: "500M request units", rpm: "60,000 req / min" },
          { name: "Dedicated", price: "$999 / 30 days", units: "5B request units", rpm: "250,000 req / min" },
        ].map((p) => (
          <div key={p.name} className="bg-obsidian border border-white/10 rounded-xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-white">{p.name}</h2>
              <div className="text-2xl font-bold text-amber font-mono">{p.price}</div>
              <p className="text-xs text-neutral-400">{p.units} · {p.rpm}</p>
            </div>
            <Link href="/app" className="w-full py-2.5 rounded-lg bg-white text-black text-center text-xs font-semibold">
              Select Plan →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
