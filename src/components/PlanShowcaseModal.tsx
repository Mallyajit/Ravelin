"use client";

import React, { useState } from "react";
import { useEnclave } from "@/context/EnclaveContext";

export interface PlanRow {
  label: string;
  diff: boolean;
  free: string;
  builder: string;
  pro: string;
  dedicated: string;
}

export const PLAN_COMPARISON_ROWS: PlanRow[] = [
  { label: "Monthly Request Units (30-Day Cycle)", diff: true, free: "5M RUs", builder: "50M RUs", pro: "500M RUs", dedicated: "5B RUs" },
  { label: "Sustained Throughput Limit (req/min)", diff: true, free: "1,000 rpm", builder: "12,000 rpm", pro: "60,000 rpm", dedicated: "250,000 rpm" },
  { label: "Burst Concurrency Limit (req/sec)", diff: true, free: "25 rps", builder: "200 rps", pro: "1,000 rps", dedicated: "5,000 rps" },
  { label: "Co-Located Private Sequencer Ingress (0 Mempool)", diff: false, free: "TICK", builder: "TICK", pro: "TICK", dedicated: "TICK" },
  { label: "Pre-Broadcast EVM Revert Simulation ($0 Gas)", diff: false, free: "TICK", builder: "TICK", pro: "TICK", dedicated: "TICK" },
  { label: "ArbSys (0x...0064) L1 + L2 Gas Ceiling Guard", diff: false, free: "TICK", builder: "TICK", pro: "TICK", dedicated: "TICK" },
  { label: "RocksDB Duplicate Loop Cooldown Window", diff: true, free: "60s Fixed", builder: "Custom (4s–1h)", pro: "Custom (4s–1h)", dedicated: "Custom + Sub-ms" },
  { label: "Zero Request Unit Charge on Refused Loops", diff: true, free: "CROSS", builder: "CROSS", pro: "TICK", dedicated: "TICK" },
  { label: "WebSocket Subscriptions (eth_subscribe)", diff: true, free: "CROSS", builder: "TICK", pro: "TICK", dedicated: "TICK" },
  { label: "Holding Pen Queue (> $10k Co-Signing)", diff: true, free: "CROSS", builder: "1 Webhook", pro: "Unlimited", dedicated: "Multi-Sig + SLA" },
  { label: "Whitelisted Stock-Token Pools", diff: true, free: "Up to 3", builder: "Up to 25", pro: "Unlimited", dedicated: "Unlimited" },
  { label: "ERC-20 Infinite Approval Blocker (MaxUint256)", diff: false, free: "TICK", builder: "TICK", pro: "TICK", dedicated: "TICK" },
  { label: "Consecutive Revert Auto-Pause Circuit Breaker", diff: true, free: "CROSS", builder: "TICK", pro: "TICK", dedicated: "TICK" },
  { label: "90% Backrun Rebate Settlement Speed", diff: true, free: "24h Batch", builder: "6h Batch", pro: "Instant (Per-Block)", dedicated: "Instant (Per-Block)" },
  { label: "5% Originating App Referral Rebate Split", diff: true, free: "CROSS", builder: "CROSS", pro: "TICK", dedicated: "TICK" },
  { label: "10-Minute WAVM State Assertion Proof Feed", diff: false, free: "TICK", builder: "TICK", pro: "TICK", dedicated: "TICK" },
  { label: "Multi-Agent Sub-Keys & Role Permissions", diff: true, free: "1 Key", builder: "5 Keys", pro: "25 Keys", dedicated: "Unlimited" },
  { label: "Isolated AWS Nitro Hardware Enclave Instance", diff: true, free: "CROSS", builder: "CROSS", pro: "CROSS", dedicated: "TICK" },
];

export function formatCellVal(val: string, isPro = false) {
  if (val === "TICK") {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs shadow-sm">
        ✓
      </span>
    );
  }
  if (val === "CROSS") {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400 font-bold text-xs">
        ✕
      </span>
    );
  }
  return (
    <span className={`font-mono text-xs sm:text-sm ${isPro ? "font-bold text-blue-900" : "font-semibold text-slate-800"}`}>
      {val}
    </span>
  );
}

export function PlanShowcaseModal() {
  const { isPlanShowcaseOpen, closePlanShowcaseModal, openRazorpayModal } = useEnclave();
  const [bentoFilter, setBentoFilter] = useState<"all" | "execution" | "firewall" | "rebates">("all");
  const [diffOnly, setDiffOnly] = useState(false);

  if (!isPlanShowcaseOpen) return null;

  const scrollToBento = () => {
    document.getElementById("bentoSection")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToMatrix = () => {
    document.getElementById("comparisonMatrixSection")?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredRows = diffOnly ? PLAN_COMPARISON_ROWS.filter((r) => r.diff) : PLAN_COMPARISON_ROWS;

  return (
    <div
      id="planShowcaseModal"
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
    >
      <div className="bg-white border border-blue-200 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Bar with Cross Icon */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-50 via-white to-sky-50">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-display font-bold text-xs flex items-center justify-center">
              R
            </div>
            <span className="font-display font-bold text-base text-slate-900">Ravelin One</span>
            <span className="text-xs text-slate-400">·</span>
            <span id="showcaseSelectedPlanBanner" className="text-xs font-semibold text-blue-700">
              Plans &amp; Benefits
            </span>
          </div>
          <button
            id="closePlanShowcaseModalBtn"
            type="button"
            aria-label="Close"
            onClick={closePlanShowcaseModal}
            className="cross-icon-btn"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable Showcase Body */}
        <div
          id="planShowcaseScrollBody"
          className="p-6 sm:p-10 overflow-y-auto space-y-14 flex-1 bg-gradient-to-b from-blue-50/40 via-white to-white"
        >
          {/* PART A: 3 Tall Centered Plan Cards */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Ravelin Builder */}
              <div className="rounded-3xl bg-white border border-slate-200 p-7 flex flex-col items-center text-center justify-between space-y-6 shadow-sm hover:border-blue-400 transition-all">
                <div className="space-y-3 pt-4">
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-blue-600">
                    Ravelin Builder
                  </h3>
                  <div className="space-y-0.5">
                    <div className="font-display text-lg font-bold text-slate-900">$29/mo</div>
                    <div className="text-xs font-semibold text-slate-600">50M request units</div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs mx-auto pt-2">
                    Unlock essential enclave tools to boost execution speed with 12x throughput* on Robinhood Chain
                  </p>
                </div>

                <div className="w-full space-y-3">
                  <button
                    type="button"
                    onClick={() => openRazorpayModal("Ravelin Builder ($29/mo)")}
                    className="btn-primary-rounded w-full"
                  >
                    Get Builder →
                  </button>
                  <div className="text-[11px] text-slate-500">
                    <a href="#comparisonMatrixSection" onClick={scrollToMatrix} className="hover:underline">
                      Terms apply¹
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={scrollToBento}
                    className="text-xs font-bold text-blue-700 hover:text-blue-800 transition-colors cursor-pointer"
                  >
                    View plan benefits +
                  </button>
                </div>
              </div>

              {/* Card 2: Ravelin Pro (Featured with Nitro Enclave v4 Top Pill) */}
              <div className="rounded-3xl bg-gradient-to-b from-blue-50/90 to-white border-2 border-blue-600 p-7 flex flex-col items-center text-center justify-between space-y-6 shadow-md relative">
                <div className="absolute -top-3.5 px-4 py-1 rounded-full bg-blue-600 text-white font-mono text-xs font-bold shadow-sm">
                  Includes Nitro Enclave v4
                </div>

                <div className="space-y-3 pt-4">
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-blue-700">
                    Ravelin Pro
                  </h3>
                  <div className="space-y-0.5">
                    <div className="font-display text-lg font-bold text-slate-900">$199/mo</div>
                    <div className="text-xs font-semibold text-blue-800">500M request units</div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-xs mx-auto pt-2">
                    Supercharge your AI agent trading with sub-millisecond co-located ingress &amp; automated 90% rebates
                  </p>
                </div>

                <div className="w-full space-y-3">
                  <button
                    type="button"
                    onClick={() => openRazorpayModal("Ravelin Pro ($199/mo)")}
                    className="btn-primary-rounded w-full bg-blue-700 hover:bg-blue-800 shadow-md"
                  >
                    Get Pro →
                  </button>
                  <div className="text-[11px] text-slate-500">
                    <a href="#comparisonMatrixSection" onClick={scrollToMatrix} className="hover:underline">
                      Terms apply¹
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={scrollToBento}
                    className="text-xs font-bold text-blue-700 hover:text-blue-800 transition-colors cursor-pointer"
                  >
                    View plan benefits +
                  </button>
                </div>
              </div>

              {/* Card 3: Ravelin Dedicated */}
              <div className="rounded-3xl bg-white border border-slate-200 p-7 flex flex-col items-center text-center justify-between space-y-6 shadow-sm hover:border-blue-400 transition-all">
                <div className="space-y-3 pt-4">
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-blue-600">
                    Ravelin Dedicated
                  </h3>
                  <div className="space-y-0.5">
                    <div className="font-display text-lg font-bold text-slate-900">From $999/mo</div>
                    <div className="text-xs font-semibold text-slate-600">5B request units</div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs mx-auto pt-2">
                    Dedicated hardware AWS Nitro Enclave instance with custom PCR0 verification &amp; bespoke SLA
                  </p>
                </div>

                <div className="w-full space-y-3">
                  <button
                    type="button"
                    onClick={() => openRazorpayModal("Ravelin Dedicated ($999/mo)")}
                    className="btn-primary-rounded w-full"
                  >
                    Get Dedicated →
                  </button>
                  <div className="text-[11px] text-slate-500">
                    <a href="#comparisonMatrixSection" onClick={scrollToMatrix} className="hover:underline">
                      Terms apply¹
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={scrollToBento}
                    className="text-xs font-bold text-blue-700 hover:text-blue-800 transition-colors cursor-pointer"
                  >
                    View plan benefits +
                  </button>
                </div>
              </div>
            </div>

            {/* Centered "Compare plans" Pill Button Below 3 Cards */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={scrollToMatrix}
                className="btn-primary-rounded px-8"
              >
                Compare plans ↓
              </button>
            </div>
          </div>

          {/* PART B: Category Pill Navigation + Visual Bento Feature Cards */}
          <div id="bentoSection" className="space-y-8 pt-4">
            <div className="flex justify-center">
              <div className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs">
                <span className="px-3 py-1 rounded-full bg-white text-blue-700 font-bold shadow-sm">
                  New · Nitro TEE
                </span>
                <button
                  type="button"
                  onClick={() => setBentoFilter("all")}
                  className={`px-3.5 py-1.5 rounded-full font-semibold cursor-pointer transition-colors ${
                    bentoFilter === "all" ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-white"
                  }`}
                >
                  All Benefits
                </button>
                <button
                  type="button"
                  onClick={() => setBentoFilter("execution")}
                  className={`px-3.5 py-1.5 rounded-full font-semibold cursor-pointer transition-colors ${
                    bentoFilter === "execution" ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-white"
                  }`}
                >
                  Execution
                </button>
                <button
                  type="button"
                  onClick={() => setBentoFilter("firewall")}
                  className={`px-3.5 py-1.5 rounded-full font-semibold cursor-pointer transition-colors ${
                    bentoFilter === "firewall" ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-white"
                  }`}
                >
                  Firewall
                </button>
                <button
                  type="button"
                  onClick={() => setBentoFilter("rebates")}
                  className={`px-3.5 py-1.5 rounded-full font-semibold cursor-pointer transition-colors ${
                    bentoFilter === "rebates" ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-white"
                  }`}
                >
                  Rebates
                </button>
              </div>
            </div>

            {/* 2x2 Visual Bento Showcase Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bento Card 1: Private Ingress */}
              {(bentoFilter === "all" || bentoFilter === "execution") && (
                <div className="rounded-3xl bg-slate-900 text-white p-7 flex flex-col justify-between space-y-6 relative overflow-hidden border border-slate-800">
                  <div className="rounded-2xl bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 border border-blue-800/60 p-5 space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono text-blue-300">
                      <span>US-EAST DIRECT PEERING</span>
                      <span className="text-emerald-400">0.84 ms RTT</span>
                    </div>
                    <svg viewBox="0 0 320 90" className="w-full h-24">
                      <rect x="10" y="25" width="85" height="40" rx="8" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
                      <text x="52" y="49" textAnchor="middle" fill="#E0F2FE" fontFamily="JetBrains Mono" fontSize="9" fontWeight="700">
                        NITRO NODE
                      </text>
                      <path d="M 95 45 Q 160 10 225 45" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="5 4" />
                      <circle cx="160" cy="27" r="5" fill="#10B981" />
                      <rect x="225" y="25" width="85" height="40" rx="8" fill="#1E293B" stroke="#F59E0B" strokeWidth="1.5" />
                      <text x="267" y="49" textAnchor="middle" fill="#FEF3C7" fontFamily="JetBrains Mono" fontSize="9" fontWeight="700">
                        SEQUENCER
                      </text>
                    </svg>
                  </div>
                  <div className="space-y-2 pr-6">
                    <span className="inline-block px-3 py-0.5 rounded-full border border-blue-400/50 text-[11px] font-mono text-blue-300">
                      Ravelin Private Ingress
                    </span>
                    <h4 className="font-display text-2xl font-bold leading-snug">
                      Sub-millisecond node access <span className="text-sky-400">co-located right beside the block producer</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      &ldquo;Eliminate public mempool snooping and front-running with direct private peering to the Robinhood Chain sequencer.&rdquo;
                    </p>
                  </div>
                </div>
              )}

              {/* Bento Card 2: 200ms Rebate Telemetry */}
              {(bentoFilter === "all" || bentoFilter === "rebates") && (
                <div className="rounded-3xl bg-slate-900 text-white p-7 flex flex-col justify-between space-y-6 relative overflow-hidden border border-slate-800">
                  <div className="rounded-2xl bg-white text-slate-900 p-5 space-y-3 border border-slate-200 shadow-inner">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-mono uppercase text-slate-400">30-Day Rebate Yield</div>
                        <div className="font-mono text-xl font-bold text-blue-700">
                          $201,591 <span className="text-xs text-emerald-600 font-semibold">(+90% Split)</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-mono text-[10px] font-bold">
                        200 ms Auction
                      </span>
                    </div>
                    <svg viewBox="0 0 300 68" className="w-full h-16">
                      <polyline fill="none" stroke="#2563EB" strokeWidth="3" points="5,58 55,46 105,49 155,28 205,32 255,14 295,8" />
                      <polyline fill="rgba(37,99,235,0.12)" stroke="none" points="5,68 5,58 55,46 105,49 155,28 205,32 255,14 295,8 295,68" />
                    </svg>
                    <div className="px-3.5 py-2 rounded-full bg-slate-100 text-slate-800 text-xs font-mono font-semibold flex items-center justify-between">
                      <span>Auto-settle 90% backrun rebate in USDG...</span>
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white inline-flex items-center justify-center text-[10px]">
                        ↑
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 pr-6">
                    <span className="inline-block px-3 py-0.5 rounded-full border border-blue-400/50 text-[11px] font-mono text-blue-300">
                      Ravelin Rebate Engine
                    </span>
                    <h4 className="font-display text-2xl font-bold leading-snug">
                      Turn every price impact into <span className="text-sky-400">automated wallet yield that pays you back</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      &ldquo;Capture 90% of sealed-bid searcher clearing prices in 200 ms, credited directly to your wallet on every block.&rdquo;
                    </p>
                  </div>
                </div>
              )}

              {/* Bento Card 3: Deterministic Loop Firewall */}
              {(bentoFilter === "all" || bentoFilter === "firewall") && (
                <div className="rounded-3xl bg-slate-900 text-white p-7 flex flex-col justify-between space-y-6 relative overflow-hidden border border-slate-800">
                  <div className="space-y-2">
                    <span className="inline-block px-3 py-0.5 rounded-full border border-blue-400/50 text-[11px] font-mono text-blue-300">
                      RocksDB Loop Guard
                    </span>
                    <h4 className="font-display text-2xl font-bold leading-snug">
                      <span className="text-sky-400">Halt runaway AI retry loops</span> and revert drains with an enclave firewall
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      &ldquo;Inspect ABI selectors, ArbSys L1+L2 gas bounds, and 60-second calldata hashes in 0.18 ms before a single wei of gas is spent.&rdquo;
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-7 font-mono text-[10px] text-slate-400 space-y-1 leading-relaxed">
                      <div className="text-blue-400">{"if (rocksdb.seen(calldataHash, 60s)) {"}</div>
                      <div className="pl-3 text-emerald-400">{"return refuseAtZeroGas();"}</div>
                      <div className="text-blue-400">{"}"}</div>
                      <div className="text-slate-500">// Saved $201,591 across 1,480 loops</div>
                    </div>
                    <div className="col-span-5 flex justify-center">
                      <svg viewBox="0 0 100 100" className="w-20 h-20">
                        <circle cx="50" cy="50" r="40" fill="rgba(37,99,235,0.2)" stroke="#3B82F6" strokeWidth="2" />
                        <path d="M35 50 L46 61 L68 39" fill="none" stroke="#38BDF8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Bento Card 4: WASM Verifier & Holding Pen */}
              {(bentoFilter === "all" || bentoFilter === "execution") && (
                <div className="rounded-3xl bg-slate-900 text-white p-7 flex flex-col justify-between space-y-6 relative overflow-hidden border border-slate-800">
                  <div className="space-y-2">
                    <span className="inline-block px-3 py-0.5 rounded-full border border-blue-400/50 text-[11px] font-mono text-blue-300">
                      New · WASM Verifier &amp; Holding Pen
                    </span>
                    <h4 className="font-display text-2xl font-bold leading-snug">
                      <span className="text-sky-400">Accelerate your path</span> to institutional RWA compliance and scale
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      &ldquo;Combine 10-minute independent WASM state assertion replays with multi-sig Holding Pen queues for orders above $10,000.&rdquo;
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-2.5 font-mono text-xs">
                    <div className="flex items-center justify-between text-blue-300">
                      <span>WASM State Root #48,912,050</span>
                      <span className="text-emerald-400 font-bold">100% Match</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 w-full" />
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Holding Pen Webhook SLA: &lt; 50 ms co-signature dispatch
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* PART C: Expanded Large-Padding, Large-Text Feature Comparison Section */}
          <div
            id="comparisonMatrixSection"
            className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-6 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                  18-Point Architecture &amp; Capability Matrix
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Compare deterministic safety guarantees and throughput quotas across all 4 tiers
                </p>
              </div>

              {/* Differences Only Toggle Switch */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-700">Differences Only</span>
                <button
                  id="showcaseDiffToggleBtn"
                  type="button"
                  role="switch"
                  aria-checked={diffOnly}
                  onClick={() => setDiffOnly(!diffOnly)}
                  className={`toggle-track ${diffOnly ? "is-on" : ""}`}
                >
                  <span className="toggle-knob" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-200 bg-slate-50/80">
                    <th className="p-4 sm:p-5 font-display font-bold text-slate-900">Feature / SLA</th>
                    <th className="p-4 sm:p-5 font-display font-bold text-slate-900 text-center">Free</th>
                    <th className="p-4 sm:p-5 font-display font-bold text-slate-900 text-center">Builder</th>
                    <th className="p-4 sm:p-5 font-display font-bold text-blue-900 text-center bg-blue-100/50">
                      Pro (Most Picked)
                    </th>
                    <th className="p-4 sm:p-5 font-display font-bold text-slate-900 text-center">Dedicated</th>
                  </tr>
                </thead>
                <tbody id="showcaseComparisonTableBody" className="divide-y divide-slate-100">
                  {filteredRows.map((row) => (
                    <tr key={row.label} className="hover:bg-slate-50/90 transition-colors">
                      <td className="p-4 sm:p-5 font-semibold text-slate-900">{row.label}</td>
                      <td className="p-4 sm:p-5 text-center">{formatCellVal(row.free, false)}</td>
                      <td className="p-4 sm:p-5 text-center">{formatCellVal(row.builder, false)}</td>
                      <td className="p-4 sm:p-5 text-center bg-blue-50/40">{formatCellVal(row.pro, true)}</td>
                      <td className="p-4 sm:p-5 text-center">{formatCellVal(row.dedicated, false)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
