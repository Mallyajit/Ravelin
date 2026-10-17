# Ravelin Network (`ravelin.network`) — White & Royal Blue Edition (Next.js 14)

A clean, investor-friendly, multi-page **Next.js 14 (App Router, TypeScript, Tailwind CSS)** application modeled on [https://ordofi.network/](https://ordofi.network/) for **Robinhood Chain (Chain ID: 4663)**.

Designed with a **crisp White primary background (`#FFFFFF`)**, **Royal & Ocean Blue Gradient boxes (`#1E3A8A` → `#2563EB` → `#0284C7`)**, high-contrast slate typography, and **practical interactive tools with zero range sliders** (using exact numeric inputs, `+/-` steppers, and preset pill buttons).

---

## Quick Setup for Gemini Copilot in Antigravity IDE

```bash
npm install
cp .env.example .env.local
npm run build
npm run dev
```

---

## Multi-Page Architecture (`src/app/`)

1. **`/` (`src/app/page.tsx`) — Overview & Investor Trust Hub**
   - **Blue Gradient Hero Box ("Region: the sequencer")**: Co-located AWS Nitro node (`1 ms` gateway response, `100 ms` blocks, 100% WASM state replay).
   - **3 Visual Step Cards**: `◎ Private by default`, `⟲ Simulated first ($0 failed gas)`, `↺ Paid back (90% rebate)`.
   - **Measured, Not Claimed**: 6 verifiable on-chain scorecards (`$7,473,107` delivered privately, `218,049` transactions, `$201,591` MEV & loop drains prevented, `90%` rebate share, `1,504` active wallets & searchers, `$18,217.08` protocol revenue).
2. **`/tools` (`src/app/tools/page.tsx`) — Practical Interactive Workbench (No Sliders)**
   - **Tool 1: 4-Stage Hardware Pipeline Simulator**: Test `NVDA/USDC`, `AAPL/USDC`, or `TSLA/USDC` swaps, AI retry loops, and `>$10k` Holding Pen orders with exact dollar inputs and preset pills.
   - **Tool 2: Precision Firewall Policy Configurator (Zero Sliders)**: Set exact Hourly Spend Cap (`$100`–`$5,000/hr`), Duplicate Loop Cooldown (`10s`–`300s`), and Holding Pen Threshold (`$2,500`–`$25,000`) using numeric inputs, `+/-` steppers, and preset pills.
   - **Tool 3: Investor 90% Backrun Rebate & Gas Savings Calculator** + **Holding Pen Approval Queue**.
3. **`/compare` (`src/app/compare/page.tsx`) — Live WASM State Assertion & Latency Check**
4. **`/revenue` (`src/app/revenue/page.tsx`) & `/api/revenue` (`src/app/api/revenue/route.ts`) — `$RVLN` Open-Market Buyback Explorer**
5. **`/platform` (`src/app/platform/page.tsx`) — 6 Ecosystem Modules & Transparent Pricing (`Free`, `Builder`, `Pro`, `Dedicated`)**
6. **`/docs` (`src/app/docs/page.tsx`) — Wallet Setup, `curl`/`wscat`, TypeScript/Python SDK & Searcher Docs**
