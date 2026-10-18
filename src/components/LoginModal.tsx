"use client";

import React, { useState } from "react";
import { useEnclave } from "@/context/EnclaveContext";

export function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, login } = useEnclave();
  const [email, setEmail] = useState("alex.chen@quantumfund.io");
  const [wallet, setWallet] = useState("0x71C9a84F2b9011e889A2");

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, wallet);
  };

  return (
    <div
      id="loginModal"
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-display text-xl font-bold text-slate-900">Sign In</h3>
            <p className="text-xs text-slate-500">Connect your operator identity &amp; Robinhood Chain wallet</p>
          </div>
          <button
            id="closeLoginModalBtn"
            type="button"
            aria-label="Close"
            onClick={closeLoginModal}
            className="cross-icon-btn"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="side-field-row">
            <label htmlFor="loginEmailInput" className="side-field-label">Work Email</label>
            <input
              id="loginEmailInput"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="side-field-input side-field-input-wide"
              required
            />
          </div>
          <div className="side-field-row">
            <label htmlFor="loginWalletInput" className="side-field-label">Wallet</label>
            <input
              id="loginWalletInput"
              type="text"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              className="side-field-input side-field-input-wide font-mono"
              required
            />
          </div>
          <button id="submitLoginBtn" type="submit" className="btn-primary-rounded w-full">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
