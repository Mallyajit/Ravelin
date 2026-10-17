"use client";

import React, { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="space-y-2">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800">
          ● Developer &amp; Institutional Integration
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900">Build Safer Execution with Ravelin</h1>
        <p className="text-sm text-slate-600">
          Whether you are securing an autonomous trading agent or provisioning a dedicated enclave on Robinhood Chain, we would love to hear from you.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
        className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 text-sm shadow-sm"
      >
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Name</label>
          <input
            type="text"
            required
            placeholder="Your name"
            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
          <input
            type="email"
            required
            placeholder="you@company.com"
            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">How can we help?</label>
          <textarea
            rows={4}
            required
            placeholder="Tell us about your trading swarm or volume on Robinhood Chain..."
            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 rounded-xl blue-pill-gradient text-white font-bold text-sm shadow-md hover:opacity-95 transition-opacity"
        >
          {sent ? "Message Sent ✓" : "Submit Request"}
        </button>
      </form>
    </div>
  );
}
