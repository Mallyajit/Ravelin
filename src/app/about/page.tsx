import React from "react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div className="space-y-4 max-w-3xl">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800">
          ● About Ravelin Network
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Built for Deterministic Execution on Robinhood Chain
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Ravelin is the deterministic security and backrun value-recovery layer connecting autonomous AI agents, Smart Accounts, and the Robinhood Chain L2 sequencer (Chain ID 4663).
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">What We Optimize For</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">Hardware Isolation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Security should not depend on LLM prompts. Signing keys and policy checks run inside isolated AWS Nitro Enclaves.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">Stateful Precision</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every transaction is evaluated against recent calldata history in RocksDB and real-time Arbitrum L2 + L1 blob gas costs.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">On-Chain Verifiability</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Critical co-signing and PCR attestation checks are enforced directly on-chain by ERC-4337 Smart Accounts.
            </p>
          </div>
        </div>
      </div>

      <div className="blue-gradient-box text-white rounded-3xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md">
        <div>
          <h3 className="text-xl font-bold">Start Securing Your Agent Order Flow</h3>
          <p className="text-xs text-blue-100 mt-1">Explore the interactive tools or read the integration documentation.</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Link href="/tools" className="px-5 py-2.5 rounded-xl bg-white text-blue-900 text-xs font-bold hover:bg-blue-50">
            Open Tools
          </Link>
          <Link href="/docs" className="px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold hover:bg-white/20">
            Read the Docs
          </Link>
        </div>
      </div>
    </div>
  );
}
