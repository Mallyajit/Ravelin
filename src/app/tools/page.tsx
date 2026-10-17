"use client";

import React, { useState } from "react";
import { INITIAL_QUEUE, QueueItem } from "@/lib/data";

export default function ToolsWorkbenchPage() {
  const [activeTab, setActiveTab] = useState<"simulator" | "policy" | "rebate" | "holdingpen">("simulator");

  // TOOL 1: 4-Stage Hardware Pipeline Simulator State
  const [selectedAsset, setSelectedAsset] = useState<"NVDA" | "AAPL" | "TSLA">("NVDA");
  const [intentType, setIntentType] = useState<"swap" | "loop" | "large">("swap");
  const [tradeAmount, setTradeAmount] = useState<number>(4500);
  const [simRunning, setSimRunning] = useState<boolean>(false);
  const [simResult, setSimResult] = useState<{
    stage1: string;
    stage2: string;
    stage3: string;
    stage4: string;
    verdict: "ALLOW" | "DENY" | "HOLD";
    details: string;
    gasSaved: string;
    rebateUsd: string;
  } | null>(null);

  // TOOL 2: Precision Policy Configurator State (Zero sliders - numeric + steppers + pills)
  const [hourlyBudget, setHourlyBudget] = useState<number>(500);
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(60);
  const [humanThreshold, setHumanThreshold] = useState<number>(10000);
  const [blockDuplicateLoops, setBlockDuplicateLoops] = useState<boolean>(true);
  const [includeArbSysBlobFee, setIncludeArbSysBlobFee] = useState<boolean>(true);
  const [policySaved, setPolicySaved] = useState<boolean>(false);

  // TOOL 3: Rebate Calculator & Holding Pen State
  const [monthlyVolume, setMonthlyVolume] = useState<number>(250000);
  const [arbBps, setArbBps] = useState<number>(12); // basis points
  const [queueItems, setQueueItems] = useState<QueueItem[]>(INITIAL_QUEUE);
  const [approvedNotification, setApprovedNotification] = useState<string | null>(null);

  // Run Stage Simulator
  const handleRunSimulation = () => {
    setSimRunning(true);
    setSimResult(null);

    setTimeout(() => {
      setSimRunning(false);

      if (intentType === "loop") {
        setSimResult({
          stage1: "Received UserOp from Signer Ingress",
          stage2: "Nitro TEE Dry-Run: Hash matched existing calldata in RocksDB (<60s window)",
          stage3: "Rule_04_Loop_Detected: Execution refused immediately before paying gas",
          stage4: "Blocked before Sequencer ingress ($0 gas paid)",
          verdict: "DENY",
          details: `Duplicate calldata retry loop halted. Prevented wallet drain for ${selectedAsset}/USDC.`,
          gasSaved: "$0.48",
          rebateUsd: "$0.00",
        });
      } else if (intentType === "large" || tradeAmount >= humanThreshold) {
        setSimResult({
          stage1: "Received UserOp from Signer Ingress",
          stage2: "Nitro TEE Dry-Run: Pre-simulation passed with zero EVM reverts",
          stage3: `Rule_09_Human_Threshold_Exceeded: Notional ($${tradeAmount.toLocaleString()}) >= $${humanThreshold.toLocaleString()}`,
          stage4: "Routed to Holding Pen for operator co-signature before sequencer batching",
          verdict: "HOLD",
          details: `Transaction safely held in Holding Pen queue (HP-${Math.floor(1000 + Math.random() * 9000)}).`,
          gasSaved: "$0.00 (Queued)",
          rebateUsd: "Pending Approval",
        });
      } else {
        const calculatedRebate = (tradeAmount * 0.0025 * 0.9).toFixed(2);
        setSimResult({
          stage1: "Received UserOp from Signer Ingress",
          stage2: "Nitro TEE Dry-Run: State validated against latest Robinhood block #14,892,180",
          stage3: `Backrun Auction Settled in 184ms: Searcher rebate paid (90% to user = $${calculatedRebate})`,
          stage4: "Sequenced on Robinhood Chain L2 (1 ms median gateway response)",
          verdict: "ALLOW",
          details: `Transaction confirmed with zero mempool exposure. 90% rebate ($${calculatedRebate}) credited.`,
          gasSaved: "$0.00 (Pre-simulated)",
          rebateUsd: `$${calculatedRebate}`,
        });
      }
    }, 450);
  };

  const handleApprove = (id: string) => {
    setQueueItems(queueItems.filter((q) => q.id !== id));
    setApprovedNotification(`Transaction ${id} approved & co-signed by Enclave.`);
    setTimeout(() => setApprovedNotification(null), 3500);
  };

  const handleReject = (id: string) => {
    setQueueItems(queueItems.filter((q) => q.id !== id));
    setApprovedNotification(`Transaction ${id} rejected & dropped.`);
    setTimeout(() => setApprovedNotification(null), 3500);
  };

  // Rebate calculations
  const totalBackrunProfit = (monthlyVolume * (arbBps / 10000));
  const userRebateShare = totalBackrunProfit * 0.9;
  const gasSavingsPrevented = (monthlyVolume * 0.0008);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Top Banner */}
      <div className="blue-gradient-box text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-300 inline-block" />
          <span>Section 2: Practical Interactive Workbench · Zero Sliders</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Precision Enclave &amp; Firewall Workbench
        </h1>
        <p className="text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
          Test real transaction lifecycles, configure hardware-isolated firewall rules, and compute exact 90% backrun rebates using exact numeric steppers and preset pill controls.
        </p>

        {/* Tab Strip */}
        <div className="flex flex-wrap gap-2 pt-4">
          <button
            type="button"
            onClick={() => setActiveTab("simulator")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "simulator"
                ? "bg-white text-blue-900 shadow-md font-bold"
                : "bg-white/15 text-white hover:bg-white/25"
            }`}
          >
            1. 4-Stage Hardware Simulator
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("policy")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "policy"
                ? "bg-white text-blue-900 shadow-md font-bold"
                : "bg-white/15 text-white hover:bg-white/25"
            }`}
          >
            2. Policy Configurator (No Sliders)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("rebate")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "rebate"
                ? "bg-white text-blue-900 shadow-md font-bold"
                : "bg-white/15 text-white hover:bg-white/25"
            }`}
          >
            3. 90% Rebate &amp; Gas Calculator
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("holdingpen")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "holdingpen"
                ? "bg-white text-blue-900 shadow-md font-bold"
                : "bg-white/15 text-white hover:bg-white/25"
            }`}
          >
            <span>4. Holding Pen Queue</span>
            {queueItems.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-bold">
                {queueItems.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {approvedNotification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center justify-between">
          <span>✓ {approvedNotification}</span>
          <button type="button" onClick={() => setApprovedNotification(null)} className="text-emerald-700">
            ✕
          </button>
        </div>
      )}

      {/* TAB 1: 4-STAGE HARDWARE PIPELINE SIMULATOR */}
      {activeTab === "simulator" && (
        <div className="space-y-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-slate-900">4-Stage Enclave Pipeline Simulator</h2>
              <p className="text-xs text-slate-500 mt-1">
                Simulate how user transactions, AI loop retry bursts, and high-notional orders are evaluated inside the hardware enclave.
              </p>
            </div>

            {/* Asset Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                1. Select Tokenized RWA Pair
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "NVDA", label: "NVDA Token / USDC", desc: "0x88B1...90E2" },
                  { id: "AAPL", label: "AAPL Token / USDC", desc: "0x31C4...77B9" },
                  { id: "TSLA", label: "TSLA Token / USDC", desc: "0x55E9...44A1" },
                ].map((token) => (
                  <button
                    key={token.id}
                    type="button"
                    onClick={() => setSelectedAsset(token.id as "NVDA" | "AAPL" | "TSLA")}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      selectedAsset === token.id
                        ? "border-blue-600 bg-blue-50/70 text-blue-900 font-semibold shadow-sm"
                        : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <div className="text-sm font-bold">{token.label}</div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">{token.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Intent Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Transaction Intent Pattern
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "swap", title: "Standard Private Swap", desc: "Normal order with 90% backrun rebate" },
                  { id: "loop", title: "AI Duplicate Calldata Loop", desc: "Tests 60s cooldown loop detection ($0 gas)" },
                  { id: "large", title: "Large Institutional Trade", desc: "Exceeds $10,000 Holding Pen threshold" },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => {
                      setIntentType(type.id as "swap" | "loop" | "large");
                      if (type.id === "large" && tradeAmount < 10000) {
                        setTradeAmount(15000);
                      }
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      intentType === type.id
                        ? "border-blue-600 bg-blue-50/70 text-blue-900 font-semibold shadow-sm"
                        : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <div className="text-xs font-bold">{type.title}</div>
                    <div className="text-[11px] text-slate-500 mt-1">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Exact Notional Input (Zero Sliders) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                3. Order Notional (Exact Input &amp; Steppers — Zero Sliders)
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-sm">
                  <button
                    type="button"
                    onClick={() => setTradeAmount(Math.max(100, tradeAmount - 500))}
                    className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold font-mono text-sm"
                  >
                    –
                  </button>
                  <div className="flex items-center px-3 font-mono font-bold text-slate-900">
                    <span className="text-slate-400 mr-1">$</span>
                    <input
                      type="number"
                      value={tradeAmount}
                      onChange={(e) => setTradeAmount(Math.max(0, Number(e.target.value)))}
                      className="w-28 text-slate-900 font-mono font-bold outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setTradeAmount(tradeAmount + 500)}
                    className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold font-mono text-sm"
                  >
                    +
                  </button>
                </div>

                {/* Preset Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  {[1000, 4500, 10000, 15000, 25000].map((pill) => (
                    <button
                      key={pill}
                      type="button"
                      onClick={() => setTradeAmount(pill)}
                      className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold border transition-colors ${
                        tradeAmount === pill
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      ${pill.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={simRunning}
              onClick={handleRunSimulation}
              className="w-full py-3.5 rounded-xl blue-pill-gradient text-white font-bold text-sm shadow-md hover:opacity-95 disabled:opacity-50 transition-opacity"
            >
              {simRunning ? "Executing Hardware Nitro Replay..." : "Run 4-Stage Hardware Simulation →"}
            </button>
          </div>

          {/* Simulation Output Card */}
          {simResult && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Enclave Execution Outcome</h3>
                  <p className="text-xs text-slate-500">{simResult.details}</p>
                </div>
                <span
                  className={`px-3.5 py-1 rounded-full font-mono font-bold text-xs self-start sm:self-auto ${
                    simResult.verdict === "ALLOW"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : simResult.verdict === "DENY"
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  VERDICT: {simResult.verdict}
                </span>
              </div>

              {/* 4 Pipeline Stages */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-[11px] font-mono font-bold text-blue-700">STAGE 1: INGRESS</div>
                  <div className="text-xs text-slate-700 font-medium">{simResult.stage1}</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-[11px] font-mono font-bold text-blue-700">STAGE 2: PRE-SIM</div>
                  <div className="text-xs text-slate-700 font-medium">{simResult.stage2}</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-[11px] font-mono font-bold text-blue-700">STAGE 3: POLICY &amp; AUCTION</div>
                  <div className="text-xs text-slate-700 font-medium">{simResult.stage3}</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-[11px] font-mono font-bold text-blue-700">STAGE 4: SEQUENCER</div>
                  <div className="text-xs text-slate-700 font-medium">{simResult.stage4}</div>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                  <div className="text-xs text-slate-500 font-mono">BACKRUN REBATE PAID</div>
                  <div className="text-xl font-bold text-blue-700 font-mono mt-0.5">{simResult.rebateUsd}</div>
                </div>
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                  <div className="text-xs text-slate-500 font-mono">FAILED GAS PREVENTED</div>
                  <div className="text-xl font-bold text-emerald-600 font-mono mt-0.5">{simResult.gasSaved}</div>
                </div>
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 col-span-2 sm:col-span-1">
                  <div className="text-xs text-slate-500 font-mono">NITRO PCR0 PROOF</div>
                  <div className="text-xs font-mono font-bold text-slate-800 truncate mt-1">
                    8f9d2c4e7b1a...3a21 ✓
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRECISION FIREWALL POLICY CONFIGURATOR (ZERO SLIDERS) */}
      {activeTab === "policy" && (
        <div className="space-y-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Precision Firewall Policy Configurator</h2>
              <p className="text-xs text-slate-500 mt-1">
                Configure deterministic limits enforced inside the AWS Nitro Enclave before any calldata is signed.
              </p>
            </div>

            {/* Control 1: Hourly Spend Cap */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-bold text-slate-900">1. Maximum Hourly Gas &amp; Value Spend Cap</div>
                  <p className="text-xs text-slate-500">Halts agent execution if spend rate exceeds budget per hour.</p>
                </div>
                <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-sm">
                  <button
                    type="button"
                    onClick={() => setHourlyBudget(Math.max(50, hourlyBudget - 50))}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold font-mono text-sm"
                  >
                    –
                  </button>
                  <div className="flex items-center px-3 font-mono font-bold text-slate-900 text-sm">
                    <span className="text-slate-400 mr-1">$</span>
                    <input
                      type="number"
                      value={hourlyBudget}
                      onChange={(e) => setHourlyBudget(Math.max(0, Number(e.target.value)))}
                      className="w-20 text-slate-900 font-mono font-bold outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setHourlyBudget(hourlyBudget + 50)}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold font-mono text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-slate-400 font-mono">Presets:</span>
                {[100, 250, 500, 1000, 2500, 5000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setHourlyBudget(val)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border ${
                      hourlyBudget === val
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    ${val}/hr
                  </button>
                ))}
              </div>
            </div>

            {/* Control 2: Duplicate Calldata Cooldown */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-bold text-slate-900">2. Duplicate Calldata Cooldown Window</div>
                  <p className="text-xs text-slate-500">Refuses identical transaction payloads to halt AI retry loops.</p>
                </div>
                <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-sm">
                  <button
                    type="button"
                    onClick={() => setCooldownSeconds(Math.max(5, cooldownSeconds - 5))}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold font-mono text-sm"
                  >
                    –
                  </button>
                  <div className="flex items-center px-3 font-mono font-bold text-slate-900 text-sm">
                    <input
                      type="number"
                      value={cooldownSeconds}
                      onChange={(e) => setCooldownSeconds(Math.max(1, Number(e.target.value)))}
                      className="w-16 text-slate-900 font-mono font-bold outline-none"
                    />
                    <span className="text-slate-400 ml-1">sec</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCooldownSeconds(cooldownSeconds + 5)}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold font-mono text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-slate-400 font-mono">Presets:</span>
                {[10, 30, 60, 120, 180, 300].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setCooldownSeconds(val)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border ${
                      cooldownSeconds === val
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {val}s
                  </button>
                ))}
              </div>
            </div>

            {/* Control 3: Holding Pen Notional Threshold */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-bold text-slate-900">3. Holding Pen Human Approval Threshold</div>
                  <p className="text-xs text-slate-500">Orders exceeding this USD notional pause for multi-sig approval.</p>
                </div>
                <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-sm">
                  <button
                    type="button"
                    onClick={() => setHumanThreshold(Math.max(1000, humanThreshold - 1000))}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold font-mono text-sm"
                  >
                    –
                  </button>
                  <div className="flex items-center px-3 font-mono font-bold text-slate-900 text-sm">
                    <span className="text-slate-400 mr-1">$</span>
                    <input
                      type="number"
                      value={humanThreshold}
                      onChange={(e) => setHumanThreshold(Math.max(0, Number(e.target.value)))}
                      className="w-24 text-slate-900 font-mono font-bold outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setHumanThreshold(humanThreshold + 1000)}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold font-mono text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-slate-400 font-mono">Presets:</span>
                {[2500, 5000, 10000, 15000, 25000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setHumanThreshold(val)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border ${
                      humanThreshold === val
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    ${val.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Feature Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white cursor-pointer">
                <span className="text-xs font-bold text-slate-800">Enforce RocksDB Cooldown Eviction</span>
                <input
                  type="checkbox"
                  checked={blockDuplicateLoops}
                  onChange={(e) => setBlockDuplicateLoops(e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
              </label>
              <label className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white cursor-pointer">
                <span className="text-xs font-bold text-slate-800">Include ArbSys 0x...0064 L1 Blob Gas</span>
                <input
                  type="checkbox"
                  checked={includeArbSysBlobFee}
                  onChange={(e) => setIncludeArbSysBlobFee(e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
              </label>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setPolicySaved(true);
                  setTimeout(() => setPolicySaved(false), 3000);
                }}
                className="px-6 py-3 rounded-xl blue-pill-gradient text-white text-xs font-bold shadow-md hover:opacity-95"
              >
                {policySaved ? "Policy Synced to Nitro Enclave ✓" : "Commit Policy to AWS Nitro Enclave"}
              </button>
              <span className="text-xs font-mono text-slate-400">Enclave Version: 1.4.2-nitro</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 90% REBATE & GAS SAVINGS CALCULATOR */}
      {activeTab === "rebate" && (
        <div className="space-y-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Investor 90% Backrun Rebate &amp; Gas Savings Calculator</h2>
              <p className="text-xs text-slate-500 mt-1">
                Calculate direct cash return to your wallet from 200 ms Dutch backrun auctions and failed gas prevention.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Monthly Volume */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800">Monthly Trading Volume</span>
                  <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-sm">
                    <button
                      type="button"
                      onClick={() => setMonthlyVolume(Math.max(10000, monthlyVolume - 25000))}
                      className="px-3 py-1 bg-slate-100 font-bold text-slate-700"
                    >
                      –
                    </button>
                    <span className="px-3 font-mono font-bold text-sm text-slate-900">
                      ${monthlyVolume.toLocaleString()}
                    </span>
                    <button
                      type="button"
                      onClick={() => setMonthlyVolume(monthlyVolume + 25000)}
                      className="px-3 py-1 bg-slate-100 font-bold text-slate-700"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[50000, 100000, 250000, 500000, 1000000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setMonthlyVolume(val)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border ${
                        monthlyVolume === val
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white border-slate-200 text-slate-700"
                      }`}
                    >
                      ${val >= 1000000 ? `${val / 1000000}M` : `${val / 1000}k`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Arb Profit Spread */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800">Average Backrun Spread</span>
                  <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-sm">
                    <button
                      type="button"
                      onClick={() => setArbBps(Math.max(1, arbBps - 1))}
                      className="px-3 py-1 bg-slate-100 font-bold text-slate-700"
                    >
                      –
                    </button>
                    <span className="px-3 font-mono font-bold text-sm text-slate-900">{arbBps} bps</span>
                    <button
                      type="button"
                      onClick={() => setArbBps(arbBps + 1)}
                      className="px-3 py-1 bg-slate-100 font-bold text-slate-700"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[5, 8, 12, 16, 25].map((bps) => (
                    <button
                      key={bps}
                      type="button"
                      onClick={() => setArbBps(bps)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border ${
                        arbBps === bps
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white border-slate-200 text-slate-700"
                      }`}
                    >
                      {bps} bps
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculations Card */}
            <div className="blue-gradient-box text-white rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <div className="text-xs text-blue-200 font-mono">ESTIMATED 90% REBATE SHARE</div>
                  <div className="text-3xl font-extrabold font-mono mt-1">${userRebateShare.toFixed(2)}</div>
                  <div className="text-xs text-blue-200 mt-1">Paid directly in USDG or ETH</div>
                </div>
                <div>
                  <div className="text-xs text-blue-200 font-mono">FAILED GAS SAVED ($0 REVERTS)</div>
                  <div className="text-3xl font-extrabold font-mono text-emerald-300 mt-1">
                    ${gasSavingsPrevented.toFixed(2)}
                  </div>
                  <div className="text-xs text-blue-200 mt-1">Simulated pre-flight in enclave</div>
                </div>
                <div>
                  <div className="text-xs text-blue-200 font-mono">TOTAL INVESTOR VALUE PRESERVED</div>
                  <div className="text-3xl font-extrabold font-mono text-amber-300 mt-1">
                    ${(userRebateShare + gasSavingsPrevented).toFixed(2)}
                  </div>
                  <div className="text-xs text-blue-200 mt-1">Net surplus across 30 days</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: HOLDING PEN HUMAN QUEUE */}
      {activeTab === "holdingpen" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Holding Pen Human Override Queue</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Orders exceeding the ${humanThreshold.toLocaleString()} threshold are safely queued for multi-sig operator review.
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 self-start sm:self-auto">
                {queueItems.length} Pending Approval
              </span>
            </div>

            {queueItems.length === 0 ? (
              <div className="p-12 text-center bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="text-emerald-700 font-bold text-base">All Items Cleared ✓</div>
                <p className="text-xs text-slate-500">There are no pending high-notional transactions in the queue.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {queueItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4 font-mono text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-slate-900 text-sm">{item.id}</span>
                        <span className="text-slate-500">Agent: {item.agent}</span>
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                          ${item.amountUsd.toLocaleString()} USD
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleApprove(item.id)}
                          className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
                        >
                          Approve &amp; Sign ✓
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(item.id)}
                          className="px-4 py-1.5 rounded-lg bg-red-100 text-red-700 border border-red-200 font-semibold hover:bg-red-200 transition-colors"
                        >
                          Reject ✕
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="text-slate-400 text-[11px]">TARGET ASSET</div>
                        <div className="text-slate-800 font-bold mt-0.5">{item.asset}</div>
                        <div className="text-slate-400 text-[11px] mt-2">DECODED METHOD</div>
                        <div className="text-blue-700 truncate mt-0.5">{item.method}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[11px]">TRIGGER REASON</div>
                        <div className="text-amber-800 mt-0.5">{item.reason}</div>
                        <div className="text-slate-400 text-[11px] mt-2">ESTIMATED GAS (ARBSYS)</div>
                        <div className="text-slate-700 mt-0.5">{item.gas}</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-500 break-all">
                      Calldata: {item.calldata}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
