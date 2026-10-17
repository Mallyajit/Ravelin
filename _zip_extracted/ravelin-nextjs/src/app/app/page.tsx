"use client";
import React, { useState } from "react";

export default function AppConsolePage() {
  const [privateVol, setPrivateVol] = useState(7473107);
  const [rebatesUsd, setRebatesUsd] = useState(181432);
  const [loopsHalted, setLoopsHalted] = useState(147);
  const [apiKey, setApiKey] = useState("ordo_rvln_live_98a4f2c1e7b049d3a812f6e5");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white">Ravelin App &amp; Firewall Console</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Gateway: <span className="text-allow font-mono">1 ms median</span> · Sequencer Co-Location: <span className="text-white font-mono">Active</span> · Rebate Share: <span className="text-amber font-mono">90% to User</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              setPrivateVol((v) => v + 4250);
              setRebatesUsd((r) => r + 19);
            }}
            className="px-3.5 py-2 rounded-lg bg-obsidian border border-allow/40 text-allow"
          >
            + Simulate Private Swap (+Rebate)
          </button>
          <button
            type="button"
            onClick={() => setLoopsHalted((l) => l + 1)}
            className="px-3.5 py-2 rounded-lg bg-obsidian border border-crimson/40 text-crimson"
          >
            + Simulate AI Loop Block (0 Gas)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-obsidian border border-white/10 rounded-xl p-5">
          <div className="text-xs text-neutral-400">Delivered Privately</div>
          <div className="text-2xl font-bold text-white font-mono mt-1">${privateVol.toLocaleString()}</div>
        </div>
        <div className="bg-obsidian border border-white/10 rounded-xl p-5">
          <div className="text-xs text-neutral-400">90% User Rebates Paid</div>
          <div className="text-2xl font-bold text-allow font-mono mt-1">${rebatesUsd.toLocaleString()}</div>
        </div>
        <div className="bg-obsidian border border-white/10 rounded-xl p-5">
          <div className="text-xs text-neutral-400">Reverts &amp; Loops Refused</div>
          <div className="text-2xl font-bold text-amber font-mono mt-1">{loopsHalted}</div>
        </div>
        <div className="bg-obsidian border border-white/10 rounded-xl p-5">
          <div className="text-xs text-neutral-400">$RVLN Bought Back</div>
          <div className="text-2xl font-bold text-emerald font-mono mt-1">430,215 RVLN</div>
        </div>
      </div>

      <div className="bg-obsidian border border-white/10 rounded-xl p-6 space-y-3">
        <h2 className="text-base font-semibold text-white">Your Gateway &amp; Firewall Key</h2>
        <div className="p-3.5 rounded-lg bg-black border border-white/10 font-mono text-xs text-amber break-all">
          {apiKey}
        </div>
        <button
          type="button"
          onClick={() => setApiKey("ordo_rvln_live_" + Math.random().toString(16).slice(2, 18))}
          className="px-4 py-2 rounded-lg bg-surface border border-white/15 text-xs font-mono text-white"
        >
          Rotate API Key
        </button>
      </div>
    </div>
  );
}
