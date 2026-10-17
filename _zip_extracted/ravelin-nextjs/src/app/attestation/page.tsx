"use client";

import React, { useState } from "react";

export default function AttestationPage() {
  const [tampered, setTampered] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="font-mono text-xs text-emerald">[ ENCLAVE ATTESTATION ]</div>
          <h1 className="text-3xl font-bold text-white">AWS Nitro Cryptographic Verification</h1>
          <p className="text-sm text-neutral-400">
            Platform Configuration Registers (PCRs) prove the exact Rust code running inside the enclave.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTampered(false)}
            className="px-4 py-2 rounded-lg bg-emerald text-black text-xs font-mono font-semibold"
          >
            Verify Quote
          </button>
          <button
            type="button"
            onClick={() => setTampered(true)}
            className="px-4 py-2 rounded-lg bg-obsidian border border-crimson text-crimson text-xs font-mono font-semibold"
          >
            Test Tamper Alert
          </button>
        </div>
      </div>

      <div className="bg-obsidian border border-white/10 rounded-xl p-6 space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-neutral-400">ATTESTATION STATUS</span>
          <span className={tampered ? "text-crimson font-bold" : "text-allow font-bold"}>
            {tampered ? "INVALID_PCR2_HASH (REJECTED ONCHAIN)" : "VERIFIED_BY_SMART_ACCOUNT"}
          </span>
        </div>

        <div className="p-4 rounded-lg bg-black border border-white/10 space-y-1">
          <div className="text-neutral-500">PCR0 (Enclave Image SHA-384)</div>
          <div className="text-white break-all">8f9d2c4e7b1a093f6d5c8b2e4a1f0c9d3e7b6a5f4c2d1e0b9a8f7e6d5c4b3a21</div>
        </div>

        <div className="p-4 rounded-lg bg-black border border-white/10 space-y-1">
          <div className="text-neutral-500">PCR2 (Rust Evaluator Binary SHA-384)</div>
          <div className={tampered ? "text-crimson break-all" : "text-emerald break-all"}>
            {tampered
              ? "ff00dead12d84b65e1098c7a6f5d4e3b2c1a09f8e7d6c5b4a3f2e1d0c9b8dead"
              : "c7e03f9a12d84b65e1098c7a6f5d4e3b2c1a09f8e7d6c5b4a3f2e1d0c9b8a765"}
          </div>
        </div>
      </div>
    </div>
  );
}
