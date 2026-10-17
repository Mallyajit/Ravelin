import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-10 px-4 sm:px-6 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg blue-gradient-box text-white font-bold flex items-center justify-center">R</span>
          <span className="font-bold text-slate-800">Ravelin Network</span>
          <span>· Private RPC, 90% Rebates &amp; AI Firewall on Robinhood Chain (ID 4663)</span>
        </div>
        <div className="flex flex-wrap gap-4 font-semibold text-slate-600">
          <Link href="/" className="hover:text-blue-700">Overview</Link>
          <Link href="/tools" className="hover:text-blue-700">Interactive Tools</Link>
          <Link href="/compare" className="hover:text-blue-700">Validator (/compare)</Link>
          <Link href="/revenue" className="hover:text-blue-700">$RVLN Buybacks</Link>
          <Link href="/platform" className="hover:text-blue-700">Platform &amp; Pricing</Link>
          <Link href="/docs" className="hover:text-blue-700">Docs</Link>
        </div>
      </div>
    </footer>
  );
}
