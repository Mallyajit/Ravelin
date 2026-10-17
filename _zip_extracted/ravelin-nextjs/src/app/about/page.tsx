import React from "react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-16">
      <div className="space-y-4 max-w-3xl">
        <div className="font-mono text-xs text-emerald">[ ABOUT RAVELIN ]</div>
        <h1 className="text-3xl sm:text-5xl font-bold text-white">Built for deterministic execution</h1>
        <p className="text-base sm:text-lg text-neutral-400 leading-relaxed">
          Ravelin is building the security and verification layer between autonomous AI agents, Smart Accounts, and the Robinhood Chain L2 sequencer (Chain ID 4663).
        </p>
      </div>

      <div className="space-y-6">
        <div className="font-mono text-xs text-crimson">[ VALUES ]</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">What we optimize for</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-obsidian border border-white/10 rounded-xl p-6 space-y-2">
            <h3 className="text-lg font-semibold text-white">Hardware Isolation</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Security should not depend on LLM prompts. Signing keys and policy checks run inside isolated AWS Nitro Enclaves.
            </p>
          </div>
          <div className="bg-obsidian border border-white/10 rounded-xl p-6 space-y-2">
            <h3 className="text-lg font-semibold text-white">Stateful Precision</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Every transaction is evaluated against recent calldata history and real-time Arbitrum L2 + L1 blob gas costs.
            </p>
          </div>
          <div className="bg-obsidian border border-white/10 rounded-xl p-6 space-y-2">
            <h3 className="text-lg font-semibold text-white">Onchain Verifiability</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Critical co-signing and PCR attestation checks are enforced directly onchain by ERC-4337 Smart Accounts.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-obsidian border border-white/10 rounded-xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">Start securing your agent order flow</h3>
          <p className="text-sm text-neutral-400 mt-1">Explore the developer console or read the technical documentation.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/app" className="px-5 py-2.5 rounded-lg bg-crimson text-white text-sm font-medium">
            Enter the App
          </Link>
          <Link href="/docs" className="px-5 py-2.5 rounded-lg bg-surface border border-white/15 text-white text-sm font-medium">
            Read the Docs
          </Link>
        </div>
      </div>
    </div>
  );
}
