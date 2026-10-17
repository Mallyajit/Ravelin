"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const links = [
    { href: "/", label: "1. Overview" },
    { href: "/tools", label: "2. Interactive Tools" },
    { href: "/compare", label: "3. Validator (/compare)" },
    { href: "/revenue", label: "4. $RVLN Buybacks" },
    { href: "/platform", label: "5. Platform & Pricing" },
    { href: "/docs", label: "6. Quickstart Docs" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl blue-gradient-box flex items-center justify-center text-white font-bold text-sm shadow-sm">
            R
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-slate-900">Ravelin</span>
            <span className="hidden sm:inline-block ml-2 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Robinhood Chain · 4663
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                pathname === l.href
                  ? "px-3.5 py-2 rounded-lg bg-white text-blue-700 shadow-sm"
                  : "px-3.5 py-2 rounded-lg text-slate-600 hover:text-slate-900"
              }
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/tools"
          className="px-4 py-2 rounded-xl blue-pill-gradient text-white text-xs font-semibold shadow-sm"
        >
          Open Tools →
        </Link>
      </div>
    </header>
  );
}
