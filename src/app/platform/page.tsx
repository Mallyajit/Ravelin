"use client";

import React, { useState } from "react";
import Link from "next/link";

const MODULES = [
  {
    icon: "⇄",
    name: "Ravelin RPC",
    badge: "1 ms Response",
    badgeColor: "bg-blue-100 text-blue-800",
    desc: "Dedicated AWS Nitro gateway co-located with the Robinhood Chain sequencer in US-East-1. Transactions route directly to block building without public mempool leakage.",
  },
  {
    icon: "◈",
    name: "Ravelin Auction",
    badge: "90% User Rebate",
    badgeColor: "bg-amber-100 text-amber-800",
    desc: "When a transaction shifts AMM pool reserves, searchers bid in a sub-200ms Dutch backrun auction. 90% of the winning clearing price is paid directly to your wallet.",
  },
  {
    icon: "✓",
    name: "Ravelin Validator",
    badge: "100% WASM Proof",
    badgeColor: "bg-emerald-100 text-emerald-800",
    desc: "Independent Arbitrum Orbit state assertion replay running in isolated WASM. Re-verifies sequencer state roots every 10 minutes before transaction settlement.",
  },
  {
    icon: "▤",
    name: "Ravelin Data",
    badge: "ClickHouse Feed",
    badgeColor: "bg-slate-100 text-slate-800",
    desc: "Real-time indexed transaction telemetry, duplicate loop counts, and fee audit logs accessible via JSON API and WebSocket streams.",
  },
  {
    icon: "≋",
    name: "AI Firewall & Holding Pen",
    badge: "Zero Failed Gas",
    badgeColor: "bg-blue-100 text-blue-800",
    desc: "RocksDB-backed duplicate calldata cache and >$10k threshold checks. Automatically halts AI retry storms before wasting execution gas.",
  },
  {
    icon: "⚡",
    name: "Agent & Searcher SDK",
    badge: "Viem & Web3.py",
    badgeColor: "bg-indigo-100 text-indigo-800",
    desc: "4-line drop-in client SDK for Python and TypeScript swarms with built-in ERC-4337 Smart Account co-signing validation.",
  },
];

const PRICING_PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    units: "5M request units",
    rpm: "1,000 req / min",
    features: [
      "Co-located 1 ms Nitro RPC",
      "90% Backrun Rebate share",
      "$0 Gas on Simulated Reverts",
      "Community Discord Support",
    ],
    highlight: false,
  },
  {
    name: "Builder",
    price: "$29",
    period: "per 30 days",
    units: "50M request units",
    rpm: "12,000 req / min",
    features: [
      "Everything in Free",
      "RocksDB Duplicate Loop Cooldown",
      "Custom Holding Pen Thresholds",
      "WebSocket Event Stream",
    ],
    highlight: false,
  },
  {
    name: "Pro",
    price: "$199",
    period: "per 30 days",
    units: "500M request units",
    rpm: "60,000 req / min",
    features: [
      "Everything in Builder",
      "Dedicated Enclave Core Worker",
      "Priority Backrun Auction Routing",
      "Direct Telegram Engineering Support",
      "Custom ERC-4337 Co-Signer Rules",
    ],
    highlight: true,
  },
  {
    name: "Dedicated",
    price: "$999",
    period: "per 30 days",
    units: "5B request units",
    rpm: "250,000 req / min",
    features: [
      "Everything in Pro",
      "Isolated AWS Nitro Hardware Enclave",
      "Sub-millisecond Cross-Connect",
      "Custom ClickHouse Telemetry Node",
      "99.99% Guaranteed SLA",
    ],
    highlight: false,
  },
];

export default function PlatformPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>("Pro");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-16">
      {/* Platform Header */}
      <div className="space-y-4 max-w-3xl">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800">
          ● Platform Architecture &amp; Transparent Plans
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          One Platform for Everything That Trades on Robinhood Chain
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          From private order flow and 200 ms backrun arbitrage rebates to hardware-isolated AI agent protection, Ravelin provides the complete execution stack for Robinhood Chain (ID 4663).
        </p>
      </div>

      {/* 6 Ecosystem Modules */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">6 Core Execution Modules</h2>
          <span className="text-xs font-mono text-blue-700">All Modules Live on Mainnet</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODULES.map((mod) => (
            <div
              key={mod.name}
              className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-lg">
                  {mod.icon}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${mod.badgeColor}`}>
                  {mod.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{mod.name}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{mod.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="space-y-8 pt-6">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900">Pay only for what you use</h2>
          <p className="text-sm text-slate-600">
            No hidden gas surcharges. Every plan includes the same co-located AWS Nitro node, private mempool routing, and 90% backrun rebate share.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRICING_PLANS.map((p) => (
            <div
              key={p.name}
              className={`rounded-3xl p-6 flex flex-col justify-between space-y-6 transition-all ${
                p.highlight
                  ? "bg-gradient-to-b from-blue-50 to-white border-2 border-blue-600 shadow-lg relative"
                  : "bg-white border border-slate-200 shadow-sm"
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full blue-pill-gradient text-white text-[10px] font-bold uppercase tracking-wider shadow">
                  Most Picked
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-extrabold font-mono text-slate-900">{p.price}</span>
                    <span className="text-xs text-slate-500">/{p.period}</span>
                  </div>
                  <div className="text-xs text-blue-700 font-semibold mt-1">
                    {p.units} · {p.rpm}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-2.5">
                  {p.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-xs text-slate-600">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPlan(p.name)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedPlan === p.name
                    ? "blue-pill-gradient text-white shadow-md"
                    : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                }`}
              >
                {selectedPlan === p.name ? "Current Selection ✓" : "Select Plan"}
              </button>
            </div>
          ))}
        </div>

        {/* Feature Matrix Footer */}
        <div className="blue-gradient-box text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md">
          <div className="space-y-1">
            <h4 className="text-lg font-bold">Need a Custom Sovereign Enclave?</h4>
            <p className="text-xs text-blue-100 max-w-xl">
              Institutions managing &gt;$50M order flow can provision dedicated AWS Nitro chips with custom RocksDB caching and specialized smart account signers.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-xl bg-white text-blue-900 text-xs font-bold hover:bg-blue-50 transition-colors shrink-0"
          >
            Contact Engineering →
          </Link>
        </div>
      </div>
    </div>
  );
}
