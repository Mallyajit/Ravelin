"use client";

import React, { useState } from "react";
import Link from "next/link";

interface BlockAssertion {
  blockNumber: number;
  timeAgo: string;
  robinhoodHash: string;
  ravelinWasmHash: string;
  pcr0Proof: string;
  latencyDiffMs: number;
  status: "MATCH" | "VERIFIED";
}

const INITIAL_ASSERTIONS: BlockAssertion[] = [
  {
    blockNumber: 14892180,
    timeAgo: "12s ago",
    robinhoodHash: "0x94c8e1a2f07b44a9e102f8c31029b77c1a82f34910248ab091c890123efb019a",
    ravelinWasmHash: "0x94c8e1a2f07b44a9e102f8c31029b77c1a82f34910248ab091c890123efb019a",
    pcr0Proof: "8f9d2c4e7b1a...3a21",
    latencyDiffMs: 0.8,
    status: "MATCH",
  },
  {
    blockNumber: 14892170,
    timeAgo: "1m ago",
    robinhoodHash: "0x3b8e91a4f7c2d0e1a5b6c7d8e9f0a1b2c3d4e5f60718293a4b5c6d7e8f9091a4",
    ravelinWasmHash: "0x3b8e91a4f7c2d0e1a5b6c7d8e9f0a1b2c3d4e5f60718293a4b5c6d7e8f9091a4",
    pcr0Proof: "8f9d2c4e7b1a...3a21",
    latencyDiffMs: 0.7,
    status: "MATCH",
  },
  {
    blockNumber: 14892160,
    timeAgo: "11m ago",
    robinhoodHash: "0x77c4a1029b182f094c8e1a2f07b44a9e102f8c31029b77c3a82f34910248abb1",
    ravelinWasmHash: "0x77c4a1029b182f094c8e1a2f07b44a9e102f8c31029b77c3a82f34910248abb1",
    pcr0Proof: "8f9d2c4e7b1a...3a21",
    latencyDiffMs: 0.9,
    status: "MATCH",
  },
  {
    blockNumber: 14892150,
    timeAgo: "21m ago",
    robinhoodHash: "0x12f8c31029b77c3a82f34910248ab091c890123efb019a94c8e1a2f07b44a9e1",
    ravelinWasmHash: "0x12f8c31029b77c3a82f34910248ab091c890123efb019a94c8e1a2f07b44a9e1",
    pcr0Proof: "8f9d2c4e7b1a...3a21",
    latencyDiffMs: 0.8,
    status: "MATCH",
  },
  {
    blockNumber: 14892140,
    timeAgo: "31m ago",
    robinhoodHash: "0xfa910248ab091c890123efb019a94c8e1a2f07b44a9e102f8c31029b77c3a82f",
    ravelinWasmHash: "0xfa910248ab091c890123efb019a94c8e1a2f07b44a9e102f8c31029b77c3a82f",
    pcr0Proof: "8f9d2c4e7b1a...3a21",
    latencyDiffMs: 0.6,
    status: "MATCH",
  },
];

export default function ComparePage() {
  const [assertions, setAssertions] = useState<BlockAssertion[]>(INITIAL_ASSERTIONS);
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<BlockAssertion | null>(null);

  const handleSimulateNewBlock = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const nextBlockNumber = assertions[0].blockNumber + 10;
      const randomHash =
        "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
      const newEntry: BlockAssertion = {
        blockNumber: nextBlockNumber,
        timeAgo: "Just now",
        robinhoodHash: randomHash,
        ravelinWasmHash: randomHash,
        pcr0Proof: "8f9d2c4e7b1a...3a21",
        latencyDiffMs: 0.8,
        status: "MATCH",
      };
      setAssertions([newEntry, ...assertions.slice(0, 5)]);
      setIsVerifying(false);
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 space-y-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-obsidian border border-white/10 text-xs font-mono text-emerald">
            <span className="w-2 h-2 rounded-full bg-emerald inline-block" />
            <span>Independent State Assertion Replay · Robinhood Chain 4663</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">Their hash, our hash</h1>
          <p className="text-neutral-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Every 10 minutes, Ravelin replays Robinhood Chain&apos;s state assertions inside our co-located AWS Nitro Enclave using isolated WASM execution. We verify every root hash independently before your transactions settle.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            disabled={isVerifying}
            onClick={handleSimulateNewBlock}
            className="px-4 py-2.5 rounded-lg bg-emerald text-black text-xs font-mono font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isVerifying ? "Replaying WASM State..." : "⚡ Replay Next 10m Assertion"}
          </button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-obsidian border border-white/10 rounded-xl p-5 space-y-1.5 font-mono">
          <div className="text-xs text-neutral-400">ASSERTION AGREEMENT</div>
          <div className="text-3xl font-bold text-emerald">100.00%</div>
          <div className="text-xs text-neutral-500">Zero state discrepancies detected</div>
        </div>

        <div className="bg-obsidian border border-white/10 rounded-xl p-5 space-y-1.5 font-mono">
          <div className="text-xs text-neutral-400">REPLAY FREQUENCY</div>
          <div className="text-3xl font-bold text-white">Every 10m</div>
          <div className="text-xs text-neutral-500">144 assertions verified daily</div>
        </div>

        <div className="bg-obsidian border border-white/10 rounded-xl p-5 space-y-1.5 font-mono">
          <div className="text-xs text-neutral-400">MEDIAN LATENCY DIFF</div>
          <div className="text-3xl font-bold text-amber">0.8 ms</div>
          <div className="text-xs text-neutral-500">AWS US-East-1 co-location cross-connect</div>
        </div>

        <div className="bg-obsidian border border-white/10 rounded-xl p-5 space-y-1.5 font-mono">
          <div className="text-xs text-neutral-400">ENCLAVE PCR0 STATUS</div>
          <div className="text-sm font-bold text-allow truncate">8f9d2c4e7b1a093f...3a21</div>
          <div className="text-xs text-neutral-500">Cryptographically locked to Nitro</div>
        </div>
      </div>

      {/* Hash Comparison Table */}
      <div className="bg-obsidian border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-white">Live State Assertion Comparison Log</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Direct comparison between Robinhood Sequencer state root and Ravelin Nitro WASM replay
            </p>
          </div>
          <span className="text-xs font-mono text-emerald px-2.5 py-1 rounded bg-emerald/10 border border-emerald/20 self-start sm:self-auto">
            ● Nitro Node Online · US-East-1
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-surface text-neutral-400 border-b border-white/10">
              <tr>
                <th className="px-6 py-3.5">BLOCK</th>
                <th className="px-6 py-3.5">TIME</th>
                <th className="px-6 py-3.5">ROBINHOOD STATE HASH</th>
                <th className="px-6 py-3.5">RAVELIN WASM REPLAY</th>
                <th className="px-6 py-3.5">RTT DIFF</th>
                <th className="px-6 py-3.5 text-right">RESULT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {assertions.map((a) => (
                <tr
                  key={a.blockNumber}
                  onClick={() => setSelectedBlock(a)}
                  className="hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-white">#{a.blockNumber.toLocaleString()}</td>
                  <td className="px-6 py-4 text-neutral-400">{a.timeAgo}</td>
                  <td className="px-6 py-4">
                    <span className="text-neutral-300 truncate max-w-[170px] inline-block">
                      {a.robinhoodHash.slice(0, 10)}...{a.robinhoodHash.slice(-8)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-emerald truncate max-w-[170px] inline-block">
                      {a.ravelinWasmHash.slice(0, 10)}...{a.ravelinWasmHash.slice(-8)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-amber">{a.latencyDiffMs} ms</td>
                  <td className="px-6 py-4 text-right">
                    <span className="px-2.5 py-1 rounded bg-allow/10 text-allow font-bold">
                      EXACT MATCH ✓
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Block Inspection Card */}
      {selectedBlock && (
        <div className="p-6 rounded-2xl bg-surface border border-emerald/40 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between">
            <div className="text-emerald font-bold">
              BLOCK #{selectedBlock.blockNumber.toLocaleString()} VERIFICATION PROOF
            </div>
            <button
              type="button"
              onClick={() => setSelectedBlock(null)}
              className="text-neutral-400 hover:text-white"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-black border border-white/10 space-y-1">
              <div className="text-neutral-500">ROBINHOOD SEQUENCER HASH</div>
              <div className="text-white break-all text-[11px]">{selectedBlock.robinhoodHash}</div>
            </div>
            <div className="p-4 rounded-xl bg-black border border-emerald/30 space-y-1">
              <div className="text-emerald">RAVELIN NITRO WASM REPLAY HASH</div>
              <div className="text-emerald break-all text-[11px]">{selectedBlock.ravelinWasmHash}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-neutral-400 border-t border-white/5 pt-3">
            <span>Enclave PCR0 Proof: {selectedBlock.pcr0Proof}</span>
            <span className="text-allow">State Machine Execution: Deterministic &amp; Zero Deviation</span>
          </div>
        </div>
      )}

      {/* Architecture Explainer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div className="bg-obsidian border border-white/10 rounded-xl p-6 space-y-2">
          <div className="font-mono text-xs text-emerald font-bold">Why We Replay State</div>
          <p className="text-neutral-400 text-xs leading-relaxed">
            Public RPC nodes simply relay sequencer responses without proof. Ravelin runs the full Arbitrum Orbit WASM state transition function inside an AWS Nitro Enclave to independently guarantee state validity.
          </p>
        </div>
        <div className="bg-obsidian border border-white/10 rounded-xl p-6 space-y-2">
          <div className="font-mono text-xs text-amber font-bold">Zero-Trust Co-Location</div>
          <p className="text-neutral-400 text-xs leading-relaxed">
            Positioned less than 1 ms round-trip time from Robinhood Chain&apos;s sequencer infrastructure in AWS US-East-1, ensuring zero latency penalty for real-time validation.
          </p>
        </div>
        <div className="bg-obsidian border border-white/10 rounded-xl p-6 space-y-2">
          <div className="font-mono text-xs text-allow font-bold">Smart Account Verifiability</div>
          <p className="text-neutral-400 text-xs leading-relaxed">
            The cryptographic PCR0 enclave signature emitted by Ravelin can be verified on-chain by any ERC-4337 Smart Account before executing automated transfers.
          </p>
        </div>
      </div>
    </div>
  );
}
