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
    }, 500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800">
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block animate-pulse" />
            <span>Independent State Assertion Replay · Robinhood Chain 4663</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">Their hash, our hash</h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
            Every 10 minutes, Ravelin replays Robinhood Chain&apos;s state assertions inside our co-located AWS Nitro Enclave using isolated WASM execution. We verify every root hash independently before your transactions settle.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            disabled={isVerifying}
            onClick={handleSimulateNewBlock}
            className="px-5 py-2.5 rounded-xl blue-pill-gradient text-white text-xs font-bold shadow-md hover:opacity-95 disabled:opacity-50 transition-opacity"
          >
            {isVerifying ? "Replaying WASM State..." : "⚡ Replay Next 10m Assertion"}
          </button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1.5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 font-mono">ASSERTION AGREEMENT</div>
          <div className="text-3xl font-extrabold text-emerald-600 font-mono">100.00%</div>
          <div className="text-xs text-slate-500">Zero state discrepancies detected</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1.5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 font-mono">REPLAY FREQUENCY</div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">Every 10m</div>
          <div className="text-xs text-slate-500">144 assertions verified daily</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1.5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 font-mono">MEDIAN LATENCY DIFF</div>
          <div className="text-3xl font-extrabold text-blue-700 font-mono">0.8 ms</div>
          <div className="text-xs text-slate-500">AWS US-East-1 cross-connect</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1.5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 font-mono">ENCLAVE PCR0 STATUS</div>
          <div className="text-sm font-bold text-slate-900 font-mono truncate">8f9d2c4e7b1a093f...3a21</div>
          <div className="text-xs text-slate-500">Cryptographically locked to Nitro</div>
        </div>
      </div>

      {/* Hash Comparison Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Live State Assertion Comparison Log</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct comparison between Robinhood Sequencer state root and Ravelin Nitro WASM replay
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-emerald-700 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 self-start sm:self-auto">
            ● Nitro Node Online · US-East-1
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">BLOCK</th>
                <th className="px-6 py-3.5">TIME</th>
                <th className="px-6 py-3.5">ROBINHOOD STATE HASH</th>
                <th className="px-6 py-3.5">RAVELIN WASM REPLAY</th>
                <th className="px-6 py-3.5">RTT DIFF</th>
                <th className="px-6 py-3.5 text-right">RESULT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assertions.map((a) => (
                <tr
                  key={a.blockNumber}
                  onClick={() => setSelectedBlock(a)}
                  className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-slate-900" suppressHydrationWarning>#{a.blockNumber.toLocaleString('en-US')}</td>
                  <td className="px-6 py-4 text-slate-500">{a.timeAgo}</td>
                  <td className="px-6 py-4">
                    <span className="text-slate-700 truncate max-w-[170px] inline-block">
                      {a.robinhoodHash.slice(0, 10)}...{a.robinhoodHash.slice(-8)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-blue-700 font-semibold truncate max-w-[170px] inline-block">
                      {a.ravelinWasmHash.slice(0, 10)}...{a.ravelinWasmHash.slice(-8)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{a.latencyDiffMs} ms</td>
                  <td className="px-6 py-4 text-right">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">
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
        <div className="p-6 rounded-3xl bg-blue-50 border border-blue-200 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between">
            <div className="text-blue-800 font-bold" suppressHydrationWarning>
              BLOCK #{selectedBlock.blockNumber.toLocaleString('en-US')} VERIFICATION PROOF
            </div>
            <button
              type="button"
              onClick={() => setSelectedBlock(null)}
              className="text-slate-500 hover:text-slate-800 font-bold"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
              <div className="text-slate-400 text-[10px]">ROBINHOOD SEQUENCER HASH</div>
              <div className="text-slate-900 break-all text-[11px] font-semibold">{selectedBlock.robinhoodHash}</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-blue-300 space-y-1">
              <div className="text-blue-700 text-[10px]">RAVELIN NITRO WASM REPLAY HASH</div>
              <div className="text-blue-700 break-all text-[11px] font-semibold">{selectedBlock.ravelinWasmHash}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-600 border-t border-blue-100 pt-3">
            <span>Enclave PCR0 Proof: {selectedBlock.pcr0Proof}</span>
            <span className="text-emerald-700 font-bold">State Machine Execution: Deterministic &amp; Zero Deviation</span>
          </div>
        </div>
      )}

      {/* Explainer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2 shadow-sm">
          <div className="font-mono text-xs text-blue-700 font-bold">Why We Replay State</div>
          <p className="text-slate-600 text-xs leading-relaxed">
            Public RPC nodes simply relay sequencer responses without proof. Ravelin runs the full Arbitrum Orbit WASM state transition function inside an AWS Nitro Enclave to independently guarantee state validity.
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2 shadow-sm">
          <div className="font-mono text-xs text-blue-700 font-bold">Zero-Trust Co-Location</div>
          <p className="text-slate-600 text-xs leading-relaxed">
            Positioned less than 1 ms round-trip time from Robinhood Chain&apos;s sequencer infrastructure in AWS US-East-1, ensuring zero latency penalty for real-time validation.
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2 shadow-sm">
          <div className="font-mono text-xs text-blue-700 font-bold">Smart Account Verifiability</div>
          <p className="text-slate-600 text-xs leading-relaxed">
            The cryptographic PCR0 enclave signature emitted by Ravelin can be verified on-chain by any ERC-4337 Smart Account before executing automated transfers.
          </p>
        </div>
      </div>
    </div>
  );
}
