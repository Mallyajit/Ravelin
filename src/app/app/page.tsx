"use client";

import React, { useState } from "react";
import {
  INITIAL_RULES,
  INITIAL_QUEUE,
  INITIAL_LOGS,
  PolicyRule,
  QueueItem,
  LogEntry,
} from "@/lib/data";

export default function AppConsolePage() {
  const [activeTab, setActiveTab] = useState<"overview" | "rules" | "holdingpen" | "logs">("overview");

  // Metrics state
  const [privateVol, setPrivateVol] = useState(7473107);
  const [rebatesUsd, setRebatesUsd] = useState(181432);
  const [loopsHalted, setLoopsHalted] = useState(147);
  const [circuitTripped, setCircuitTripped] = useState(false);
  const [apiKey, setApiKey] = useState("ordo_rvln_live_98a4f2c1e7b049d3a812f6e5");

  // Data lists state
  const [rules, setRules] = useState<PolicyRule[]>(INITIAL_RULES);
  const [queue, setQueue] = useState<QueueItem[]>(INITIAL_QUEUE);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [logFilter, setLogFilter] = useState<"ALL" | "ALLOW" | "DENY" | "HOLD">("ALL");

  // New rule form modal/inputs
  const [newRuleName, setNewRuleName] = useState("");
  const [newRuleContract, setNewRuleContract] = useState("");
  const [newRuleCondition, setNewRuleCondition] = useState("");
  const [newRuleAction, setNewRuleAction] = useState<"ALLOW" | "DENY" | "HOLD">("DENY");
  const [isAddingRule, setIsAddingRule] = useState(false);

  // Simulation handler: Private Swap
  const handleSimulatePrivateSwap = () => {
    const swapAmount = 4250;
    const rebateAmount = 19;
    setPrivateVol((v) => v + swapAmount);
    setRebatesUsd((r) => r + rebateAmount);

    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];
    const newHash = "0x" + Math.random().toString(16).slice(2, 6) + "..." + Math.random().toString(16).slice(2, 6);

    const newLog: LogEntry = {
      time: timeStr,
      hash: newHash,
      target: "0x88B1...90E2 (NVDA)",
      method: "swapExactTokensForTokens",
      gas: "$0.48",
      status: "ALLOW",
      note: `Simulated swap ($${swapAmount.toLocaleString()}) · 90% rebate (+$${rebateAmount}) paid`,
    };

    setLogs((prev) => [newLog, ...prev]);
  };

  // Simulation handler: AI Loop Block
  const handleSimulateAiLoopBlock = () => {
    setLoopsHalted((l) => l + 1);

    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];
    const newHash = "0x" + Math.random().toString(16).slice(2, 6) + "..." + Math.random().toString(16).slice(2, 6);

    const newLog: LogEntry = {
      time: timeStr,
      hash: newHash,
      target: "0x4F92...11A0 (USD.AI)",
      method: "transfer",
      gas: "$0.00",
      status: "DENY",
      note: "Rule_04_Loop_Detected (Duplicate calldata within 60s window refused · 0 Gas)",
    };

    setLogs((prev) => [newLog, ...prev]);
  };

  // Approve holding item
  const handleApproveHold = (id: string) => {
    const item = queue.find((q) => q.id === id);
    if (!item) return;

    setQueue((prev) => prev.filter((q) => q.id !== id));

    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];
    const newLog: LogEntry = {
      time: timeStr,
      hash: "0x" + Math.random().toString(16).slice(2, 6) + "...hold",
      target: item.asset,
      method: item.method.split("(")[0],
      gas: item.gas,
      status: "ALLOW",
      note: `Human operator APPROVED transaction (${item.id})`,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // Reject holding item
  const handleRejectHold = (id: string) => {
    const item = queue.find((q) => q.id === id);
    if (!item) return;

    setQueue((prev) => prev.filter((q) => q.id !== id));

    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];
    const newLog: LogEntry = {
      time: timeStr,
      hash: "0x" + Math.random().toString(16).slice(2, 6) + "...hold",
      target: item.asset,
      method: item.method.split("(")[0],
      gas: "$0.00",
      status: "DENY",
      note: `Human operator REJECTED transaction (${item.id})`,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // Add rule
  const handleAddRuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName || !newRuleContract || !newRuleCondition) return;

    const newRule: PolicyRule = {
      id: `RULE-0${rules.length + 1}`,
      name: newRuleName,
      contract: newRuleContract,
      condition: newRuleCondition,
      action: newRuleAction,
    };

    setRules([...rules, newRule]);
    setNewRuleName("");
    setNewRuleContract("");
    setNewRuleCondition("");
    setIsAddingRule(false);
  };

  const filteredLogs = logs.filter((l) => (logFilter === "ALL" ? true : l.status === logFilter));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Ravelin App &amp; Firewall Console</h1>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                circuitTripped
                  ? "bg-crimson/20 border border-crimson text-crimson"
                  : "bg-allow/10 border border-allow/30 text-allow"
              }`}
            >
              {circuitTripped ? "CIRCUIT BREAKER: TRIPPED" : "FIREWALL: ACTIVE"}
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Gateway: <span className="text-allow font-mono">1 ms median</span> · Sequencer Co-Location:{" "}
            <span className="text-white font-mono">Active (US-East-1)</span> · Rebate Share:{" "}
            <span className="text-amber font-mono">90% to User</span>
          </p>
        </div>

        {/* Quick Simulation Triggers */}
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={handleSimulatePrivateSwap}
            className="px-3.5 py-2 rounded-lg bg-obsidian border border-allow/40 text-allow hover:bg-allow/10 transition-colors"
          >
            + Simulate Private Swap (+Rebate)
          </button>
          <button
            type="button"
            onClick={handleSimulateAiLoopBlock}
            className="px-3.5 py-2 rounded-lg bg-obsidian border border-crimson/40 text-crimson hover:bg-crimson/10 transition-colors"
          >
            + Simulate AI Loop Block (0 Gas)
          </button>
          <button
            type="button"
            onClick={() => setCircuitTripped((t) => !t)}
            className={`px-3.5 py-2 rounded-lg font-bold border transition-colors ${
              circuitTripped
                ? "bg-allow text-black border-allow"
                : "bg-obsidian border-crimson text-crimson hover:bg-crimson/10"
            }`}
          >
            {circuitTripped ? "Reset Circuit Breaker" : "Emergency Kill-Switch"}
          </button>
        </div>
      </div>

      {/* Top 4 Metrics */}
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

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/10 gap-6 text-sm font-medium">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === "overview"
              ? "border-amber text-white font-bold"
              : "border-transparent text-neutral-400 hover:text-white"
          }`}
        >
          API Key &amp; Gateway
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("rules")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "rules"
              ? "border-amber text-white font-bold"
              : "border-transparent text-neutral-400 hover:text-white"
          }`}
        >
          <span>AI Firewall Rules</span>
          <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[11px] font-mono">{rules.length}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("holdingpen")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "holdingpen"
              ? "border-amber text-white font-bold"
              : "border-transparent text-neutral-400 hover:text-white"
          }`}
        >
          <span>Holding Pen Queue</span>
          {queue.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber/20 text-amber text-[11px] font-mono">
              {queue.length}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("logs")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "logs"
              ? "border-amber text-white font-bold"
              : "border-transparent text-neutral-400 hover:text-white"
          }`}
        >
          <span>Audit Logs</span>
          <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[11px] font-mono">{logs.length}</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & API KEY */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="bg-obsidian border border-white/10 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">Your Gateway &amp; Firewall Key</h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Embed this key in your RPC URL or bearer header to route transactions through Ravelin
                </p>
              </div>
              <button
                type="button"
                onClick={() => setApiKey("ordo_rvln_live_" + Math.random().toString(16).slice(2, 18))}
                className="px-4 py-2 rounded-lg bg-surface border border-white/15 hover:border-white text-xs font-mono text-white transition-colors"
              >
                Rotate API Key
              </button>
            </div>

            <div className="p-3.5 rounded-lg bg-black border border-white/10 font-mono text-xs text-amber break-all">
              {apiKey}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-lg bg-black border border-white/10 font-mono text-xs space-y-1">
                <div className="text-neutral-500">PRIVATE HTTPS RPC URL</div>
                <div className="text-emerald truncate">https://rpc.ravelin.network/v1/{apiKey.slice(0, 16)}...</div>
              </div>
              <div className="p-4 rounded-lg bg-black border border-white/10 font-mono text-xs space-y-1">
                <div className="text-neutral-500">WEBSOCKET BACKRUN STREAM</div>
                <div className="text-allow truncate">wss://rpc.ravelin.network/stream/{apiKey.slice(0, 16)}...</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FIREWALL POLICY RULES */}
      {activeTab === "rules" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Deterministic Execution Firewall Rules</h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Rules enforced inside AWS Nitro hardware enclave prior to sequencer submission
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingRule(!isAddingRule)}
              className="px-3.5 py-2 rounded-lg bg-emerald text-black text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              {isAddingRule ? "Cancel" : "+ Add Policy Rule"}
            </button>
          </div>

          {/* Add Rule Form */}
          {isAddingRule && (
            <form
              onSubmit={handleAddRuleSubmit}
              className="p-5 rounded-xl bg-surface border border-white/15 space-y-4 text-xs font-mono"
            >
              <div className="font-bold text-white text-sm">Create New Enclave Policy Rule</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Rule Name</label>
                  <input
                    type="text"
                    required
                    value={newRuleName}
                    onChange={(e) => setNewRuleName(e.target.value)}
                    placeholder="e.g. Max Slippage Cap"
                    className="w-full bg-black border border-white/15 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Contract / Scope</label>
                  <input
                    type="text"
                    required
                    value={newRuleContract}
                    onChange={(e) => setNewRuleContract(e.target.value)}
                    placeholder="0x... or All Contracts"
                    className="w-full bg-black border border-white/15 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Condition</label>
                  <input
                    type="text"
                    required
                    value={newRuleCondition}
                    onChange={(e) => setNewRuleCondition(e.target.value)}
                    placeholder="e.g. Value > $5,000"
                    className="w-full bg-black border border-white/15 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <span className="text-neutral-400">Action:</span>
                  {(["ALLOW", "DENY", "HOLD"] as const).map((act) => (
                    <button
                      key={act}
                      type="button"
                      onClick={() => setNewRuleAction(act)}
                      className={`px-3 py-1 rounded border text-xs ${
                        newRuleAction === act
                          ? act === "ALLOW"
                            ? "bg-allow/20 border-allow text-allow font-bold"
                            : act === "DENY"
                            ? "bg-crimson/20 border-crimson text-crimson font-bold"
                            : "bg-amber/20 border-amber text-amber font-bold"
                          : "border-white/10 text-neutral-400"
                      }`}
                    >
                      {act}
                    </button>
                  ))}
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald text-black font-semibold hover:opacity-90"
                >
                  Save to Nitro Enclave
                </button>
              </div>
            </form>
          )}

          {/* Rules Table */}
          <div className="bg-obsidian border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-surface text-neutral-400 border-b border-white/10">
                <tr>
                  <th className="px-6 py-3.5">ID</th>
                  <th className="px-6 py-3.5">RULE NAME</th>
                  <th className="px-6 py-3.5">TARGET CONTRACT</th>
                  <th className="px-6 py-3.5">CONDITION</th>
                  <th className="px-6 py-3.5 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rules.map((r) => (
                  <tr key={r.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-neutral-400">{r.id}</td>
                    <td className="px-6 py-4 font-bold text-white">{r.name}</td>
                    <td className="px-6 py-4 text-neutral-300">{r.contract}</td>
                    <td className="px-6 py-4 text-neutral-300">{r.condition}</td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`px-2.5 py-1 rounded font-bold ${
                          r.action === "ALLOW"
                            ? "bg-allow/10 text-allow"
                            : r.action === "DENY"
                            ? "bg-crimson/10 text-crimson"
                            : "bg-amber/10 text-amber"
                        }`}
                      >
                        {r.action}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: HOLDING PEN HUMAN QUEUE */}
      {activeTab === "holdingpen" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Holding Pen Human Override Queue</h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                High-notional orders (&gt;$10,000) paused for human approval before co-signing
              </p>
            </div>
            <span className="text-xs font-mono text-amber px-2.5 py-1 rounded bg-amber/10 border border-amber/20">
              {queue.length} Pending Approval
            </span>
          </div>

          {queue.length === 0 ? (
            <div className="p-12 text-center bg-obsidian border border-white/10 rounded-xl space-y-2">
              <div className="text-emerald text-base font-semibold font-mono">Queue is empty ✓</div>
              <p className="text-xs text-neutral-400">All pending trades have been approved or rejected.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {queue.map((item) => (
                <div
                  key={item.id}
                  className="bg-obsidian border border-white/10 rounded-xl p-5 space-y-4 font-mono text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white text-sm">{item.id}</span>
                      <span className="text-neutral-400">Agent: {item.agent}</span>
                      <span className="px-2 py-0.5 rounded bg-amber/10 text-amber font-bold">
                        ${item.amountUsd.toLocaleString()} USD
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleApproveHold(item.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-allow text-black font-semibold hover:opacity-90"
                      >
                        Approve &amp; Sign ✓
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRejectHold(item.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-crimson/20 border border-crimson text-crimson font-semibold hover:bg-crimson/30"
                      >
                        Reject ✕
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-neutral-500">TARGET ASSET</div>
                      <div className="text-white mt-0.5">{item.asset}</div>
                      <div className="text-neutral-500 mt-2">DECODED METHOD</div>
                      <div className="text-emerald mt-0.5 truncate">{item.method}</div>
                    </div>
                    <div>
                      <div className="text-neutral-500">TRIGGER REASON</div>
                      <div className="text-amber mt-0.5">{item.reason}</div>
                      <div className="text-neutral-500 mt-2">ESTIMATED GAS (ARBSYS)</div>
                      <div className="text-neutral-300 mt-0.5">{item.gas}</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-black border border-white/5 text-[11px] text-neutral-400 break-all">
                    Calldata: {item.calldata}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === "logs" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-white">ClickHouse Telemetry &amp; Enclave Audit Logs</h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Real-time evaluation stream from AWS Nitro TEE
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-neutral-400">Filter:</span>
              {(["ALL", "ALLOW", "DENY", "HOLD"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setLogFilter(f)}
                  className={`px-2.5 py-1 rounded border transition-colors ${
                    logFilter === f
                      ? "bg-white text-black border-white font-bold"
                      : "bg-obsidian border-white/10 text-neutral-400 hover:text-white"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-obsidian border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-surface text-neutral-400 border-b border-white/10">
                <tr>
                  <th className="px-6 py-3.5">TIME</th>
                  <th className="px-6 py-3.5">HASH</th>
                  <th className="px-6 py-3.5">TARGET</th>
                  <th className="px-6 py-3.5">METHOD</th>
                  <th className="px-6 py-3.5">GAS</th>
                  <th className="px-6 py-3.5">STATUS</th>
                  <th className="px-6 py-3.5">ENCLAVE NOTE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLogs.map((l, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-neutral-400">{l.time}</td>
                    <td className="px-6 py-4 text-white">{l.hash}</td>
                    <td className="px-6 py-4 text-neutral-300">{l.target}</td>
                    <td className="px-6 py-4 text-emerald">{l.method}</td>
                    <td className="px-6 py-4 text-neutral-300">{l.gas}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          l.status === "ALLOW"
                            ? "bg-allow/10 text-allow"
                            : l.status === "DENY"
                            ? "bg-crimson/10 text-crimson"
                            : "bg-amber/10 text-amber"
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-400 truncate max-w-[280px]">{l.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
