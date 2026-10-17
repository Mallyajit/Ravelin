export interface PolicyRule {
  id: string;
  name: string;
  contract: string;
  condition: string;
  action: "ALLOW" | "DENY" | "HOLD";
}

export interface QueueItem {
  id: string;
  agent: string;
  asset: string;
  amountUsd: number;
  method: string;
  calldata: string;
  reason: string;
  gas: string;
}

export interface LogEntry {
  time: string;
  hash: string;
  target: string;
  method: string;
  gas: string;
  status: "ALLOW" | "DENY" | "HOLD";
  note: string;
}

export const INITIAL_RULES: PolicyRule[] = [
  {
    id: "RULE-01",
    name: "USD.AI Transfer Cap",
    contract: "0x4F92...11A0 (USD.AI)",
    condition: "Value > 1,000 ETH",
    action: "DENY",
  },
  {
    id: "RULE-02",
    name: "Duplicate Calldata Cooldown",
    contract: "All Contracts",
    condition: "Identical hash < 60s",
    action: "DENY",
  },
  {
    id: "RULE-03",
    name: "High-Value Equity Trade",
    contract: "0x31C4...77B9 (AAPL)",
    condition: "Notional > $10,000",
    action: "HOLD",
  },
];

export const INITIAL_QUEUE: QueueItem[] = [
  {
    id: "HP-9041",
    agent: "rwa-rebalancer-01",
    asset: "AAPL Token (0x31C4...77B9)",
    amountUsd: 18450,
    method: "swapExactTokensForTokens(18450 USDC, AAPL)",
    calldata: "0x38ed173900000000000000000000000000000000044b97f20031c49012a8f7b9",
    reason: "Order notional ($18,450) exceeds $10,000 human approval threshold.",
    gas: "0.00023 ETH ($0.58)",
  },
  {
    id: "HP-9042",
    agent: "nvda-liquidity-bot",
    asset: "NVDA Token (0x88B1...90E2)",
    amountUsd: 12800,
    method: "mintRWA(0x71C9...89A2, 12800 USDC)",
    calldata: "0x40c10f1900000000000000000000000071c95911e9a5d330f4d621842ec243ee",
    reason: "Order notional ($12,800) exceeds $10,000 human approval threshold.",
    gas: "0.00021 ETH ($0.52)",
  },
];

export const INITIAL_LOGS: LogEntry[] = [
  {
    time: "17:34:12",
    hash: "0x9f1a...88c2",
    target: "0x88B1...90E2 (NVDA)",
    method: "swapExactTokensForTokens",
    gas: "$0.00",
    status: "DENY",
    note: "Rule_04_Loop_Detected (Duplicate < 60s)",
  },
  {
    time: "17:34:11",
    hash: "0x9f1a...88c2",
    target: "0x88B1...90E2 (NVDA)",
    method: "swapExactTokensForTokens",
    gas: "$0.48",
    status: "ALLOW",
    note: "Co-signed by Enclave (PCR0 verified)",
  },
  {
    time: "17:33:54",
    hash: "0x3d09...11e7",
    target: "0xDEAD...9999 (Unlisted)",
    method: "approve",
    gas: "$0.00",
    status: "DENY",
    note: "Target_Contract_Not_Whitelisted",
  },
  {
    time: "17:33:20",
    hash: "0x7b44...9041",
    target: "0x31C4...77B9 (AAPL)",
    method: "swapExactTokensForTokens",
    gas: "$0.58",
    status: "HOLD",
    note: "Held for human operator signature ($18,450)",
  },
];
