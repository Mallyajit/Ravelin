"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type TriState = "ALLOW" | "DENY" | "REQUIRES_HUMAN_SIGNATURE";

export interface PolicyRule {
  id: string;
  contract: string;
  method: string;
  threshold: string;
  action: TriState;
  enabled: boolean;
}

export interface HoldingPenItem {
  id: string;
  agentId: string;
  asset: string;
  notionalUsd: number;
  ruleId: string;
  decodedFn: string;
  rawCalldata: string;
  reasoning: string;
  gasCost: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface AuditLogItem {
  ts: string;
  hash: string;
  contract: string;
  method: string;
  gas: string;
  state: TriState;
  reason: string;
}

interface EnclaveContextType {
  walletAddress: string;
  walletProvider: string;
  isWalletModalOpen: boolean;
  setWalletModalOpen: (open: boolean) => void;
  connectWallet: (providerName: string, address: string) => void;
  billingTier: string;
  setBillingTier: (tier: string) => void;
  blockHeight: number;
  computeUnits: number;
  allowedCount: number;
  deniedCount: number;
  hourlySpendUsd: number;
  hourlyBudgetUsd: number;
  setHourlyBudgetUsd: (val: number) => void;
  cooldownSeconds: number;
  setCooldownSeconds: (val: number) => void;
  humanThresholdUsd: number;
  setHumanThresholdUsd: (val: number) => void;
  breakerMaxDenies: number;
  setBreakerMaxDenies: (val: number) => void;
  recentDeniesInMinute: number;
  circuitBreakerTripped: boolean;
  tripCircuitBreaker: () => void;
  resetCircuitBreaker: () => void;
  apiKey: string;
  rotateApiKey: () => void;
  policyRules: PolicyRule[];
  addPolicyRule: (rule: Omit<PolicyRule, "id" | "enabled">) => void;
  removePolicyRule: (index: number) => void;
  holdingPen: HoldingPenItem[];
  approveHoldingItem: (id: string) => void;
  rejectHoldingItem: (id: string) => void;
  auditLogs: AuditLogItem[];
  simulateIntent: (type: "allow" | "deny" | "hold") => void;
  statusBanner: { tag: string; message: string; tone: "allow" | "deny" | "override" };
  setStatusBanner: (tag: string, message: string, tone?: "allow" | "deny" | "override") => void;
}

const EnclaveContext = createContext<EnclaveContextType | undefined>(undefined);

export function EnclaveProvider({ children }: { children: React.ReactNode }) {
  const [walletAddress, setWalletAddress] = useState("0x71C9...89A2");
  const [walletProvider, setWalletProvider] = useState("Rabby Wallet");
  const [isWalletModalOpen, setWalletModalOpen] = useState(false);
  const [billingTier, setBillingTier] = useState("Production Swarm (Chain 4663)");
  const [blockHeight, setBlockHeight] = useState(48912044);
  const [computeUnits, setComputeUnits] = useState(1420840);
  const [allowedCount, setAllowedCount] = useState(18492);
  const [deniedCount, setDeniedCount] = useState(147);
  const [hourlySpendUsd, setHourlySpendUsd] = useState(312.4);
  const [hourlyBudgetUsd, setHourlyBudgetUsd] = useState(500);
  const [cooldownSeconds, setCooldownSeconds] = useState(60);
  const [humanThresholdUsd, setHumanThresholdUsd] = useState(10000);
  const [breakerMaxDenies, setBreakerMaxDenies] = useState(50);
  const [recentDeniesInMinute, setRecentDeniesInMinute] = useState(0);
  const [circuitBreakerTripped, setCircuitBreakerTripped] = useState(false);
  const [apiKey, setApiKey] = useState("rw_live_98a4f2c1e7b049d3a812f6e5");
  const [statusBanner, setStatusBannerState] = useState<{
    tag: string;
    message: string;
    tone: "allow" | "deny" | "override";
  }>({
    tag: "LIVE_ON_4663",
    message: "AWS Nitro Enclave connected to Robinhood Chain (Chain ID: 4663). All deterministic policies active.",
    tone: "allow",
  });

  const [policyRules, setPolicyRules] = useState<PolicyRule[]>([
    {
      id: "RULE_01",
      contract: "0x4F92...11A0 (Robinhood USD.AI)",
      method: "transfer(address,uint256)",
      threshold: "> 1000 ETH",
      action: "DENY",
      enabled: true,
    },
    {
      id: "RULE_04",
      contract: "* (All Contracts)",
      method: "* (Identical Calldata Hash)",
      threshold: "Repeat < 60s",
      action: "DENY",
      enabled: true,
    },
    {
      id: "RULE_09",
      contract: "0x31C4...77B9 (Tokenized AAPL)",
      method: "swapExactTokensForTokens",
      threshold: "> $10,000 USD",
      action: "REQUIRES_HUMAN_SIGNATURE",
      enabled: true,
    },
  ]);

  const [holdingPen, setHoldingPen] = useState<HoldingPenItem[]>([
    {
      id: "HP-9041",
      agentId: "eliza-rwa-arb-01",
      asset: "0x31C4...77B9 (AAPL)",
      notionalUsd: 18450.0,
      ruleId: "RULE_09_HUMAN_THRESHOLD_EXCEEDED",
      decodedFn: "swapExactTokensForTokens(uint256 amountIn: 18450000000, address tokenOut: 0x31C4...77B9 [AAPL])",
      rawCalldata: "0x38ed1739000000000000000000000000000000000000000000000000000000044b97f20000000000000000000000000031c49012a8f7b9",
      reasoning: '"Detected AAPL RWA discount of 42bps on Robinhood Chain Orbit pool. Attempting $18,450 rebalancing allocation."',
      gasCost: "0.00023 ETH ($0.58)",
      status: "PENDING",
    },
    {
      id: "HP-9042",
      agentId: "langchain-nvda-mm",
      asset: "0x88B1...90E2 (NVDA)",
      notionalUsd: 12800.0,
      ruleId: "RULE_09_HUMAN_THRESHOLD_EXCEEDED",
      decodedFn: "mintRWA(address to: 0x71C9...89A2, uint256 notionalUsd: 12800000000)",
      rawCalldata: "0x40c10f1900000000000000000000000071c95911e9a5d330f4d621842ec243ee134389a200000000000000000000000000000002faf08000",
      reasoning: '"Expanding NVDA stock token inventory ahead of US market open on Robinhood Chain."',
      gasCost: "0.00021 ETH ($0.52)",
      status: "PENDING",
    },
    {
      id: "HP-9043",
      agentId: "treasury-sweeper-04",
      asset: "0x4F92...11A0 (USD.AI)",
      notionalUsd: 24000.0,
      ruleId: "RULE_09_HUMAN_THRESHOLD_EXCEEDED",
      decodedFn: "transfer(address recipient: 0x99D0...44C1, uint256 amount: 24000000000)",
      rawCalldata: "0xa9059cbb00000000000000000000000099d08812c4e10023a1b2c3d4e5f60718293a44c1000000000000000000000000000000059682f000",
      reasoning: '"Reallocating idle USD.AI collateral to Robinhood Earn yield strategy."',
      gasCost: "0.00018 ETH ($0.45)",
      status: "PENDING",
    },
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([
    {
      ts: "2026-10-16 17:34:12.104",
      hash: "0x9f1a...88c2",
      contract: "0x88B1...90E2 (NVDA)",
      method: "swapExactTokensForTokens",
      gas: "0.00019 ETH ($0.48)",
      state: "DENY",
      reason: "Reason: Rule_04_Loop_Detected (Duplicate hash < 60s)",
    },
    {
      ts: "2026-10-16 17:34:11.980",
      hash: "0x9f1a...88c2",
      contract: "0x88B1...90E2 (NVDA)",
      method: "swapExactTokensForTokens",
      gas: "0.00019 ETH ($0.48)",
      state: "ALLOW",
      reason: "Co-signed by Enclave (PCR0 verified)",
    },
    {
      ts: "2026-10-16 17:33:54.412",
      hash: "0x3d09...11e7",
      contract: "0xDEAD...9999 (Unlisted)",
      method: "approve(address,uint256)",
      gas: "0.00014 ETH ($0.35)",
      state: "DENY",
      reason: "Reason: Target_Contract_Not_Whitelisted",
    },
    {
      ts: "2026-10-16 17:33:20.008",
      hash: "0x7b44...9041",
      contract: "0x31C4...77B9 (AAPL)",
      method: "swapExactTokensForTokens",
      gas: "0.00023 ETH ($0.58)",
      state: "REQUIRES_HUMAN_SIGNATURE",
      reason: "Reason: Rule_09_Human_Threshold_Exceeded ($18,450)",
    },
    {
      ts: "2026-10-16 17:32:49.710",
      hash: "0x5a12...c301",
      contract: "0x4F92...11A0 (USD.AI)",
      method: "transfer(address,uint256)",
      gas: "0.00017 ETH ($0.42)",
      state: "DENY",
      reason: "Reason: Rule_02_Hourly_Budget_Exceeded (>$500/hr)",
    },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setBlockHeight((b) => b + 10);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const setStatusBanner = (tag: string, message: string, tone: "allow" | "deny" | "override" = "allow") => {
    setStatusBannerState({ tag, message, tone });
  };

  const connectWallet = (providerName: string, address: string) => {
    setWalletProvider(providerName);
    setWalletAddress(address);
    setWalletModalOpen(false);
    setStatusBanner("WALLET_CONNECTED", `Connected ${providerName} (${address}) on Robinhood Chain (ID: 4663).`, "allow");
  };

  const rotateApiKey = () => {
    const hex = Math.random().toString(16).slice(2, 14) + Math.random().toString(16).slice(2, 14);
    const nextKey = "rw_live_" + hex.slice(0, 24);
    setApiKey(nextKey);
    setStatusBanner("KEY_ROTATED", "Rotated active SDK API key and revoked prior token.", "allow");
  };

  const addPolicyRule = (rule: Omit<PolicyRule, "id" | "enabled">) => {
    const nextId = `RULE_0${policyRules.length + 1}`;
    setPolicyRules((prev) => [...prev, { ...rule, id: nextId, enabled: true }]);
    setStatusBanner("RULE_ADDED", `Added ${nextId} to deterministic enclave policy.`, "allow");
  };

  const removePolicyRule = (index: number) => {
    setPolicyRules((prev) => prev.filter((_, i) => i !== index));
    setStatusBanner("RULE_REMOVED", "Removed policy rule. Deploy to enclave to update state.", "override");
  };

  const approveHoldingItem = (id: string) => {
    const target = holdingPen.find((x) => x.id === id);
    if (!target) return;
    setHoldingPen((prev) => prev.map((item) => (item.id === id ? { ...item, status: "APPROVED" } : item)));
    setAllowedCount((c) => c + 1);
    setAuditLogs((prev) => [
      {
        ts: new Date().toISOString().replace("T", " ").slice(0, 23),
        hash: "0x77e1..." + id.slice(3),
        contract: target.asset,
        method: "swapExactTokensForTokens",
        gas: target.gasCost,
        state: "ALLOW",
        reason: `Human Operator Co-Signed (${id} resolved)`,
      },
      ...prev,
    ]);
    setStatusBanner("HUMAN_APPROVED", `Co-signed ${id} via hardware wallet and broadcast to Robinhood Chain.`, "allow");
  };

  const rejectHoldingItem = (id: string) => {
    const target = holdingPen.find((x) => x.id === id);
    if (!target) return;
    setHoldingPen((prev) => prev.map((item) => (item.id === id ? { ...item, status: "REJECTED" } : item)));
    setDeniedCount((c) => c + 1);
    setAuditLogs((prev) => [
      {
        ts: new Date().toISOString().replace("T", " ").slice(0, 23),
        hash: "0x00d9..." + id.slice(3),
        contract: target.asset,
        method: "swapExactTokensForTokens",
        gas: "0.00000 ETH ($0.00)",
        state: "DENY",
        reason: `Reason: Human_Operator_Rejected (${id} dropped)`,
      },
      ...prev,
    ]);
    setStatusBanner("HUMAN_REJECTED", `Dropped ${id} and returned strict EVM revert to agent context.`, "deny");
  };

  const tripCircuitBreaker = () => {
    setCircuitBreakerTripped(true);
    setStatusBanner("CIRCUIT_BREAKER_TRIPPED", "Emergency kill-switch engaged: API keys revoked and Smart Account paused.", "deny");
  };

  const resetCircuitBreaker = () => {
    setCircuitBreakerTripped(false);
    setRecentDeniesInMinute(0);
    setStatusBanner("ENCLAVE_REARMED", "Circuit breaker reset. Enclave co-signing restored.", "allow");
  };

  const simulateIntent = (type: "allow" | "deny" | "hold") => {
    if (type === "allow") {
      if (circuitBreakerTripped) {
        setStatusBanner("BREAKER_LOCKED", "Circuit breaker is tripped. Reset & Re-Arm Enclave before signing.", "deny");
        return;
      }
      setAllowedCount((c) => c + 1);
      setComputeUnits((u) => u + 120);
      setHourlySpendUsd((s) => Math.min(hourlyBudgetUsd, +(s + 14.2).toFixed(2)));
      setAuditLogs((prev) => [
        {
          ts: new Date().toISOString().replace("T", " ").slice(0, 23),
          hash: "0x4a" + Math.floor(10 + Math.random() * 89) + "...c901",
          contract: "0x88B1...90E2 (NVDA)",
          method: "swapExactTokensForTokens",
          gas: "0.00019 ETH ($0.48)",
          state: "ALLOW",
          reason: "Co-signed by Enclave (PCR0 verified)",
        },
        ...prev,
      ]);
      setStatusBanner("TX_ALLOWED", "Enclave verified & co-signed NVDA swap UserOp (+1 ALLOW).", "allow");
    } else if (type === "deny") {
      setDeniedCount((c) => c + 1);
      setComputeUnits((u) => u + 85);
      setRecentDeniesInMinute((d) => {
        const next = d + 1;
        if (next >= breakerMaxDenies) setCircuitBreakerTripped(true);
        return next;
      });
      setAuditLogs((prev) => [
        {
          ts: new Date().toISOString().replace("T", " ").slice(0, 23),
          hash: "0x9f1a...88c2",
          contract: "0x88B1...90E2 (NVDA)",
          method: "swapExactTokensForTokens",
          gas: "0.00000 ETH ($0.00)",
          state: "DENY",
          reason: `Reason: Rule_04_Loop_Detected (Duplicate hash < ${cooldownSeconds}s)`,
        },
        ...prev,
      ]);
      setStatusBanner("TX_DENIED", "Dropped duplicate calldata hash and returned EVM revert to halt agent loop.", "deny");
    } else {
      const newId = "HP-" + Math.floor(9044 + Math.random() * 900);
      setHoldingPen((prev) => [
        {
          id: newId,
          agentId: "swarm-alpha-07",
          asset: "0x31C4...77B9 (AAPL)",
          notionalUsd: 15200.0,
          ruleId: "RULE_09_HUMAN_THRESHOLD_EXCEEDED",
          decodedFn: "swapExactTokensForTokens(uint256 amountIn: 15200000000, address tokenOut: 0x31C4...77B9 [AAPL])",
          rawCalldata: "0x38ed17390000000000000000000000000000000000000000000000000000000389fd980000000000000000000000000031c49012a8f7b9",
          reasoning: '"Executing $15,200 AAPL token arbitrage across Robinhood Chain AMM."',
          gasCost: "0.00022 ETH ($0.55)",
          status: "PENDING",
        },
        ...prev,
      ]);
      setAuditLogs((prev) => [
        {
          ts: new Date().toISOString().replace("T", " ").slice(0, 23),
          hash: "0x8c21..." + newId.slice(3),
          contract: "0x31C4...77B9 (AAPL)",
          method: "swapExactTokensForTokens",
          gas: "0.00022 ETH ($0.55)",
          state: "REQUIRES_HUMAN_SIGNATURE",
          reason: "Reason: Rule_09_Human_Threshold_Exceeded ($15,200)",
        },
        ...prev,
      ]);
      setStatusBanner("TX_HELD", `Queued ${newId} ($15,200 AAPL) in Holding Pen for hardware wallet signature.`, "override");
    }
  };

  return (
    <EnclaveContext.Provider
      value={{
        walletAddress,
        walletProvider,
        isWalletModalOpen,
        setWalletModalOpen,
        connectWallet,
        billingTier,
        setBillingTier,
        blockHeight,
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
        statusBanner,
        setStatusBanner,
      }}
    >
      {children}
    </EnclaveContext.Provider>
  );
}

export function useEnclave() {
  const ctx = useContext(EnclaveContext);
  if (!ctx) throw new Error("useEnclave must be used within EnclaveProvider");
  return ctx;
}
