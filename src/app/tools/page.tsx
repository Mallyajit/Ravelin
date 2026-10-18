"use client";
import React, { useState } from "react";

export default function ToolsPage() {
  const [tradeAmt, setTradeAmt] = useState(1500);
  const [budgetUsd, setBudgetUsd] = useState(500);
  const [cooldownSec, setCooldownSec] = useState(60);
  const [monthlyVol, setMonthlyVol] = useState(50000);
  const [simResult, setSimResult] = useState("Ready to simulate on Robinhood Chain (ID 4663).");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <div className="blue-gradient-box text-white rounded-3xl p-6 sm:p-8 shadow-lg">
        <div className="text-xs font-mono uppercase text-blue-200">PRACTICAL WORKBENCH · ZERO SLIDERS</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Interactive Enclave Simulator, Firewall &amp; Rebate Calculator</h1>
        <p className="text-sm text-blue-100 mt-1">
          All controls use exact numeric inputs, +/- buttons, and preset pills—no sensitive sliders.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-blue-200 rounded-3xl p-6 space-y-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">1. Live Transaction &amp; Loop Simulator</h2>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-600 block">Exact Trade Amount ($ USD)</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setTradeAmt(Math.max(50, tradeAmt - 250))} className="px-3.5 py-2 rounded-xl bg-slate-100 font-bold hover:bg-slate-200">-$250</button>
              <input type="number" value={tradeAmt} onChange={(e) => setTradeAmt(Number(e.target.value))} className="flex-1 px-3.5 py-2 rounded-xl border border-blue-300 font-mono font-bold" />
              <button type="button" onClick={() => setTradeAmt(tradeAmt + 250)} className="px-3.5 py-2 rounded-xl bg-slate-100 font-bold hover:bg-slate-200">+$250</button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setSimResult(`✓ Delivered $${tradeAmt.toLocaleString('en-US')} swap privately in 1.02 ms · Est. 90% Rebate: +$${(tradeAmt * 0.0018).toFixed(2)}`)} className="px-4 py-2.5 rounded-xl blue-pill-gradient text-white text-xs font-bold shadow hover:opacity-90">
              Simulate Valid Swap
            </button>
            <button type="button" onClick={() => setSimResult(`⊘ Refused duplicate AI retry loop (< ${cooldownSec}s) · $0.00 gas spent!`)} className="px-4 py-2.5 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-bold hover:bg-red-100">
              Simulate AI Retry Loop
            </button>
          </div>
          <div className="blue-card-soft rounded-xl p-4 font-mono text-xs text-slate-800">{simResult}</div>
        </div>

        <div className="bg-white border border-blue-200 rounded-3xl p-6 space-y-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">2. Precision Firewall Policy (No Sliders)</h2>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-600 block">Hourly Spend Cap ($ USD): ${budgetUsd}/hr</label>
            <div className="flex flex-wrap gap-2">
              {[100, 500, 1000, 2500, 5000].map((v) => (
                <button key={v} type="button" onClick={() => setBudgetUsd(v)} className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${budgetUsd === v ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-800 hover:bg-blue-100"}`}>
                  ${v}/hr
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-600 block">Duplicate Loop Cooldown: {cooldownSec}s</label>
            <div className="flex flex-wrap gap-2">
              {[10, 30, 60, 120, 300].map((s) => (
                <button key={s} type="button" onClick={() => setCooldownSec(s)} className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${cooldownSec === s ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-800 hover:bg-blue-100"}`}>
                  {s} sec
                </button>
              ))}
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100">
            <label className="text-xs font-bold uppercase text-slate-600 block mb-1">3. Monthly Rebate Estimator ($ USD Volume)</label>
            <input type="number" value={monthlyVol} onChange={(e) => setMonthlyVol(Number(e.target.value))} className="w-full px-3.5 py-2 rounded-xl border border-blue-300 font-mono font-bold text-sm" />
            <div className="mt-2 text-xs font-mono text-blue-700 font-bold">
              Est. 90% Backrun Rebate: +${(monthlyVol * 0.0018).toFixed(2)}/mo · Gas Saved: +${(monthlyVol * 0.00085).toFixed(2)}/mo
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
