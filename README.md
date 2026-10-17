# Ravelin Network (`ravelin.network`) — Private RPC, Backrun Rebates & AI Firewall for Robinhood Chain

A complete, investor-friendly, and builder-ready **Next.js 14 (App Router, TypeScript, Tailwind CSS)** web application and developer console modeled directly after [https://ordofi.network/](https://ordofi.network/) for **Robinhood Chain (Chain ID: 4663)**.

---

## Quick Setup Instructions for Gemini Copilot in Antigravity IDE

If you are **Gemini Copilot inside Antigravity IDE**, run these exact steps in the integrated terminal to install, verify, and launch the project:

```bash
# 1. Install all dependencies
npm install

# 2. Copy the environment configuration
cp .env.example .env.local

# 3. Verify TypeScript & Next.js production build
npm run build

# 4. Start the local development server on http://localhost:3000
npm run dev
```

---

## Included Pages & Routes (All Links Verified)

1. **`/` (`src/app/page.tsx`) — Investor & Builder Home Page (Modeled on `ordofi.network`)**
   - **Region: the sequencer**: Co-located AWS Nitro node next to the Robinhood Chain sequencer (`1 ms` median gateway response, `100 ms` blocks, orange-dot globe graphic, WASM + Nitro PCR0 state replay).
   - **Three Core Pillars**: `◎ Private by default`, `⟲ Simulated first` (refuses reverts & AI retry loops before paying gas), `↺ Paid back` (`90%` of clearing price from 200ms backrun auctions returned to the user).
   - **Measured, not claimed**: 6 live on-chain metric cards (`$7,473,107` delivered privately, `218,049` transactions, `$201,591` MEV & loop drains prevented, `90%` rebate share, `1,504` active agents & searchers, `$18,217.08` protocol revenue) with clickable on-chain verification modals and `RavelinVolumeLog` (`0x88B1…90E2`) attestation.
   - **Revenue buys `$RVLN`**: 100% open-market token buyback breakdown (`430,215 RVLN` bought back across 5 swaps, latest swap `168,291 RVLN` at `0x0deb741e…9988f3`, token contract `0xfe2f…b167`).
   - **One platform for everything that trades here**: 6 linked product modules (`⇄ Ravelin RPC`, `◈ Ravelin Auction`, `✓ Ravelin Validator`, `▤ Ravelin Data`, `≋ AI Firewall & Holding Pen`, `⚡ Agent & Searcher SDK`).
   - **Why teams & investors route through Ravelin**: Side-by-side comparison (`A public endpoint alone` vs. `Shipping with Ravelin`).
   - **Pay only for what you use**: 4 transparent pricing plans (`Free $0 forever`, `Builder $29/30 days`, `Pro $199/30 days [Most picked]`, `Dedicated $999/30 days`) + `Every plan includes` strip.
   - **Built for your stack**: Copyable `curl`, `wscat`, TypeScript (`viem`), and Python (`web3.py`) snippets + 3 role cards (`Wallets & Investors`, `Terminals, AI Swarms & Indexers`, `Searchers`).
2. **`/compare` (`src/app/compare/page.tsx`) — Live WASM & AWS Nitro PCR0 State Assertion Replay**
   - Compares Robinhood Sequencer state hashes against Ravelin's independent Nitro node replay every 10 minutes.
3. **`/revenue` (`src/app/revenue/page.tsx`) & `/api/revenue` (`src/app/api/revenue/route.ts`) — Public `$RVLN` Buyback & Treasury Ledger**
   - Displays every on-chain `$RVLN` buyback transaction and serves live JSON telemetry at `GET /api/revenue`.
4. **`/docs` (`src/app/docs/page.tsx`) — Gateway, Auction, Validator, Data & SDK Documentation**
5. **`/pricing` (`src/app/pricing/page.tsx`) — Interactive Request Unit & Throughput Plans**
6. **`/app` (`src/app/app/page.tsx`) — Interactive App Console**
   - Live traffic metrics, API Key generator, AI Agent Firewall rules (`ArbSys` L2 + L1 blob gas cap, RocksDB duplicate cooldown), Holding Pen (`>$10k` human approval queue), Audit Logs, and Emergency Kill-Switch.
