import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-12 px-4 sm:px-6 mt-auto">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div className="col-span-2 md:col-span-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber inline-block" />
            <span className="font-semibold text-white">Ravelin Network</span>
          </div>
          <p className="text-neutral-400 text-xs leading-relaxed">
            Private RPC, revert &amp; AI loop protection, and 90% backrun rebates on Robinhood Chain (Chain ID 4663).
          </p>
        </div>
        <div className="space-y-2">
          <div className="text-white font-medium text-xs uppercase tracking-wider">Platform</div>
          <ul className="space-y-1.5 text-neutral-400 text-xs">
            <li><Link href="/" className="hover:text-white">Overview</Link></li>
            <li><Link href="/compare" className="hover:text-white">State Validator (/compare)</Link></li>
            <li><Link href="/revenue" className="hover:text-white">$RVLN Buybacks (/api/revenue)</Link></li>
            <li><Link href="/pricing" className="hover:text-white">Pricing Plans</Link></li>
          </ul>
        </div>
        <div className="space-y-2">
          <div className="text-white font-medium text-xs uppercase tracking-wider">Developers</div>
          <ul className="space-y-1.5 text-neutral-400 text-xs">
            <li><Link href="/docs" className="hover:text-white">Gateway &amp; SDK Docs</Link></li>
            <li><Link href="/app" className="hover:text-white">Enter the App Console</Link></li>
            <li><Link href="/api/revenue" className="hover:text-white">JSON Revenue Endpoint</Link></li>
          </ul>
        </div>
        <div className="space-y-2">
          <div className="text-white font-medium text-xs uppercase tracking-wider">On-Chain Anchors</div>
          <ul className="space-y-1.5 text-neutral-400 text-xs font-mono">
            <li>RPC: rpc.ravelin.network</li>
            <li>$RVLN: 0xfe2f…b167</li>
            <li className="text-allow">● 1ms Gateway Online</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
