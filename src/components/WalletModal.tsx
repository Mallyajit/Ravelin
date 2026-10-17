"use client";

import React from "react";
import { useEnclave } from "@/context/EnclaveContext";

export function WalletModal() {
  const { isWalletModalOpen, setWalletModalOpen, connectWallet } = useEnclave();
  if (!isWalletModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="card-obsidian max-w-md w-full p-6 space-y-4 border border-hairline">
        <div className="flex items-center justify-between border-b border-hairline pb-3">
          <div>
            <span className="font-mono text-xs font-bold text-white">CONNECT OPERATOR IDENTITY</span>
            <p className="font-mono text-[11px] text-slatedim">
              Auto-configures Robinhood Chain (Chain ID: 4663 • rpc.robinhoodchain.io)
            </p>
          </div>
          <button
            type="button"
            onClick={() => setWalletModalOpen(false)}
            className="px-2 py-1 bg-surface border border-hairline text-xs font-mono text-slatedim hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => connectWallet("Rabby Wallet", "0x71C9...89A2")}
            className="w-full p-3 bg-surface border border-hairline hover:border-emerald flex items-center justify-between text-left"
          >
            <div>
              <div className="text-white font-semibold">Rabby Wallet (EIP-1193)</div>
              <div className="text-slatedim text-[11px]">Hardware Co-Signer &amp; Smart Account Owner</div>
            </div>
            <span className="text-emerald">Connect →</span>
          </button>

          <button
            type="button"
            onClick={() => connectWallet("MetaMask", "0x94F8...6D7E")}
            className="w-full p-3 bg-surface border border-hairline hover:border-emerald flex items-center justify-between text-left"
          >
            <div>
              <div className="text-white font-semibold">MetaMask (EIP-1193)</div>
              <div className="text-slatedim text-[11px]">Standard Web3 Browser Extension</div>
            </div>
            <span className="text-emerald">Connect →</span>
          </button>

          <button
            type="button"
            onClick={() => connectWallet("GitHub OAuth", "github:@devops-core")}
            className="w-full p-3 bg-surface border border-hairline hover:border-neonblue flex items-center justify-between text-left"
          >
            <div>
              <div className="text-white font-semibold">GitHub OAuth (@devops-core)</div>
              <div className="text-slatedim text-[11px]">Read/Write Policy &amp; ClickHouse Telemetry</div>
            </div>
            <span className="text-neonblue">Authorize →</span>
          </button>
        </div>
      </div>
    </div>
  );
}
