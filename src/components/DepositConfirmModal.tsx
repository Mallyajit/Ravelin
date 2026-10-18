"use client";

import React, { useState } from "react";
import { useEnclave } from "@/context/EnclaveContext";

export function DepositConfirmModal() {
  const { isDepositModalOpen, closeDepositModal, confirmDeposit } = useEnclave();
  const [amount, setAmount] = useState(250);

  if (!isDepositModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confirmDeposit(Number(amount));
  };

  return (
    <div
      id="depositConfirmModal"
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[11px] font-semibold">
              Security Confirmation
            </span>
            <h3 className="font-display text-xl font-bold text-slate-900 mt-1">
              Top Up Billing Escrow
            </h3>
          </div>
          <button
            id="closeDepositConfirmModalBtn"
            type="button"
            aria-label="Close"
            onClick={closeDepositModal}
            className="cross-icon-btn"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Funds will be transferred from your connected operator wallet directly to the Ravelin Nitro Escrow smart contract on Robinhood Chain (Chain ID 4663).
          </p>

          <div className="side-field-row">
            <label htmlFor="depositAmountInput" className="side-field-label">
              Deposit Amount (USDG)
            </label>
            <input
              id="depositAmountInput"
              type="number"
              min="50"
              max="100000"
              step="50"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="side-field-input font-mono"
              required
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-1.5 text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-400">Source Wallet:</span>
              <span className="font-semibold text-slate-900">0x71C9...89A2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Escrow Contract:</span>
              <span className="font-semibold text-blue-700">0x77A1...39C0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Gas Cost:</span>
              <span className="font-semibold text-emerald-700">~$0.004 USDG</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              id="confirmDepositExecBtn"
              type="submit"
              className="btn-primary-rounded w-full"
            >
              Confirm Deposit (+${amount} USDG)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
