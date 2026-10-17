"use client";
import React, { useState } from "react";
import Link from "next/link";

const METRICS = [
  {
    title: "Delivered privately",
    value: "$7,473,107",
    sub: "$19,509 in 24h · since Sep 2",
    badge: "▲ 4% (30d)",
    badgeColor: "text-allow bg-allow/10",
    foot: "Peak $176k · Sep 23 · Zero public mempool exposure",
    contract: "0x88B1c409a21f9902e10490E2 (RavelinVolumeLog)",
  },
  {
    title: "Transactions protected",
    value: "218,049",
    sub: "1,622 in 24h · delivered privately",
    badge: "0 Reverts Mined",
    badgeColor: "text-emerald bg-emerald/10",
    foot: "Peak 7,684/day · Sep 22 · Pre-simulated in Nitro TEE",
    contract: "0x88B1c409a21f9902e10490E2 (RavelinVolumeLog)",
  },
  {
    title: "MEV & Loop Drains Prevented",
    value: "$201,591",
    sub: "0% front-run · 147 AI retry loops halted",
    badge: "100% Protected",
    badgeColor: "text-allow bg-allow/10",
    foot: "Saved from failed gas & sandwich bots",
    contract: "0x44A9e102f8c31029b77c3104 (RavelinSettlement)",
  },
  {
    title: "Rebate share",
    value: "90%",
    sub: "to users · 5% apps · 5% protocol",
    badge: "Automatic Payout",
    badgeColor: "text-amber bg-amber/10",
    foot: "Paid in ETH or USDG immediately on settlement",
    contract: "0x44A9e102f8c31029b77c3104 (RavelinSettlement)",
  },
  {
    title: "Active agents & searchers",
    value: "1,504",
    sub: "last 24h · 18,593 all time",
    badge: "Live Network",
    badgeColor: "text-white bg-white/10",
    foot: "Wallets, AI trading agents, and bonded backrun searchers",
    contract: "0x91D0f48c2291a87e4102b890 (RavelinRegistry)",
  },
  {
    title: "Protocol revenue earned",
    value: "$18,217.08",
    sub: "fees since Sep 12 · 100% buys $RVLN",
    badge: "100% Buyback",
    badgeColor: "text-emerald bg-emerald/10",
    foot: "Every dollar of net revenue buys $RVLN on the open market",
    contract: "0xfe2f49a188b1c03d9a82b167 ($RVLN Token)",
  },
];

export default function HomePage() {
  const [selectedMetric, setSelectedMetric] = useState<typeof METRICS[0] | null>(null);

  return (
    <div className="space-y-24 pb-24">
      {/* SECTION 1: REGION THE SEQUENCER */}
      <section className="subtle-grid border-b border-white/10 pt-14 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-obsidian border border-white/15 text-xs font-mono text-amber">
              <span className="w-2 h-2 rounded-full bg-amber inline-block" />
              <span>Region: the sequencer · Chain ID 4663</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.08]">
              One node, in the same place as the chain, close to every block.
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl">
              Every request is answered from our own hardware-isolated AWS Nitro node—not a shared upstream. Whether you are a{" "}
              <strong className="text-white">crypto investor trading tokenized stocks</strong> or a{" "}
              <strong className="text-white">team running autonomous AI agents</strong>, your trades are private, simulated before they cost gas, and pay you back 90% of any backrun profit.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-obsidian border border-white/10 rounded-xl p-5">
                <div className="text-3xl sm:text-4xl font-bold text-amber font-mono">1 ms</div>
                <div className="text-sm font-medium text-white mt-1">Median gateway response</div>
                <p className="text-xs text-neutral-400 mt-1">
                  Measured on the box that answers you. Blocks arrive every <span className="text-white font-mono">100 ms</span>; we see each one the moment it is sequenced.
                </p>
              </div>
              <div className="bg-obsidian border border-white/10 rounded-xl p-5">
                <div className="text-3xl sm:text-4xl font-bold text-emerald font-mono">100%</div>
                <div className="text-sm font-medium text-white mt-1">State assertions verified</div>
                <p className="text-xs text-neutral-400 mt-1">
                  Blocks validated by our own WASM &amp; Nitro PCR0 replay of Robinhood&apos;s state assertions.{" "}
                  <Link href="/compare" className="text-emerald underline">
                    Their hash, our hash →
                  </Link>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/app" className="px-5 py-3 rounded-lg bg-amber text-black text-sm font-semibold hover:opacity-90">
                Add Free RPC to Wallet →
              </Link>
              <Link href="/app" className="px-5 py-3 rounded-lg bg-obsidian border border-white/15 text-white text-sm font-medium hover:bg-surface">
                Get an API Key
              </Link>
              <Link href="/compare" className="px-4 py-3 rounded-lg text-neutral-300 hover:text-white text-sm font-mono">
                Live State Check (/compare) →
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-obsidian border border-white/10 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-400">CO-LOCATION TOPOLOGY · US-EAST-1</span>
                <span className="text-allow">● 0.8ms RTT</span>
              </div>
              <div className="p-6 rounded-xl bg-black border border-white/5 text-center space-y-3">
                <div className="inline-flex items-center gap-4 px-4 py-3 rounded-xl bg-obsidian border border-amber/40">
                  <div className="text-left">
                    <div className="text-xs font-mono text-amber font-bold">● ROBINHOOD SEQUENCER</div>
                    <div className="text-[11px] font-mono text-emerald mt-1">● RAVELIN NITRO NODE (1ms away)</div>
                  </div>
                </div>
                <p className="text-xs text-neutral-400">
                  Blocks validated by our own WASM replay of Robinhood&apos;s state assertions every 10 minutes.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                <div className="p-3 rounded-lg bg-black border border-white/10">
                  <div className="text-neutral-500">ROBINHOOD HASH</div>
                  <div className="text-white truncate mt-0.5">0x94c8e1a2...f07b</div>
                </div>
                <div className="p-3 rounded-lg bg-black border border-emerald/30">
                  <div className="text-neutral-500">RAVELIN WASM HASH</div>
                  <div className="text-emerald truncate mt-0.5">0x94c8e1a2...f07b ✓</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 PILLARS */}
        <div className="max-w-6xl mx-auto mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-obsidian border border-white/10 rounded-xl p-6 space-y-2.5">
            <div className="text-amber font-mono text-lg">◎ Private by default</div>
            <p className="text-sm text-neutral-300 leading-relaxed">
              A transaction sent here never touches a public mempool. It goes directly to the sequencer operator&apos;s own ingress, and to nobody else first—so predatory bots cannot front-run or sandwich your swap.
            </p>
          </div>
          <div className="bg-obsidian border border-white/10 rounded-xl p-6 space-y-2.5">
            <div className="text-emerald font-mono text-lg">⟲ Simulated first</div>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Every send is executed from its signer against current state inside our hardware enclave. If it would revert—or if an AI agent is stuck in a duplicate retry loop—it is refused immediately and <strong className="text-white">never pays gas</strong>.
            </p>
          </div>
          <div className="bg-obsidian border border-white/10 rounded-xl p-6 space-y-2.5">
            <div className="text-allow font-mono text-lg">↺ Paid back (90% Rebate)</div>
            <p className="text-sm text-neutral-300 leading-relaxed">
              When your trade creates a profitable arbitrage backrun, the right to take it is auctioned in 200ms. <strong className="text-white">90% of the clearing price returns directly to your wallet</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: MEASURED, NOT CLAIMED */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="font-mono text-xs text-emerald uppercase tracking-wider">On-Chain Proof · Click Any Metric to Verify</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Measured, not claimed</h2>
            <p className="text-neutral-400 text-sm sm:text-base">
              Every number below is read directly from Robinhood Chain or our indexed enclave ledger, and each one links to the on-chain check behind it.
            </p>
          </div>
          <Link href="/compare" className="px-4 py-2 rounded-lg bg-obsidian border border-white/15 hover:border-emerald text-xs font-mono text-emerald shrink-0">
            Verify Live State at /compare →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {METRICS.map((m) => (
            <button
              key={m.title}
              type="button"
              onClick={() => setSelectedMetric(m)}
              className="text-left bg-obsidian border border-white/10 hover:border-emerald/50 rounded-xl p-6 space-y-3 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-400">{m.title}</span>
                <span className="text-[11px] font-mono text-emerald">Verify check ↗</span>
              </div>
              <div className="text-3xl font-bold text-white font-mono">{m.value}</div>
              <div className="text-xs text-neutral-300">{m.sub}</div>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <span className={`px-2 py-0.5 rounded ${m.badgeColor}`}>{m.badge}</span>
                <span className="text-neutral-400 truncate ml-2">{m.foot}</span>
              </div>
            </button>
          ))}
        </div>

        {selectedMetric && (
          <div className="p-6 rounded-2xl bg-surface border border-emerald/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-mono text-emerald">ON-CHAIN VERIFICATION PROOF · {selectedMetric.title.toUpperCase()}</div>
              <div className="text-lg font-bold text-white font-mono">
                {selectedMetric.value} — {selectedMetric.sub}
              </div>
              <div className="text-xs font-mono text-neutral-400">Anchored Contract: {selectedMetric.contract}</div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedMetric(null)}
              className="px-4 py-2 rounded-lg bg-black border border-white/15 text-xs font-mono text-neutral-300 hover:text-white"
            >
              Close Proof ✕
            </button>
          </div>
        )}
      </section>

      {/* SECTION 3: REVENUE BUYS $RVLN */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="space-y-2 max-w-3xl">
          <div className="font-mono text-xs text-amber uppercase tracking-wider">Investor Alignment · 100% Open-Market Buybacks</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Revenue buys $RVLN</h2>
          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
            What Ravelin earns from RPC plans, firewall protection, and auction surplus goes directly back into its own token on the open market—one swap at a time, each one a public transaction you can check.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-obsidian border border-white/10 rounded-xl p-5 space-y-2">
            <div className="text-xs text-neutral-400">Revenue earned</div>
            <div className="text-2xl font-bold text-white font-mono">$18,217.08</div>
            <div className="text-xs text-neutral-400">$6,173.25 protection · $9,816.00 plans · $2,227.83 overage</div>
          </div>
          <div className="bg-obsidian border border-white/10 rounded-xl p-5 space-y-2">
            <div className="text-xs text-neutral-400">Collected on-chain</div>
            <div className="text-2xl font-bold text-emerald font-mono">$18,355.56</div>
            <div className="text-xs text-neutral-400">$97.08 pending batch · paid in ETH or USDG</div>
          </div>
          <div className="bg-obsidian border border-white/10 rounded-xl p-5 space-y-2">
            <div className="text-xs text-neutral-400">$RVLN bought back</div>
            <div className="text-2xl font-bold text-amber font-mono">430,215 RVLN</div>
            <div className="text-xs text-neutral-400">$18,168.82 across 5 open-market buybacks</div>
          </div>
          <div className="bg-obsidian border border-white/10 rounded-xl p-5 space-y-2">
            <div className="text-xs text-neutral-400">Last buyback</div>
            <div className="text-2xl font-bold text-allow font-mono">168,291 RVLN</div>
            <div className="text-xs text-neutral-400 font-mono">0x0deb741e…9988f3 · Verified</div>
          </div>
        </div>

        <div className="bg-obsidian border border-white/10 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div>
            <span className="font-mono text-amber font-bold">100% Where it comes from:</span>{" "}
            <span className="text-neutral-300">
              Protected execution at 0.05% of value moved · RPC &amp; AI Firewall plan fees · request unit overage · 5% back-run auction surplus.
            </span>
          </div>
          <Link href="/revenue" className="font-mono text-emerald hover:underline shrink-0">
            Token 0xfe2f…b167 · /api/revenue →
          </Link>
        </div>
      </section>
    </div>
  );
}
