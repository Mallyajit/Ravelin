import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-20 pb-20 pt-10 px-4 sm:px-6 max-w-6xl mx-auto">
      <section className="space-y-8">
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800">
            ● Robinhood Chain Mainnet (ID 4663) · 100 ms Blocks
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
            Trade &amp; Run AI Agents on Robinhood Chain Without Losing Gas or Value.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Ravelin places a dedicated hardware node right next to the Robinhood Chain sequencer. Every transaction is{" "}
            <strong className="text-slate-900">private by default</strong>,{" "}
            <strong className="text-slate-900">simulated before it costs gas</strong>, and returns{" "}
            <strong className="text-blue-700">90% of any backrun profit</strong> directly to your wallet.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="/tools" className="px-6 py-3 rounded-xl blue-pill-gradient text-white text-sm font-semibold shadow-md">
              Try Interactive Simulator &amp; Tools →
            </Link>
            <Link href="/compare" className="px-5 py-3 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-sm font-semibold">
              See Live State Proofs (/compare)
            </Link>
          </div>
        </div>

        <div className="blue-gradient-box rounded-3xl p-6 sm:p-10 text-white shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="text-xs font-mono uppercase text-blue-200">REGION: THE SEQUENCER</div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              One node, in the same place as the chain, close to the sequencer, close to every block.
            </h2>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
              Every request is answered from our own hardware-isolated AWS Nitro node—not a shared upstream.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/10 border border-white/20 rounded-2xl p-5">
                <div className="text-3xl font-extrabold font-mono">1 ms</div>
                <div className="text-sm font-semibold text-blue-100 mt-1">Median gateway response</div>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-2xl p-5">
                <div className="text-3xl font-extrabold font-mono text-emerald-300">100%</div>
                <div className="text-sm font-semibold text-blue-100 mt-1">WASM state replay verified</div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 bg-white/10 border border-white/20 rounded-2xl p-6 text-center space-y-2">
            <div className="text-xs font-mono text-emerald-200">● CO-LOCATED IN US-EAST (0.8 ms RTT)</div>
            <div className="text-lg font-bold">Robinhood Sequencer ⇄ Ravelin Nitro Node</div>
            <p className="text-xs text-blue-100">Blocks validated every 10 minutes via WASM state assertion replay.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
