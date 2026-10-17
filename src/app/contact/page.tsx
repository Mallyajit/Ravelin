"use client";

import React, { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 space-y-8">
      <div className="space-y-2">
        <div className="font-mono text-xs text-emerald">[ CONTACT ]</div>
        <h1 className="text-3xl font-bold text-white">Build safer execution with Ravelin</h1>
        <p className="text-sm text-neutral-400">
          Whether you are securing an autonomous trading agent or provisioning a dedicated enclave on Robinhood Chain, we would love to hear from you.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
        className="bg-obsidian border border-white/10 rounded-xl p-6 space-y-4 text-sm"
      >
        <div>
          <label className="block text-xs text-neutral-400 mb-1">Name</label>
          <input
            type="text"
            required
            placeholder="Your name"
            className="w-full rounded-lg bg-black border border-white/15 px-3.5 py-2.5 text-white focus:border-emerald focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-neutral-400 mb-1">Email</label>
          <input
            type="email"
            required
            placeholder="you@company.com"
            className="w-full rounded-lg bg-black border border-white/15 px-3.5 py-2.5 text-white focus:border-emerald focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-neutral-400 mb-1">How can we help?</label>
          <textarea
            rows={4}
            required
            placeholder="Tell us about your AI agent architecture on Robinhood Chain..."
            className="w-full rounded-lg bg-black border border-white/15 px-3.5 py-2.5 text-white focus:border-emerald focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-crimson text-white font-medium hover:opacity-90 transition-opacity"
        >
          {sent ? "Message Sent ✓" : "Submit"}
        </button>
      </form>
    </div>
  );
}
