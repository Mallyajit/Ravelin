"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useEnclave } from "@/context/EnclaveContext";
import {
  PLAN_COMPARISON_ROWS,
  formatCellVal,
  PlanShowcaseModal,
} from "@/components/PlanShowcaseModal";
import { RazorpayModal } from "@/components/RazorpayModal";

export default function PricingPage() {
  const { loggedIn, activePlan, openPlanShowcaseModal, openRazorpayModal } = useEnclave();
  const [diffOnly, setDiffOnly] = useState(false);

  const displayedRows = diffOnly
    ? PLAN_COMPARISON_ROWS.filter((r) => r.diff)
    : PLAN_COMPARISON_ROWS;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 space-y-12">
      {/* Header */}
      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider font-mono">
          Throughput & Enclave Plans
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-display">
          Deterministic execution at every scale
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Co-located AWS Nitro node, private ingress, revert protection, and 90% backrun rebates on every plan.
        </p>
      </div>

      {/* 4 Auth-Aware Plan Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Free */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 font-display">Free</h2>
            <div className="text-3xl font-extrabold text-slate-900 font-mono">$0</div>
            <p className="text-xs text-slate-500">5M units · 1,000 req/min</p>
            <p className="text-xs text-slate-600 pt-2 border-t border-slate-100">
              Ideal for prototyping AI agents and testing private mempool routing on Robinhood Chain.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openPlanShowcaseModal("Free")}
            className={`tier-action-btn w-full ${!loggedIn ? "btn-primary-rounded" : "popup-btn"}`}
          >
            {!loggedIn ? "Upgrade" : "Downgrade"}
          </button>
        </div>

        {/* Builder */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 font-display">Builder</h2>
            <div className="text-3xl font-extrabold text-slate-900 font-mono">
              $29 <span className="text-xs font-normal text-slate-500">/ 30d</span>
            </div>
            <p className="text-xs text-slate-500">50M units · 12,000 req/min</p>
            <p className="text-xs text-slate-600 pt-2 border-t border-slate-100">
              For active algorithmic traders requiring custom loop cooldowns and WebSockets.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openPlanShowcaseModal("Builder")}
            className={`tier-action-btn w-full ${!loggedIn ? "btn-primary-rounded" : "popup-btn"}`}
          >
            {!loggedIn ? "Upgrade" : "Downgrade"}
          </button>
        </div>

        {/* Pro (Highlighted) */}
        <div className="bg-blue-50/70 border-2 border-blue-600 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-md relative">
          <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
            Most Popular
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 font-display">Pro</h2>
            <div className="text-3xl font-extrabold text-blue-900 font-mono">
              $199 <span className="text-xs font-normal text-slate-600">/ 30d</span>
            </div>
            <p className="text-xs text-slate-600">500M units · 60,000 req/min</p>
            <p className="text-xs text-slate-600 pt-2 border-t border-blue-100">
              Includes Nitro Enclave v4, instant per-block rebates, holding pen queue, and 25 sub-keys.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openPlanShowcaseModal("Pro")}
            className={`tier-action-btn w-full ${
              !loggedIn ? "btn-primary-rounded" : "popup-btn is-active"
            }`}
          >
            {!loggedIn ? "Upgrade" : activePlan === "Pro" ? "Current Plan" : "Upgrade"}
          </button>
        </div>

        {/* Dedicated */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 font-display">Dedicated</h2>
            <div className="text-3xl font-extrabold text-slate-900 font-mono">
              $999 <span className="text-xs font-normal text-slate-500">/ 30d</span>
            </div>
            <p className="text-xs text-slate-500">5B units · 250,000 req/min</p>
            <p className="text-xs text-slate-600 pt-2 border-t border-slate-100">
              Isolated AWS Nitro Enclave instance with sub-millisecond execution and custom SLA.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openPlanShowcaseModal("Dedicated")}
            className="tier-action-btn btn-primary-rounded w-full"
          >
            Upgrade
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900">
            Comprehensive Capability Matrix
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            All 18 protocol, firewall, and rebate capabilities compared across plans
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDiffOnly(!diffOnly)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50"
          >
            <span
              className={`w-3 h-3 rounded-full border ${
                diffOnly ? "bg-blue-600 border-blue-600" : "bg-white border-slate-300"
              }`}
            />
            Differences Only
          </button>
          <button
            type="button"
            onClick={() => openPlanShowcaseModal()}
            className="popup-btn"
          >
            Open Showcase Modal
          </button>
        </div>
      </div>

      {/* Part C: Large-Padding 18-Feature Comparison Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200">
              <th className="p-5 font-display text-xs sm:text-sm font-bold text-slate-900 w-2/5">
                Feature / Capability
              </th>
              <th className="p-5 font-display text-xs sm:text-sm font-bold text-slate-700 text-center">
                Free
              </th>
              <th className="p-5 font-display text-xs sm:text-sm font-bold text-slate-700 text-center">
                Builder
              </th>
              <th className="p-5 font-display text-xs sm:text-sm font-bold text-blue-900 bg-blue-50/50 text-center">
                Pro
              </th>
              <th className="p-5 font-display text-xs sm:text-sm font-bold text-slate-700 text-center">
                Dedicated
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {displayedRows.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-slate-50/60 transition-colors"
              >
                <td className="p-5 font-medium text-slate-800">
                  {row.label}
                </td>
                <td className="p-5 text-center text-slate-600">
                  {formatCellVal(row.free)}
                </td>
                <td className="p-5 text-center text-slate-600">
                  {formatCellVal(row.builder)}
                </td>
                <td className="p-5 text-center bg-blue-50/30">
                  {formatCellVal(row.pro, true)}
                </td>
                <td className="p-5 text-center text-slate-600">
                  {formatCellVal(row.dedicated)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="text-center text-xs text-slate-500 space-y-1">
        <p>¹ Rates and throughput limits apply to Robinhood Chain mainnet (Chain ID 4663).</p>
        <p>All plans settle 90% of backrun MEV rebates directly to your designated payout address.</p>
      </div>

      {/* Modals */}
      <PlanShowcaseModal />
      <RazorpayModal />
    </div>
  );
}
