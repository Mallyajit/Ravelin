"use client";

import React, { useState } from "react";
import { useEnclave } from "@/context/EnclaveContext";

export default function ConsolePage() {
  const {
    billingTier,
    computeUnits,
    allowedCount,
    deniedCount,
    hourlySpendUsd,
    hourlyBudgetUsd,
    setHourlyBudgetUsd,
    cooldownSeconds,
    setCooldownSeconds,
    humanThresholdUsd,
    setHumanThresholdUsd,
    breakerMaxDenies,
    setBreakerMaxDenies,
    recentDeniesInMinute,
    circuitBreakerTripped,
    tripCircuitBreaker,
    resetCircuitBreaker,
    apiKey,
    rotateApiKey,
    policyRules,
    addPolicyRule,
    removePolicyRule,
    holdingPen,
    approveHoldingItem,
    rejectHoldingItem,
    auditLogs,
    simulateIntent,
    setStatusBanner,
  } = useEnclave();

  const [tab, setTab] = useState<"overview" | "policy" | "holdingpen" | "logs" | "enclave">("overview");
  const [selectedHoldingId, setSelectedHoldingId] = useState("HP-9041");
  const [logFilter, setLogFilter] = useState<"ALL" | "DENY" | "REQUIRES_HUMAN_SIGNATURE" | "ALLOW">("ALL");
  const [newContract, setNewContract] = useState("0x4F92...11A0 (Robinhood USD.AI)");
  const [newMethod, setNewMethod] = useState("transfer(address,uint256)");
  const [newThreshold, setNewThreshold] = useState("1000");
  const [newAction, setNewAction] = useState<"DENY" | "REQUIRES_HUMAN_SIGNATURE" | "ALLOW">("DENY");

  const pendingItems = holdingPen.filter((x) => x.status === "PENDING");
  const currentHold = pendingItems.find((x) => x.id === selectedHoldingId) || pendingItems[0];
  const cuPercent = Math.min(100, Math.round((computeUnits / 2000000) * 100));

  const compiledPolicy = {
    enclave_version: "1.4.2-nitro",
    chain_id: 4663,
    arbsys_precompile: "0x0000000000000000000000000000000000000064",
    constraints: {
      hourly_budget_usd: hourlyBudgetUsd,
      duplicate_calldata_cooldown_seconds: cooldownSeconds,
      rocksdb_eviction_ttl_seconds: cooldownSeconds + 60,
      human_override_threshold_usd: humanThresholdUsd,
    },
    circuit_breaker: {
      max_deny_per_minute: breakerMaxDenies,
      tripped: circuitBreakerTripped,
    },
    rules: policyRules,
  };

  return (
    <div>
      {/* Console Top Status Bar */}
      <div className="bg-obsidian border-b border-hairline px-4 sm:px-6 py-3 font-mono text-xs">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <span className="text-slatedim text-[10px] block">BILLING_TIER</span>
              <span className="text-white font-semibold">{billingTier}</span>
            </div>
            <div className="w-52">
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-slatedim">COMPUTE_UNITS</span>
                <span className="text-emerald">{computeUnits.toLocaleString()} / 2M ({cuPercent}%)</span>
              </div>
              <div className="w-full h-2 bg-base border border-hairline">
                <div className="h-full bg-emerald" style={{ width: `${cuPercent}%` }} />
              </div>
            </div>
            <div>
              <span className="text-slatedim text-[10px] block">CIRCUIT_BREAKER</span>
              <span
                className={`px-1.5 py-0.5 bg-surface border text-[11px] font-bold ${
                  circuitBreakerTripped ? "border-crimson text-crimson" : "border-allow text-allow"
                }`}
              >
                {circuitBreakerTripped ? "TRIPPED (LOCKED)" : `ARMED (${recentDeniesInMinute}/${breakerMaxDenies} DENY)`}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slatedim text-[11px] mr-1">INJECT_INTENT:</span>
            <button
              type="button"
              onClick={() => simulateIntent("allow")}
              className="px-2.5 py-1.5 bg-surface border border-allow text-allow"
            >
              + Valid Swap
            </button>
            <button
              type="button"
              onClick={() => simulateIntent("deny")}
              className="px-2.5 py-1.5 bg-surface border border-crimson text-crimson"
            >
              + Retry Loop (Deny)
            </button>
            <button
              type="button"
              onClick={() => simulateIntent("hold")}
              className="px-2.5 py-1.5 bg-surface border border-override text-override"
            >
              + &gt;$10k Trade (Hold)
            </button>
          </div>
        </div>
      </div>

      {/* Console Sub-Tabs */}
      <div className="bg-base border-b border-hairline px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-2 font-mono text-xs">
          {[
            { id: "overview", label: "01. Dashboard Overview" },
            { id: "policy", label: "02. Policy Engine (Rule Builder)" },
            { id: "holdingpen", label: `03. Human Override Queue (${pendingItems.length})` },
            { id: "logs", label: "04. Incident Audit Logs (ClickHouse)" },
            { id: "enclave", label: "05. Enclave & Circuit Breakers" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id as any)}
              className={`px-3.5 py-2 border shrink-0 ${
                tab === t.id
                  ? "bg-surface border-emerald text-white font-semibold"
                  : "bg-obsidian border-hairline text-slatedim hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-mono text-xs">
        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card-obsidian p-4">
                <div className="text-slatedim">ALLOWED_TX (24H)</div>
                <div className="text-2xl font-bold text-allow mt-1">{allowedCount.toLocaleString()}</div>
              </div>
              <div className="card-obsidian p-4">
                <div className="text-slatedim">DENIED_REVERTS (24H)</div>
                <div className="text-2xl font-bold text-deny mt-1">{deniedCount.toLocaleString()}</div>
              </div>
              <div className="card-obsidian p-4">
                <div className="text-slatedim">HOLDING_PEN_QUEUE</div>
                <div className="text-2xl font-bold text-override mt-1">{pendingItems.length}</div>
              </div>
              <div className="card-obsidian p-4">
                <div className="text-slatedim">HOURLY_BUDGET_USED</div>
                <div className="text-2xl font-bold text-white mt-1">
                  ${hourlySpendUsd.toFixed(2)} / ${hourlyBudgetUsd}
                </div>
              </div>
            </div>

            <div className="card-obsidian p-5 space-y-3">
              <div className="text-white font-bold">ENCLAVE KEY MANAGER</div>
              <div className="bg-base border border-hairline p-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-slatedim text-[10px]">ACTIVE_SDK_API_KEY</div>
                  <div className="text-emerald font-semibold">{apiKey}</div>
                </div>
                <button
                  type="button"
                  onClick={rotateApiKey}
                  className="px-3 py-1.5 bg-surface border border-crimson text-crimson"
                >
                  Rotate Key
                </button>
              </div>
              <div className="bg-base border border-hairline p-3">
                <div className="text-slatedim text-[10px]">TEE_PUBLIC_COSIGNER_KEY (ERC-4337 SMART ACCOUNT)</div>
                <div className="text-white break-all mt-0.5">
                  0x04a9f87c3d1e5b2098a7c6d5e4f3a2b1c09d8e7f6a5b4c3d2e1f0a9b8c7d6e91b
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "policy" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 card-obsidian p-5 space-y-5">
              <div className="text-white font-bold">VISUAL DETERMINISTIC RULE BUILDER</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-base border border-hairline p-4">
                <select
                  value={newContract}
                  onChange={(e) => setNewContract(e.target.value)}
                  className="bg-obsidian border border-hairline p-2 text-white"
                >
                  <option value="0x4F92...11A0 (Robinhood USD.AI)">0x4F92...11A0 (Robinhood USD.AI)</option>
                  <option value="0x88B1...90E2 (Tokenized NVDA)">0x88B1...90E2 (Tokenized NVDA)</option>
                  <option value="0x31C4...77B9 (Tokenized AAPL)">0x31C4...77B9 (Tokenized AAPL)</option>
                </select>
                <select
                  value={newMethod}
                  onChange={(e) => setNewMethod(e.target.value)}
                  className="bg-obsidian border border-hairline p-2 text-white"
                >
                  <option value="transfer(address,uint256)">transfer(address,uint256)</option>
                  <option value="swapExactTokensForTokens">swapExactTokensForTokens</option>
                </select>
                <input
                  type="number"
                  value={newThreshold}
                  onChange={(e) => setNewThreshold(e.target.value)}
                  className="bg-obsidian border border-hairline p-2 text-white"
                />
                <select
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value as any)}
                  className="bg-obsidian border border-hairline p-2 text-white"
                >
                  <option value="DENY">DENY (Revert EVM)</option>
                  <option value="REQUIRES_HUMAN_SIGNATURE">REQUIRES_HUMAN_SIGNATURE</option>
                  <option value="ALLOW">ALLOW</option>
                </select>
                <button
                  type="button"
                  onClick={() =>
                    addPolicyRule({
                      contract: newContract,
                      method: newMethod,
                      threshold: `> ${newThreshold} ETH`,
                      action: newAction,
                    })
                  }
                  className="sm:col-span-2 py-2 bg-emerald text-base font-bold"
                >
                  + Add Rule to Policy
                </button>
              </div>

              <div className="space-y-2">
                {policyRules.map((r, i) => (
                  <div key={r.id} className="bg-base border border-hairline p-3 flex justify-between items-center">
                    <span>
                      <strong>{r.id}</strong>: IF {r.contract} • {r.method} ({r.threshold}) → {r.action}
                    </span>
                    <button
                      type="button"
                      onClick={() => removePolicyRule(i)}
                      className="px-2 py-1 bg-surface border border-hairline text-crimson"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-base border border-hairline p-4 space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Hourly Gas + Capital Budget (USD):</span>
                    <span className="text-emerald font-bold">${hourlyBudgetUsd}/hr</span>
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={5000}
                    step={50}
                    value={hourlyBudgetUsd}
                    onChange={(e) => setHourlyBudgetUsd(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Duplicate-Calldata Cooldown Timer:</span>
                    <span className="text-emerald font-bold">{cooldownSeconds}s (RocksDB TTL: {cooldownSeconds + 60}s)</span>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={3600}
                    step={4}
                    value={cooldownSeconds}
                    onChange={(e) => setCooldownSeconds(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 card-obsidian p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white font-bold">REAL-TIME POLICY JSON</span>
                <button
                  type="button"
                  onClick={() => setStatusBanner("POLICY_DEPLOYED", "Compiled policy ruleset into AWS Nitro Enclave.", "allow")}
                  className="px-3 py-1 bg-crimson text-white font-bold"
                >
                  Deploy to Enclave
                </button>
              </div>
              <pre className="bg-base border border-hairline p-3 text-emerald overflow-x-auto">
                {JSON.stringify(compiledPolicy, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {tab === "holdingpen" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 card-obsidian p-5 space-y-3">
              <div className="text-white font-bold">HOLDING PEN // REQUIRES_HUMAN_SIGNATURE</div>
              {pendingItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedHoldingId(item.id)}
                  className={`p-3 border cursor-pointer flex justify-between ${
                    currentHold?.id === item.id ? "bg-surface border-override text-white" : "bg-base border-hairline"
                  }`}
                >
                  <span>
                    <strong className="text-override">{item.id}</strong> • {item.agentId} • {item.asset}
                  </span>
                  <span className="font-bold">${item.notionalUsd.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="lg:col-span-5 card-obsidian p-5 firewall-line space-y-3">
              <div className="text-white font-bold">DEEP CALLDATA INSPECTOR</div>
              {currentHold ? (
                <>
                  <div className="bg-base border border-hairline p-3 text-emerald break-all">{currentHold.decodedFn}</div>
                  <div className="bg-base border border-hairline p-3 text-slateprimary break-all">{currentHold.rawCalldata}</div>
                  <div className="bg-base border border-hairline p-3 text-white">{currentHold.reasoning}</div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => approveHoldingItem(currentHold.id)}
                      className="py-2.5 bg-allow text-base font-bold"
                    >
                      [Approve &amp; Sign]
                    </button>
                    <button
                      type="button"
                      onClick={() => rejectHoldingItem(currentHold.id)}
                      className="py-2.5 bg-crimson text-white font-bold"
                    >
                      [Reject &amp; Drop]
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-slatedim">All holding pen items resolved.</div>
              )}
            </div>
          </div>
        )}

        {tab === "logs" && (
          <div className="card-obsidian p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-white font-bold">CLICKHOUSE FORENSIC AUDIT LOGS</span>
              <div className="flex gap-1.5">
                {(["ALL", "DENY", "REQUIRES_HUMAN_SIGNATURE", "ALLOW"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setLogFilter(f)}
                    className={`px-3 py-1 border ${
                      logFilter === f ? "bg-surface border-emerald text-white" : "bg-base border-hairline text-slatedim"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              {auditLogs
                .filter((l) => logFilter === "ALL" || l.state === logFilter)
                .map((log, idx) => (
                  <div key={idx} className="bg-base border border-hairline p-2.5 flex flex-wrap justify-between gap-2">
                    <span>
                      <span className="text-slatedim">{log.ts}</span> • <strong className="text-white">{log.hash}</strong> •{" "}
                      {log.contract}
                    </span>
                    <span
                      className={
                        log.state === "DENY"
                          ? "text-crimson font-bold"
                          : log.state === "REQUIRES_HUMAN_SIGNATURE"
                          ? "text-override"
                          : "text-allow"
                      }
                    >
                      [{log.state}] {log.reason}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {tab === "enclave" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card-obsidian p-5 space-y-3">
              <div className="text-white font-bold">ROCKSDB STATEFUL MEMORY &amp; ATTESTATION</div>
              <div className="bg-base border border-hairline p-3">
                RocksDB Eviction Policy: Purging calldata hashes older than <strong>{cooldownSeconds + 60} seconds</strong>
              </div>
              <div className="bg-base border border-hairline p-3 break-all">
                PCR0: 8f9d2c4e7b1a093f6d5c8b2e4a1f0c9d3e7b6a5f4c2d1e0b9a8f7e6d5c4b3a21
              </div>
            </div>

            <div className="card-obsidian p-5 firewall-line space-y-4">
              <div className="text-white font-bold">HARD-STOP CIRCUIT BREAKERS</div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Auto-Trip Threshold (Deny Events / 60s):</span>
                  <span className="text-crimson font-bold">{breakerMaxDenies} Denies / min</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={100}
                  step={5}
                  value={breakerMaxDenies}
                  onChange={(e) => setBreakerMaxDenies(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={tripCircuitBreaker}
                  className="py-2.5 bg-crimson text-white font-bold"
                >
                  [Trip Emergency Kill-Switch]
                </button>
                <button
                  type="button"
                  onClick={resetCircuitBreaker}
                  className="py-2.5 bg-surface border border-allow text-allow font-bold"
                >
                  [Reset &amp; Re-Arm Enclave]
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
