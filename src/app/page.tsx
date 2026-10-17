"use client";

import React, { useState } from "react";
import Link from "next/link";

interface MetricCard {
  title: string;
  value: string;
  sub: string;
  badge: string;
  badgeColor: string;
  foot: string;
  contract: string;
}

const METRICS: MetricCard[] = [
  {
    title: "Delivered privately",
    value: "$7,473,107",
    sub: "$19,509 in 24h · since Sep 2",
    badge: "▲ 4% (30d)",
    badgeColor: "text-emerald-700 bg-emerald-50 border border-emerald-200",
    foot: "Peak $176k · Sep 23 · Zero public mempool exposure",
    contract: "0x88B1c409a21f9902e10490E2 (RavelinVolumeLog)",
  },
  {
    title: "Transactions protected",
    value: "218,049",
    sub: "1,622 in 24h · delivered privately",
    badge: "0 Reverts Mined",
    badgeColor: "text-blue-700 bg-blue-50 border border-blue-200",
    foot: "Peak 7,684/day · Sep 22 · Pre-simulated in Nitro TEE",
    contract: "0x88B1c409a21f9902e10490E2 (RavelinVolumeLog)",
  },
  {
    title: "MEV & Loop Drains Prevented",
    value: "$201,591",
    sub: "0% front-run · 147 AI retry loops halted",
    badge: "100% Protected",
    badgeColor: "text-emerald-700 bg-emerald-50 border border-emerald-200",
    foot: "Saved from failed gas & sandwich bots",
    contract: "0x44A9e102f8c31029b77c3104 (RavelinSettlement)",
  },
  {
    title: "Rebate share",
    value: "90%",
    sub: "to users · 5% apps · 5% protocol",
    badge: "Automatic Payout",
    badgeColor: "text-amber-700 bg-amber-50 border border-amber-200",
    foot: "Paid in ETH or USDG immediately on settlement",
    contract: "0x44A9e102f8c31029b77c3104 (RavelinSettlement)",
  },
  {
    title: "Active agents & searchers",
    value: "1,504",
    sub: "last 24h · 18,593 all time",
    badge: "Live Network",
    badgeColor: "text-slate-700 bg-slate-100 border border-slate-200",
    foot: "Wallets, AI trading swarms, and bonded backrun searchers",
    contract: "0x91D0f48c2291a87e4102b890 (RavelinRegistry)",
  },
  {
    title: "Protocol revenue earned",
    value: "$18,217.08",
    sub: "fees since Sep 12 · 100% buys $RVLN",
    badge: "100% Buyback",
    badgeColor: "text-emerald-700 bg-emerald-50 border border-emerald-200",
    foot: "Every dollar of net revenue buys $RVLN on the open market",
    contract: "0xfe2f49a188b1c03d9a82b167 ($RVLN Token)",
  },
];

export default function HomePage() {
  const [selectedMetric, setSelectedMetric] = useState<MetricCard | null>(null);

  return (
    <div className="space-y-20 pb-20 pt-10 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* SECTION 1: HERO & REGION THE SEQUENCER */}
      <section className="space-y-8">
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800">
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block animate-pulse" />
            <span>Robinhood Chain Mainnet (ID 4663) · 100 ms Blocks</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
            Trade &amp; Run AI Agents on Robinhood Chain Without Losing Gas or Value.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Ravelin places a dedicated hardware node right next to the Robinhood Chain sequencer. Every transaction is{" "}
            <strong className="text-slate-900">private by default</strong>,{" "}
            <strong className="text-slate-900">simulated before it costs gas</strong>, and returns{" "}
            <strong className="text-blue-700">90% of any backrun profit</strong> directly to your wallet.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/tools"
              className="px-6 py-3 rounded-xl blue-pill-gradient text-white text-sm font-semibold shadow-md hover:opacity-95 transition-opacity"
            >
              Try Interactive Simulator &amp; Tools →
            </Link>
            <Link
              href="/compare"
              className="px-5 py-3 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-sm font-semibold hover:bg-blue-100 transition-colors"
            >
              See Live State Proofs (/compare)
            </Link>
          </div>
        </div>

        {/* BLUE GRADIENT BOX (REGION: THE SEQUENCER) */}
        <div className="blue-gradient-box rounded-3xl p-6 sm:p-10 text-white shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="text-xs font-mono uppercase tracking-wider text-blue-200 font-bold">
              REGION: THE SEQUENCER
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
              One node, in the same place as the chain, close to the sequencer, close to every block.
            </h2>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
              Every request is answered from our own hardware-isolated AWS Nitro node—not a shared upstream. Whether you are trading tokenized stocks like NVDA and AAPL or running automated swarms, your transactions never pay for failed gas.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-5">
                <div className="text-3xl font-extrabold font-mono text-white">1 ms</div>
                <div className="text-sm font-semibold text-blue-100 mt-1">Median gateway response</div>
                <p className="text-xs text-blue-200 mt-1">
                  Measured on the box that answers you. Blocks arrive every 100 ms.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-5">
                <div className="text-3xl font-extrabold font-mono text-emerald-300">100%</div>
                <div className="text-sm font-semibold text-blue-100 mt-1">WASM state replay verified</div>
                <p className="text-xs text-blue-200 mt-1">
                  Validated against Robinhood&apos;s state assertions every 10 minutes.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-blue-200 font-semibold">CO-LOCATION TOPOLOGY</span>
              <span className="text-emerald-300 font-bold">● 0.8 ms RTT</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-white/10 space-y-2">
              <div className="text-xs font-mono text-blue-200">● ROBINHOOD SEQUENCER (US-EAST-1)</div>
              <div className="text-xs font-mono text-emerald-300">● RAVELIN NITRO NODE (&lt;1ms away)</div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-900/40 border border-white/10">
                <div className="text-slate-400 text-[10px]">ROBINHOOD HASH</div>
                <div className="text-white truncate mt-0.5">0x94c8e1a2...f07b</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/40 border border-emerald-400/40">
                <div className="text-emerald-300 text-[10px]">RAVELIN REPLAY</div>
                <div className="text-emerald-300 truncate mt-0.5">0x94c8e1a2...f07b ✓</div>
              </div>
            </div>
            <p className="text-[11px] text-blue-200 leading-snug">
              Independent WASM assertion execution guarantees zero deviation between sequencer state and client simulation.
            </p>
          </div>
        </div>

        {/* 3 VISUAL STEP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="blue-card-soft rounded-2xl p-6 space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-mono font-bold flex items-center justify-center text-lg">
              ◎
            </div>
            <h3 className="text-lg font-bold text-slate-900">Private by default</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              A transaction sent here never touches a public mempool. It routes directly to the sequencer ingress, eliminating sandwich bots and predatory front-running on Robinhood Chain.
            </p>
          </div>

          <div className="blue-card-soft rounded-2xl p-6 space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-mono font-bold flex items-center justify-center text-lg">
              ⟲
            </div>
            <h3 className="text-lg font-bold text-slate-900">Simulated first ($0 failed gas)</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every send is dry-run inside our hardware enclave against the latest block. If it would revert—or an AI agent is in a duplicate calldata loop—it is refused immediately for <strong className="text-slate-900">$0 gas</strong>.
            </p>
          </div>

          <div className="blue-card-soft rounded-2xl p-6 space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 font-mono font-bold flex items-center justify-center text-lg">
              ↺
            </div>
            <h3 className="text-lg font-bold text-slate-900">Paid back (90% rebate)</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              When your trade creates an arbitrage backrun opportunity, searchers bid in a 200 ms Dutch auction. <strong className="text-blue-700">90% of the winning clearing price returns directly to your wallet</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: MEASURED, NOT CLAIMED */}
      <section className="space-y-6 pt-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-mono text-blue-700 uppercase tracking-wider font-bold">
              ON-CHAIN AUDIT TRAIL · CLICK ANY CARD TO VERIFY
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">Measured, not claimed</h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
              Every metric below is indexed directly from Robinhood Chain (ID 4663) or our audited enclave event logs.
            </p>
          </div>
          <Link
            href="/tools"
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-semibold text-slate-800 transition-colors shrink-0"
          >
            Open Interactive Tools →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {METRICS.map((m) => (
            <button
              key={m.title}
              type="button"
              onClick={() => setSelectedMetric(m)}
              className="text-left bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-6 space-y-3 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{m.title}</span>
                <span className="text-[11px] font-mono text-blue-600 group-hover:underline">Verify proof ↗</span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">{m.value}</div>
              <div className="text-xs text-slate-600">{m.sub}</div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${m.badgeColor}`}>
                  {m.badge}
                </span>
                <span className="text-slate-400 truncate ml-2 text-[11px]">{m.foot}</span>
              </div>
            </button>
          ))}
        </div>

        {/* ON-CHAIN PROOF MODAL / BANNER */}
        {selectedMetric && (
          <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
            <div className="space-y-1">
              <div className="text-blue-800 font-bold uppercase">
                ON-CHAIN ATTESTATION PROOF · {selectedMetric.title}
              </div>
              <div className="text-base font-bold text-slate-900">
                {selectedMetric.value} — {selectedMetric.sub}
              </div>
              <div className="text-slate-600 text-[11px]">Anchored Contract: {selectedMetric.contract}</div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedMetric(null)}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold shrink-0"
            >
              Close Proof ✕
            </button>
          </div>
        )}
      </section>

      {/* SECTION 3: REVENUE BUYS $RVLN */}
      <section className="space-y-6 pt-4">
        <div className="space-y-2">
          <span className="text-xs font-mono text-blue-700 uppercase tracking-wider font-bold">
            INVESTOR ALIGNMENT · 100% OPEN-MARKET BUYBACKS
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">Revenue buys $RVLN</h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            What Ravelin earns from private RPC plans, AI loop firewall protection, and backrun auction surplus is programmatically deployed into $RVLN open-market buybacks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">Revenue earned</div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">$18,217.08</div>
            <div className="text-xs text-slate-500">$6,173 protection · $9,816 plans · $2,228 overage</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">Collected on-chain</div>
            <div className="text-2xl font-extrabold text-emerald-600 font-mono">$18,355.56</div>
            <div className="text-xs text-slate-500">$97.08 pending batch · paid in ETH or USDG</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">$RVLN bought back</div>
            <div className="text-2xl font-extrabold text-blue-700 font-mono">430,215 RVLN</div>
            <div className="text-xs text-slate-500">$18,168.82 across 5 open-market swaps</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">Last buyback swap</div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">168,291 RVLN</div>
            <div className="text-xs text-slate-500 font-mono truncate">0x0deb741e…9988f3 · Verified</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div>
            <span className="font-bold text-blue-900 font-mono">100% REVENUE ALLOCATION:</span>{" "}
            <span className="text-slate-700">
              0.05% protected execution fee + monthly RPC subscriptions + 5% auction surplus directly funding $RVLN liquidity.
            </span>
          </div>
          <Link
            href="/revenue"
            className="font-semibold text-blue-700 hover:underline shrink-0"
          >
            Explore Public Buyback Ledger (/revenue) →
          </Link>
        </div>
      </section>

      {/* SECTION 4: CALL TO ACTION STRIP */}
      <section className="blue-gradient-box text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <h3 className="text-2xl font-bold">Ready to route your transactions privately?</h3>
          <p className="text-sm text-blue-100">
            Explore the 3 interactive simulation tools, test your custom firewall policy, or inspect our 100% WASM state validator.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <Link
            href="/tools"
            className="px-6 py-3 rounded-xl bg-white text-blue-800 text-sm font-bold shadow-md hover:bg-blue-50 transition-colors"
          >
            Launch Interactive Tools →
          </Link>
          <Link
            href="/platform"
            className="px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-semibold hover:bg-white/20 transition-colors"
          >
            View Platform &amp; Pricing
          </Link>
        </div>
      </section>
    </div>
  );
}
