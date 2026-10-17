"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<"wallet" | "curl" | "ts" | "py" | "searcher">("wallet");
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2500);
  };

  const codeSnippets = {
    wallet: `Network Name: Robinhood Chain (Ravelin Private RPC)
New RPC URL:  https://rpc.ravelin.network
Chain ID:     4663
Currency:     ETH
Block Exp:    https://explorer.robinhoodchain.io`,

    curl: `# Send a private, pre-simulated transaction via Ravelin Gateway
curl -X POST https://rpc.ravelin.network \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_sendRawTransaction",
    "params": ["0x02f8730182..."],
    "id": 1
  }'`,

    ts: `import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

// 4-Line Ravelin Private RPC & 90% Backrun Rebate Wrapper
export const client = createWalletClient({
  account: privateKeyToAccount(process.env.PRIVATE_KEY as \`0x\${string}\`),
  transport: http('https://rpc.ravelin.network'),
})`,

    py: `from web3 import Web3
from web3.middleware import construct_sign_and_send_raw_middleware

# 4-Line Python & LangChain Agent Integration
w3 = Web3(Web3.HTTPProvider('https://rpc.ravelin.network'))
assert w3.is_connected()
print(f"Connected to Robinhood Chain! Block: {w3.eth.block_number}")`,

    searcher: `// Connect to the 200 ms Dutch backrun auction stream
const ws = new WebSocket('wss://rpc.ravelin.network/stream');

ws.on('message', (data) => {
  const opportunity = JSON.parse(data.toString());
  console.log('Arb backrun candidate detected:', opportunity.txHash);
  // Submit bundle: 90% clearing price returned to originating user
});`,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800">
          ● Quickstart Docs &amp; Integration Guide
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Connect Your Wallet or Integrate in 4 Lines of Code
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Zero complex infrastructure migrations. Simply swap your RPC endpoint to Ravelin to instantly gain hardware pre-simulation, loop protection, and 90% backrun rebates on Robinhood Chain (ID 4663).
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4 text-xs font-semibold">
        {[
          { id: "wallet", label: "1. Add to Wallet" },
          { id: "curl", label: "2. curl / HTTP" },
          { id: "ts", label: "3. TypeScript / Viem" },
          { id: "py", label: "4. Python / Web3.py" },
          { id: "searcher", label: "5. Searcher Backrun Stream" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === tab.id
                ? "blue-pill-gradient text-white shadow-sm font-bold"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Code Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span className="text-xs font-mono text-slate-400 ml-2">
              {activeTab === "wallet"
                ? "MetaMask / Rabby / WalletConnect RPC Parameters"
                : activeTab === "curl"
                ? "terminal_curl.sh"
                : activeTab === "ts"
                ? "ravelinClient.ts"
                : activeTab === "py"
                ? "agent_wallet.py"
                : "searcher_backrun_ws.ts"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => copyToClipboard(codeSnippets[activeTab], activeTab)}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono font-semibold transition-colors text-slate-200"
          >
            {copied === activeTab ? "Copied ✓" : "Copy Code"}
          </button>
        </div>

        <pre className="font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed p-2">
          {codeSnippets[activeTab]}
        </pre>
      </div>

      {/* 3 Quick Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2 shadow-sm">
          <div className="text-xs font-mono font-bold text-blue-700">0 Revert Penalties</div>
          <p className="text-slate-600 text-xs leading-relaxed">
            Transactions simulated in the enclave never pay sequencer gas fees if they would revert due to slippage or pool depletion.
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2 shadow-sm">
          <div className="text-xs font-mono font-bold text-blue-700">90% Value Recovery</div>
          <p className="text-slate-600 text-xs leading-relaxed">
            Searchers pay into a smart contract vault; 90% is streamed automatically back to the originating address.
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2 shadow-sm">
          <div className="text-xs font-mono font-bold text-blue-700">Zero Public Mempool</div>
          <p className="text-slate-600 text-xs leading-relaxed">
            Calldata is held in hardware RAM inside the AWS Nitro enclave until included directly into the sequencer&apos;s block batch.
          </p>
        </div>
      </div>
    </div>
  );
}
