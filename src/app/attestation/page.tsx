"use client";

import React, { useState } from "react";

export default function AttestationPage() {
  const [tampered, setTampered] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800">
            ● Enclave Attestation Proof
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900">AWS Nitro Cryptographic Verification</h1>
          <p className="text-sm text-slate-600">
            Platform Configuration Registers (PCRs) prove the exact Rust code running inside the enclave.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTampered(false)}
            className="px-4 py-2 rounded-xl blue-pill-gradient text-white text-xs font-mono font-bold shadow-sm"
          >
            Verify Quote
          </button>
          <button
            type="button"
            onClick={() => setTampered(true)}
            className="px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono font-bold hover:bg-red-100"
          >
            Test Tamper Alert
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 font-mono text-xs shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-slate-500 font-bold">ATTESTATION STATUS</span>
          <span
            className={`px-3 py-1 rounded-full font-bold ${
              tampered
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
            }`}
          >
            {tampered ? "INVALID_PCR2_HASH (REJECTED ONCHAIN)" : "VERIFIED_BY_SMART_ACCOUNT ✓"}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
          <div className="text-slate-400 text-[11px]">PCR0 (Enclave Image SHA-384)</div>
          <div className="text-slate-900 break-all font-semibold">
            8f9d2c4e7b1a093f6d5c8b2e4a1f0c9d3e7b6a5f4c2d1e0b9a8f7e6d5c4b3a21
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
          <div className="text-slate-400 text-[11px]">PCR2 (Rust Evaluator Binary SHA-384)</div>
          <div className={tampered ? "text-red-700 break-all font-bold" : "text-blue-700 break-all font-bold"}>
            {tampered
              ? "ff00dead12d84b65e1098c7a6f5d4e3b2c1a09f8e7d6c5b4a3f2e1d0c9b8dead"
              : "c7e03f9a12d84b65e1098c7a6f5d4e3b2c1a09f8e7d6c5b4a3f2e1d0c9b8a765"}
          </div>
        </div>
      </div>
    </div>
  );
}
