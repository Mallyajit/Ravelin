import React from "react";

export default function DocsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 space-y-8">
      <div className="space-y-2">
        <div className="font-mono text-xs text-emerald uppercase">Documentation</div>
        <h1 className="text-3xl font-bold text-white">Ravelin Gateway, Auction &amp; AI Firewall Reference</h1>
        <p className="text-sm text-neutral-400">
          Everything you need to connect a wallet, trading terminal, or autonomous AI agent on Robinhood Chain (Chain ID 4663).
        </p>
      </div>
      <div className="bg-obsidian border border-white/10 rounded-xl p-6 space-y-4 font-mono text-xs text-neutral-200">
        <div className="text-emerald font-bold">1. Private RPC Endpoint</div>
        <pre className="p-4 rounded-lg bg-black border border-white/10 overflow-x-auto">
{`Network Name: Robinhood Chain (Ravelin Protected)
RPC URL:      https://rpc.ravelin.network
WebSocket:    wss://rpc.ravelin.network
Chain ID:     4663
Currency:     ETH`}
        </pre>
      </div>
    </div>
  );
}
