"use client";

import React from "react";
import { useEnclave } from "@/context/EnclaveContext";

export function RazorpayModal() {
  const { isRazorpayModalOpen, razorpayPlanTitle, closeRazorpayModal, triggerSnackbar, setActivePlan } = useEnclave();

  if (!isRazorpayModalOpen) return null;

  const handleCheckout = () => {
    const tierName = razorpayPlanTitle.includes("Builder")
      ? "Builder"
      : razorpayPlanTitle.includes("Dedicated")
      ? "Dedicated"
      : "Pro";
    setActivePlan(tierName);
    closeRazorpayModal();
    triggerSnackbar("Razorpay Checkout", `Subscription initiated for ${razorpayPlanTitle}. Active tier set to ${tierName}.`);
  };

  return (
    <div
      id="razorpayModal"
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-display font-bold text-sm flex items-center justify-center">
              R
            </div>
            <div>
              <h3 id="razorpayPlanTitle" className="font-display text-lg font-bold text-slate-900">
                Redirecting to Razorpay
              </h3>
              <p className="text-[11px] font-mono text-blue-600">Secure Subscription Gateway</p>
            </div>
          </div>
          <button
            id="closeRazorpayModalBtn"
            type="button"
            aria-label="Close"
            onClick={closeRazorpayModal}
            className="cross-icon-btn"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Selected Tier</span>
            <span id="razorpayTierBadge" className="font-mono font-bold text-blue-800">
              {razorpayPlanTitle}
            </span>
          </div>
          <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 w-3/4 rounded-full animate-pulse" />
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Initializing Razorpay checkout session for your Ravelin account. Connect your corporate card or Robinhood Chain escrow wallet to activate sub-millisecond enclave ingress.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleCheckout}
            className="btn-primary-rounded w-full"
          >
            Proceed to Secure Checkout →
          </button>
        </div>
      </div>
    </div>
  );
}
