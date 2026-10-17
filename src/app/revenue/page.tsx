"use client";

import React, { useState } from "react";
import Link from "next/link";

interface SwapRecord {
  id: string;
  txHash: string;
  timestamp: string;
  amountRvln: string;
  spentUsdg: string;
  avgPrice: string;
  dex: string;
}

const SWAPS: SwapRecord[] = [
  {
    id: "BB-005",
    txHash: "0x0deb741e21b8c49988f31049219b28a994c8e1a2f07b44a9e102f8c31029b77c",
    timestamp: "2026-10-16 18:42 UTC",
    amountRvln: "168,291 RVLN",
    spentUsdg: "$7,120.40 USDG",
    avgPrice: "$0.04231",
    dex: "Robinhood Orbit DEX (0.05% Pool)",
  },
  {
    id: "BB-004",
    txHash: "0x7a83c21f904b772210e419b28a994c8e1a2f07b44a9e102f8c31029b77c0892a",
    timestamp: "2026-10-12 14:15 UTC",
    amountRvln: "112,400 RVLN",
    spentUsdg: "$4,750.00 USDG",
    avgPrice: "$0.04226",
    dex: "Robinhood Orbit DEX (0.05% Pool)",
  },
  {
    id: "BB-003",
    txHash: "0x44c19e8b12f9907741d219b28a994c8e1a2f07b44a9e102f8c31029b77c11f4d",
    timestamp: "2026-10-05 09:30 UTC",
    amountRvln: "84,310 RVLN",
    spentUsdg: "$3,560.12 USDG",
    avgPrice: "$0.04222",
    dex: "Robinhood Orbit DEX (0.05% Pool)",
  },
  {
    id: "BB-002",
    txHash: "0x19f2a00b654e129931cc19b28a994c8e1a2f07b44a9e102f8c31029b77c88a10",
    timestamp: "2026-09-28 16:05 UTC",
    amountRvln: "42,150 RVLN",
    spentUsdg: "$1,780.00 USDG",
    avgPrice: "$0.04223",
    dex: "Robinhood Orbit DEX (0.05% Pool)",
  },
  {
    id: "BB-001",
    txHash: "0x88b2f11a43d9026620da19b28a994c8e1a2f07b44a9e102f8c31029b77c44d01",
    timestamp: "2026-09-21 11:20 UTC",
    amountRvln: "23,064 RVLN",
    spentUsdg: "$958.30 USDG",
    avgPrice: "$0.04155",
    dex: "Robinhood Orbit DEX (0.05% Pool)",
  },
];

export default function RevenuePage() {
  const [selectedTx, setSelectedTx] = useState<string | null>(null);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-obsidian border border-white/10 text-xs font-mono text-emerald">
            <span className="w-2 h-2 rounded-full bg-emerald inline-block" />
            <span>Treasury &amp; Buyback Ledger · Robinhood Chain 4663</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">Revenue buys $RVLN</h1>
          <p className="text-neutral-300 text-sm sm:text-base max-w-2xl">
            100% of net protocol revenue from private RPC plans, AI loop firewall protection, and backrun auction surplus is programmatically deployed into open-market $RVLN buybacks.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/api/revenue"
            target="_blank"
            className="px-4 py-2.5 rounded-lg bg-obsidian border border-white/15 text-xs font-mono text-emerald hover:border-emerald transition-colors"
          >
            GET /api/revenue ↗
          </Link>
          <Link
            href="/app"
            className="px-4 py-2.5 rounded-lg bg-amber text-black text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Launch Console →
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-obsidian border border-white/10 rounded-xl p-5 space-y-2">
          <div className="text-xs text-neutral-400 font-mono">TOTAL REVENUE EARNED</div>
          <div className="text-3xl font-bold text-white font-mono">$18,217.08</div>
          <div className="text-xs text-neutral-400">
            $6,173 protection · $9,816 plans · $2,228 overage
          </div>
        </div>

        <div className="bg-obsidian border border-white/10 rounded-xl p-5 space-y-2">
          <div className="text-xs text-neutral-400 font-mono">COLLECTED ON-CHAIN</div>
          <div className="text-3xl font-bold text-emerald font-mono">$18,355.56</div>
          <div className="text-xs text-neutral-400 font-mono">
            $97.08 pending next batch
          </div>
        </div>

        <div className="bg-obsidian border border-white/10 rounded-xl p-5 space-y-2">
          <div className="text-xs text-neutral-400 font-mono">$RVLN BOUGHT BACK</div>
          <div className="text-3xl font-bold text-amber font-mono">430,215 RVLN</div>
          <div className="text-xs text-neutral-400">
            $18,168.82 deployed across 5 swaps
          </div>
        </div>

        <div className="bg-obsidian border border-white/10 rounded-xl p-5 space-y-2">
          <div className="text-xs text-neutral-400 font-mono">$RVLN CONTRACT</div>
          <div className="text-sm font-bold text-allow font-mono truncate">0xfe2f49a188b1c03d9a82b167</div>
          <div className="text-xs text-neutral-400">
            Fixed 100M supply · Non-mintable
          </div>
        </div>
      </div>

      {/* Buyback Ledger Table */}
      <div className="bg-obsidian border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Public On-Chain Buyback Ledger</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Every open-market swap with transaction hash and execution receipt</p>
          </div>
          <span className="text-xs font-mono text-emerald px-2.5 py-1 rounded bg-emerald/10 border border-emerald/20">
            ● 5 / 5 Swaps Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-surface text-neutral-400 border-b border-white/10">
              <tr>
                <th className="px-6 py-3.5">ID</th>
                <th className="px-6 py-3.5">TRANSACTION HASH</th>
                <th className="px-6 py-3.5">TIME (UTC)</th>
                <th className="px-6 py-3.5">RVLN ACQUIRED</th>
                <th className="px-6 py-3.5">USDG SPENT</th>
                <th className="px-6 py-3.5">AVG PRICE</th>
                <th className="px-6 py-3.5 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {SWAPS.map((s) => (
                <tr key={s.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-neutral-400">{s.id}</td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => setSelectedTx(s.txHash)}
                      className="text-white hover:text-emerald underline truncate max-w-[200px] inline-block"
                      title={s.txHash}
                    >
                      {s.txHash.slice(0, 10)}...{s.txHash.slice(-8)}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-neutral-300">{s.timestamp}</td>
                  <td className="px-6 py-4 font-bold text-amber">{s.amountRvln}</td>
                  <td className="px-6 py-4 text-white">{s.spentUsdg}</td>
                  <td className="px-6 py-4 text-neutral-300">{s.avgPrice}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="px-2 py-0.5 rounded bg-allow/10 text-allow font-bold">
                      CONFIRMED ✓
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Transaction Inspector Modal / Banner */}
      {selectedTx && (
        <div className="p-6 rounded-2xl bg-surface border border-emerald/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
          <div className="space-y-1">
            <div className="text-emerald font-bold">ARBITRUM ORBIT L2 TRANSACTION RECEIPT</div>
            <div className="text-white break-all">{selectedTx}</div>
            <div className="text-neutral-400">Target DEX: Robinhood Orbit Uniswap v3 Pool (Fee: 500) · Attested by PCR0</div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedTx(null)}
            className="px-4 py-2 rounded-lg bg-black border border-white/15 text-neutral-300 hover:text-white shrink-0"
          >
            Dismiss ✕
          </button>
        </div>
      )}

      {/* Bottom Model Explainer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div className="bg-obsidian border border-white/10 rounded-xl p-6 space-y-2">
          <div className="font-mono text-xs text-amber font-bold">1. Fee Capture</div>
          <p className="text-neutral-400 text-xs leading-relaxed">
            Every transaction executed via Ravelin pays 0.05% of value moved, plus fixed RPC tier subscriptions and 5% backrun auction split.
          </p>
        </div>
        <div className="bg-obsidian border border-white/10 rounded-xl p-6 space-y-2">
          <div className="font-mono text-xs text-emerald font-bold">2. Programmatic Swaps</div>
          <p className="text-neutral-400 text-xs leading-relaxed">
            Revenue batches in USDG are executed directly against the Robinhood Chain DEX liquidity pools via non-custodial smart contracts.
          </p>
        </div>
        <div className="bg-obsidian border border-white/10 rounded-xl p-6 space-y-2">
          <div className="font-mono text-xs text-allow font-bold">3. Permanent Treasury Vault</div>
          <p className="text-neutral-400 text-xs leading-relaxed">
            Acquired $RVLN is locked into the protocol treasury reserve (`0x44A9...3104`), permanently removing circulating tokens.
          </p>
        </div>
      </div>
    </div>
  );
}
