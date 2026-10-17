"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const links = [
    { href: "/", label: "Overview" },
    { href: "/compare", label: "Validator (/compare)" },
    { href: "/revenue", label: "$RVLN Buybacks" },
    { href: "/docs", label: "Docs" },
    { href: "/pricing", label: "Pricing" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-black/90 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-sm bg-amber inline-block" />
          <span className="font-semibold text-base tracking-tight text-white">Ravelin</span>
          <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-400 border border-white/10">
            Robinhood Chain · 4663
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={pathname === l.href ? "text-white font-medium" : "text-neutral-400 hover:text-white transition-colors"}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <Link
            href="/app"
            className="px-4 py-2 rounded-lg bg-white text-black text-xs sm:text-sm font-semibold hover:bg-neutral-200 transition-colors"
          >
            Enter the App →
          </Link>
        </div>
      </div>
    </header>
  );
}
