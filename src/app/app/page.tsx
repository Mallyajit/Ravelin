"use client";
import React, { useState } from "react";

export default function AppConsolePage() {
  const [privateVol, setPrivateVol] = useState(7473107);
  const [rebatesUsd, setRebatesUsd] = useState(181432);
  const [loopsHalted, setLoopsHalted] = useState(147);
  const [apiKey, setApiKey] = useState("ordo_rvln_live_98a4f2c1e7b049d3a812f6e5");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ravelin App &amp; Firewall Console</h1>
          <p className="text-xs text-slate-500 mt-1">
            Gateway: <span className="text-emerald-600 font-mono font-bold">1 ms median</span> · Sequencer Co-Location: <span className="text-slate-900 font-mono font-bold">Active</span> · Rebate Share: <span className="text-blue-700 font-mono font-bold">90% to User</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              setPrivateVol((v) => v + 4250);
              setRebatesUsd((r) => r + 19);
            }}
            className="popup-btn popup-btn-primary px-3.5 py-2 text-xs"
          >
            + Simulate Private Swap (+Rebate)
          </button>
          <button
            type="button"
            onClick={() => setLoopsHalted((l) => l + 1)}
            className="popup-btn px-3.5 py-2 text-xs text-red-700 border-red-300"
          >
            + Simulate AI Loop Block (0 Gas)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs text-slate-500">Delivered Privately</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1" suppressHydrationWarning>${privateVol.toLocaleString('en-US')}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs text-slate-500">90% User Rebates Paid</div>
          <div className="text-2xl font-bold text-emerald-600 font-mono mt-1" suppressHydrationWarning>${rebatesUsd.toLocaleString('en-US')}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs text-slate-500">Reverts &amp; Loops Refused</div>
          <div className="text-2xl font-bold text-amber-600 font-mono mt-1">{loopsHalted}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs text-slate-500">$RVLN Bought Back</div>
          <div className="text-2xl font-bold text-blue-700 font-mono mt-1">430,215 RVLN</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Your Gateway &amp; Firewall Key</h2>
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-blue-800 break-all font-bold">
          {apiKey}
        </div>
        <button
          type="button"
          onClick={() => setApiKey("ordo_rvln_live_" + Math.random().toString(16).slice(2, 18))}
          className="popup-btn px-4 py-2 text-xs font-mono"
        >
          Rotate API Key
        </button>
      </div>
    </div>
  );
}
