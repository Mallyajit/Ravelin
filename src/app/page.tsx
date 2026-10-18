"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Chart from "chart.js/auto";
import { CoLocationTopology } from "@/components/CoLocationTopology";
import { PlanShowcaseModal } from "@/components/PlanShowcaseModal";
import { RazorpayModal } from "@/components/RazorpayModal";
import { FaqExplorerModal } from "@/components/FaqExplorerModal";
import { LoginModal } from "@/components/LoginModal";
import { DepositConfirmModal } from "@/components/DepositConfirmModal";
import { useEnclave } from "@/context/EnclaveContext";

interface WasmEntry {
  block: number;
  root: string;
  wavm: string;
  rtt: string;
  age: string;
}

const INITIAL_WASM_HISTORY: WasmEntry[] = [
  { block: 48912050, root: "0x91e4...77c8", wavm: "0x91e4...77c8", rtt: "0.89 ms", age: "Just now" },
  { block: 48912000, root: "0x8f9d...3a21", wavm: "0x8f9d...3a21", rtt: "0.91 ms", age: "10m ago" },
  { block: 48906000, root: "0x4a1b...c2b1", wavm: "0x4a1b...c2b1", rtt: "0.88 ms", age: "20m ago" },
  { block: 48900000, root: "0xc7e0...a765", wavm: "0xc7e0...a765", rtt: "0.94 ms", age: "30m ago" },
  { block: 48894000, root: "0x3d12...90f1", wavm: "0x3d12...90f1", rtt: "0.86 ms", age: "40m ago" },
  { block: 48888000, root: "0x7e44...11b8", wavm: "0x7e44...11b8", rtt: "0.92 ms", age: "50m ago" },
  { block: 48882000, root: "0x2a09...55d4", wavm: "0x2a09...55d4", rtt: "0.90 ms", age: "1h ago" },
  { block: 48876000, root: "0x11c4...33e9", wavm: "0x11c4...33e9", rtt: "0.87 ms", age: "1h 10m ago" },
];

interface LedgerRow {
  cat: "PROTECTION" | "RPC" | "AUCTION";
  pool: string;
  amount: number;
  label: string;
  latency: string;
  hash: string;
}

const LEDGER_ROWS: LedgerRow[] = [
  { cat: "PROTECTION", pool: "NVDA / USDC", amount: 2840, label: "$2,840 Revert Blocked", latency: "0.18 ms", hash: "0x9f1a...88c2" },
  { cat: "RPC", pool: "AAPL / USDC", amount: 1540, label: "$1,540 Private Ingress", latency: "0.82 ms", hash: "0x77c2...11d0" },
  { cat: "AUCTION", pool: "TSLA / USDC", amount: 3910, label: "$3,910 Rebate Credited", latency: "0.94 ms", hash: "0x33b8...90a1" },
  { cat: "PROTECTION", pool: "MSFT / USDC", amount: 4120, label: "$4,120 Loop Refused", latency: "0.19 ms", hash: "0x44a9...f6e5" },
  { cat: "AUCTION", pool: "NVDA / USDC", amount: 2150, label: "$2,150 Rebate Credited", latency: "0.88 ms", hash: "0x12c8...77a4" },
  { cat: "RPC", pool: "ETH / USDG", amount: 1980, label: "$1,980 Private Ingress", latency: "0.85 ms", hash: "0x66d1...33b9" },
];

const CODE_SNIPPETS = {
  curl: `curl https://rpc.ravelin.network \\
  -H 'x-api-key: ordo_live_98a4f2c1...' \\
  -H 'content-type: application/json' \\
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_sendRawTransaction","params":["0x02f8..."]}'`,
  ts: `import { createWalletClient, http } from 'viem';
import { RavelinWall } from '@ravelin-wall/sdk';

const wallet = createWalletClient({ transport: http('https://rpc.ravelin.network') });
export const safeAgent = RavelinWall.wrap(wallet, { chainId: 4663, hourlyBudgetUsd: 500 });`,
  py: `from web3 import Web3
from ravelin_wall import RavelinFirewall

w3 = Web3(Web3.HTTPProvider("https://rpc.ravelin.network"))
agent_wallet = RavelinFirewall.wrap(w3, api_key="ordo_live_...", chain_id=4663)`,
};

export default function HomePage() {
  const router = useRouter();
  const {
    loggedIn,
    activePlan,
    openPlanShowcaseModal,
    openFaqModal,
    toastMsg,
    triggerSnackbar,
    holdingPen,
    approveHoldingItem,
    rejectHoldingItem,
  } = useEnclave();

  // Tooltip state with mouseenter, mouseleave & window scroll dismissal
  const [isTooltipOpen, setTooltipOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setTooltipOpen(false);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Chart.js instances ref
  const chartsRef = useRef<{
    telemetry?: Chart | null;
    split?: Chart | null;
    latency?: Chart | null;
    buyback?: Chart | null;
  }>({});

  useEffect(() => {
    // 1. Telemetry Chart
    const ctx1 = document.getElementById("telemetryMainChart") as HTMLCanvasElement | null;
    if (ctx1) {
      const existing1 = Chart.getChart(ctx1);
      if (existing1) existing1.destroy();
      chartsRef.current.telemetry = new Chart(ctx1, {
        type: "bar",
        data: {
          labels: ["Sep 15", "Sep 22", "Sep 29", "Oct 06", "Oct 13", "Oct 17"],
          datasets: [
            { label: "Volume ($K)", data: [820, 1490, 1180, 1340, 1620, 1740], backgroundColor: "#2563EB", borderRadius: 4 },
            { label: "Rebates ($K)", data: [24, 42, 31, 38, 46, 51], backgroundColor: "#38BDF8", borderRadius: 4 },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 1100, easing: "easeOutQuart" },
          plugins: {
            legend: {
              labels: { color: "#0F172A", font: { family: "Plus Jakarta Sans", size: 11 } },
            },
          },
          scales: {
            x: { ticks: { color: "#475569" }, grid: { display: false } },
            y: { ticks: { color: "#475569" }, grid: { color: "#F1F5F9" } },
          },
        },
      });
    }

    // 2. Rebate Split Doughnut Chart
    const ctx2 = document.getElementById("rebateSplitChart") as HTMLCanvasElement | null;
    if (ctx2) {
      const existing2 = Chart.getChart(ctx2);
      if (existing2) existing2.destroy();
      chartsRef.current.split = new Chart(ctx2, {
        type: "doughnut",
        data: {
          labels: ["User (90%)", "App (5%)", "Protocol (5%)"],
          datasets: [
            { data: [90, 5, 5], backgroundColor: ["#2563EB", "#38BDF8", "#CBD5E1"], borderWidth: 0 },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "68%",
          plugins: { legend: { display: false } },
        },
      });
    }

    // 3. Validator Latency Chart
    const ctx3 = document.getElementById("validatorLatencyChart") as HTMLCanvasElement | null;
    if (ctx3) {
      const existing3 = Chart.getChart(ctx3);
      if (existing3) existing3.destroy();
      chartsRef.current.latency = new Chart(ctx3, {
        type: "bar",
        data: {
          labels: ["Ravelin Nitro (1.08 ms)", "Dedicated RPC (18.4 ms)", "Public RPC (48.2 ms)"],
          datasets: [
            {
              label: "Latency (ms)",
              data: [1.08, 18.4, 48.2],
              backgroundColor: ["#2563EB", "#64748B", "#CBD5E1"],
              borderRadius: 4,
            },
          ],
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 1100, easing: "easeOutQuart" },
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: "#475569" }, grid: { color: "#F1F5F9" } },
            y: { ticks: { color: "#0F172A", font: { weight: "bold" } }, grid: { display: false } },
          },
        },
      });
    }

    // 4. Buyback Curve Chart
    const ctx4 = document.getElementById("buybackCurveChart") as HTMLCanvasElement | null;
    if (ctx4) {
      const existing4 = Chart.getChart(ctx4);
      if (existing4) existing4.destroy();
      chartsRef.current.buyback = new Chart(ctx4, {
        type: "line",
        data: {
          labels: ["Swap #2", "Swap #5", "Swap #8", "Swap #11", "Swap #13", "Swap #14"],
          datasets: [
            {
              label: "Cumulative $RVLN",
              data: [42000, 112000, 189000, 261924, 381048, 430215],
              borderColor: "#2563EB",
              backgroundColor: "rgba(37, 99, 235, 0.1)",
              borderWidth: 2.5,
              fill: true,
              tension: 0.35,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 1200, easing: "easeOutQuart" },
          plugins: {
            legend: {
              labels: { color: "#0F172A", font: { family: "Plus Jakarta Sans", size: 11 } },
            },
          },
          scales: {
            x: { ticks: { color: "#475569" }, grid: { display: false } },
            y: { ticks: { color: "#475569" }, grid: { color: "#F1F5F9" } },
          },
        },
      });
    }

    // Dedicated IntersectionObserver for bidirectional scroll-reveal and chart replay
    const items = document.querySelectorAll(".reveal-item");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const chartCanvas = entry.target.querySelector("[data-scroll-chart]");
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            if (chartCanvas) {
              const type = chartCanvas.getAttribute("data-scroll-chart") as "telemetry" | "latency" | "buyback";
              if (chartsRef.current[type]) {
                chartsRef.current[type]?.reset();
                chartsRef.current[type]?.update();
              }
            }
          } else {
            entry.target.classList.remove("is-revealed");
            if (chartCanvas) {
              const type = chartCanvas.getAttribute("data-scroll-chart") as "telemetry" | "latency" | "buyback";
              if (chartsRef.current[type]) {
                chartsRef.current[type]?.reset();
              }
            }
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -20px 0px" }
    );

    items.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("is-revealed");
      }
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
      Object.values(chartsRef.current).forEach((chart) => {
        if (chart) chart.destroy();
      });
      chartsRef.current = {};
    };
  }, []);

  // Workbench Simulator State
  const [wbTab, setWbTab] = useState<"simulator" | "calculator">("simulator");
  const [selectedPool, setSelectedPool] = useState("NVDA / USDC (0x88B1…90E2)");
  const [simAmount, setSimAmount] = useState<number>(1500);
  const [orderSide, setOrderSide] = useState("Buy RWA Token");
  const [slippageBps, setSlippageBps] = useState<number>(25);
  const [agentSigner, setAgentSigner] = useState("rwa-rebalancer-01");
  const [gasPriority, setGasPriority] = useState("Standard (0.01 gwei)");
  const [simMode, setSimMode] = useState<"valid" | "loop" | "hold">("valid");
  const [isSimulating, setIsSimulating] = useState(false);

  const [simResult, setSimResult] = useState({
    st1Title: "NVDA / USDC",
    st1Status: "Verified",
    st2Title: "0.18 ms",
    st2Status: "Unique",
    st3Title: "$0.004 Gas",
    st3Status: "Within Cap",
    st4Title: "0.94 ms",
    st4Status: "+$2.70 Rebate",
    heading: "Private Sequencer Delivery",
    detail: "Zero mempool exposure · 90% auction rebate credited",
    value: "+$2.70 Rebate",
    isRevert: false,
  });

  const handleRunSim = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      const poolName = selectedPool.split(" ")[0];
      if (simMode === "loop") {
        setSimResult({
          st1Title: poolName,
          st1Status: "Verified",
          st2Title: "0.18 ms",
          st2Status: "Duplicate Calldata",
          st3Title: "Refused",
          st3Status: "Zero Gas Spent",
          st4Title: "Halted",
          st4Status: "Dropped at Ingress",
          heading: "Runaway AI Loop Halted",
          detail: "Identical calldata hash matched within 60s · $0.00 gas charged",
          value: "$0.00 Gas Spent",
          isRevert: true,
        });
        triggerSnackbar("Simulator", "Halted duplicate AI loop at zero gas cost.");
      } else if (simMode === "hold") {
        setSimResult({
          st1Title: poolName,
          st1Status: "Verified",
          st2Title: "0.19 ms",
          st2Status: "High Notional",
          st3Title: "Paused",
          st3Status: "Needs Approval",
          st4Title: "Holding Pen",
          st4Status: "Queued for Co-Sign",
          heading: "Holding Pen Triggered",
          detail: "Order exceeded $10,000 threshold · Paused in enclave memory",
          value: "Holding Pen Queued",
          isRevert: false,
        });
        triggerSnackbar("Simulator", "Queued high-notional order in Holding Pen.");
      } else {
        const reb = (simAmount * 0.0018).toFixed(2);
        setSimResult({
          st1Title: poolName,
          st1Status: "Verified",
          st2Title: "0.18 ms",
          st2Status: "Unique",
          st3Title: "$0.004 Gas",
          st3Status: "Within Cap",
          st4Title: "0.94 ms",
          st4Status: `+$${reb} Rebate`,
          heading: "Private Sequencer Delivery",
          detail: "Zero mempool exposure · 90% auction rebate credited",
          value: `+$${reb} Rebate`,
          isRevert: false,
        });
        triggerSnackbar("Simulator", `Simulated swap with +$${reb} rebate.`);
      }
    }, 320);
  };

  // Rebate Calculator State
  const [rebateVol, setRebateVol] = useState<number>(50000);
  const monthlyRebate = (rebateVol * 0.0018).toLocaleString("en-US", { maximumFractionDigits: 0 });
  const monthlyGas = (rebateVol * 0.00086).toLocaleString("en-US", { maximumFractionDigits: 0 });
  const yearlyTotal = ((rebateVol * 0.0018 + rebateVol * 0.00086) * 12).toLocaleString("en-US", { maximumFractionDigits: 0 });

  // WASM State Check State
  const [wasmHistory, setWasmHistory] = useState<WasmEntry[]>(INITIAL_WASM_HISTORY);
  const [wasmShowAll, setWasmShowAll] = useState(false);
  const [latestBlockNum, setLatestBlockNum] = useState(48912050);

  const handleVerifyNewBlock = () => {
    const nextBlock = latestBlockNum + 50;
    setLatestBlockNum(nextBlock);
    const newEntry: WasmEntry = {
      block: nextBlock,
      root: "0x" + Math.random().toString(16).slice(2, 6) + "..." + Math.random().toString(16).slice(2, 6),
      wavm: "0x" + Math.random().toString(16).slice(2, 6) + "..." + Math.random().toString(16).slice(2, 6),
      rtt: (0.84 + Math.random() * 0.12).toFixed(2) + " ms",
      age: "Just now",
    };
    setWasmHistory((prev) => [newEntry, ...prev]);
    triggerSnackbar("WASM Verifier", `Replayed block #${nextBlock.toLocaleString("en-US")} in WAVM. 100% Merkle root match.`);
  };

  // Buyback Ledger State
  const [ledgerFilter, setLedgerFilter] = useState<"ALL" | "PROTECTION" | "RPC" | "AUCTION">("ALL");
  const [ledgerSortAsc, setLedgerSortAsc] = useState(false);
  const [ledgerPage, setLedgerPage] = useState(1);

  const filteredLedger = LEDGER_ROWS.filter(
    (r) => ledgerFilter === "ALL" || r.cat === ledgerFilter
  ).sort((a, b) => (ledgerSortAsc ? a.amount - b.amount : b.amount - a.amount));

  const perPage = 3;
  const totalPages = Math.max(1, Math.ceil(filteredLedger.length / perPage));
  const currentLedgerPage = filteredLedger.slice((ledgerPage - 1) * perPage, ledgerPage * perPage);

  // SDK Code Snippet Tab
  const [codeTab, setCodeTab] = useState<"curl" | "ts" | "py">("curl");

  // Accordion FAQ states for homepage
  const [faqOpen1, setFaqOpen1] = useState(false);
  const [faqOpen2, setFaqOpen2] = useState(false);

  return (
    <div className="space-y-0 text-slate-900">
      {/* SECTION 1: CENTERED HERO & CROSS-OCEAN EARTH CONTINENT SPHERE (#sec-hero) */}
      <section
        id="sec-hero"
        className="editorial-surface border-b border-slate-200 pt-14 pb-16 px-4 sm:px-6 relative overflow-hidden"
      >
        <div
          data-parallax="0.16"
          className="pointer-events-none absolute -right-20 top-8 w-80 h-80 rounded-full bg-blue-50/80 border border-blue-100 -z-10"
        />

        <div className="max-w-4xl mx-auto space-y-12">
          {/* Centered Hero Narrative + Single Horizontally Wider "Simulate" Button */}
          <div className="reveal-item reveal-fade-up text-center flex flex-col items-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono text-blue-800">
              <span>Robinhood Chain · 100 ms Blocks · 1 ms Gateway</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 leading-[1.08] max-w-3xl">
              Co-located private RPC and deterministic AI firewall.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Answered directly from our co-located{" "}
              <span
                id="nitroTooltipTrigger"
                onMouseEnter={() => setTooltipOpen(true)}
                onMouseLeave={() => setTooltipOpen(false)}
                className="tooltip-host font-semibold text-blue-700 relative inline-block cursor-pointer"
              >
                AWS Nitro node
                {isTooltipOpen && (
                  <span
                    id="nitroTooltipBox"
                    role="tooltip"
                    className="tooltip-box is-visible"
                  >
                    Dedicated hardware enclave in the same availability zone as the Robinhood Chain sequencer.
                  </span>
                )}
              </span>
              . Zero public mempool exposure, zero gas spent on reverts or AI retry loops, and{" "}
              <strong className="text-slate-900">90% backrun rebates</strong> credited automatically.
            </p>

            {/* Single Centered Horizontally Wider "Simulate" Button */}
            <div className="pt-2 flex justify-center w-full">
              <button
                id="heroJumpWorkbenchBtn"
                type="button"
                onClick={() => {
                  document.getElementById("sec-workbench")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn-primary-rounded btn-hero-wide"
              >
                Simulate
              </button>
            </div>
          </div>

          {/* Lighter-Blue Earth Continent Sphere Card */}
          <CoLocationTopology />

          {/* 3 Compact Visual Pillar Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="reveal-item reveal-fade-up bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-slate-900">Private Ingress</h3>
                <span className="font-mono text-xs font-semibold text-blue-700">0 Mempool</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct fiber link to the sequencer ingress with zero public broadcast.
              </p>
            </div>

            <div className="reveal-item reveal-fade-up delay-100 bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-slate-900">Pre-Simulated</h3>
                <span className="font-mono text-xs font-semibold text-emerald-700">$0 Reverts</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reverts and duplicate AI agent loops are dropped before costing gas.
              </p>
            </div>

            <div className="reveal-item reveal-fade-up delay-200 bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-slate-900">90% Rebates</h3>
                <span className="font-mono text-xs font-semibold text-blue-700">Auto-Payout</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sealed-bid 200 ms backrun auctions route 90% of arbitrage back to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: TELEMETRY SCORECARDS & CHARTS (#sec-telemetry) */}
      <section
        id="sec-telemetry"
        className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-10 border-b border-slate-200 relative"
      >
        <div className="reveal-item reveal-fade-up flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">Live Network Telemetry</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              US-East availability zone hardware telemetry and on-chain settlement
            </p>
          </div>
          <span className="font-mono text-xs text-blue-700 font-semibold">
            Status: All Nodes Operational (0.84 ms)
          </span>
        </div>

        {/* 4 Scorecards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="reveal-item reveal-fade-up bg-white border border-slate-200 rounded-xl p-5 space-y-1 shadow-sm">
            <div className="text-xs text-slate-500">Delivered privately</div>
            <div className="font-mono text-2xl font-bold text-slate-900">$7,473,107</div>
            <div className="text-[11px] text-emerald-700 font-semibold font-mono">▲ 4% (30d)</div>
          </div>

          <div className="reveal-item reveal-fade-up delay-100 bg-white border border-slate-200 rounded-xl p-5 space-y-1 shadow-sm">
            <div className="text-xs text-slate-500">Transactions protected</div>
            <div className="font-mono text-2xl font-bold text-slate-900">218,049</div>
            <div className="text-[11px] text-blue-700 font-semibold font-mono">0 Reverts Mined</div>
          </div>

          <div className="reveal-item reveal-fade-up delay-200 bg-white border border-slate-200 rounded-xl p-5 space-y-1 shadow-sm">
            <div className="text-xs text-slate-500">MEV &amp; Loop Drains Prevented</div>
            <div className="font-mono text-2xl font-bold text-emerald-700">$201,591</div>
            <div className="text-[11px] text-slate-500 font-mono">147 Loops Halted</div>
          </div>

          <div className="reveal-item reveal-fade-up delay-300 bg-white border border-slate-200 rounded-xl p-5 space-y-1 shadow-sm">
            <div className="text-xs text-slate-500">Rebate share</div>
            <div className="font-mono text-2xl font-bold text-blue-700">90%</div>
            <div className="text-[11px] text-blue-600 font-semibold font-mono">To Wallet Instantly</div>
          </div>
        </div>

        {/* Weekly Protected Volume Bar Graphic (#telemetryMainChart) */}
        <div className="reveal-item reveal-scale-up bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-bold text-slate-900">Protected Weekly Volume ($ USD)</h3>
              <p className="text-xs text-slate-500 mt-0.5">30-day private mempool delivery across Robinhood Chain RWA pools</p>
            </div>
            <span className="font-mono text-xs font-semibold text-blue-700">Peak $176k · Sep 23</span>
          </div>

          <div style={{ height: "240px", width: "100%", position: "relative" }}>
            <canvas id="telemetryMainChart" data-scroll-chart="telemetry"></canvas>
          </div>
        </div>
      </section>

      {/* SECTION 3: ENCLAVE WORKBENCH SIMULATOR & REBATE ESTIMATOR (#sec-workbench) */}
      <section
        id="sec-workbench"
        className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-8 border-b border-slate-200"
      >
        <div className="reveal-item reveal-slide-left flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">Enclave Workbench</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Interactive transaction preview &amp; deterministic firewall policy</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setWbTab("simulator")}
              className={`popup-btn ${wbTab === "simulator" ? "is-active" : ""}`}
            >
              Simulator
            </button>
            <button
              type="button"
              onClick={() => setWbTab("calculator")}
              className={`popup-btn ${wbTab === "calculator" ? "is-active" : ""}`}
            >
              Calculator
            </button>
          </div>
        </div>

        {/* Pane A: Enclave Simulator */}
        {wbTab === "simulator" && (
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-6">
              {/* 6 Professional Execution Parameters (2-Column Grid, Every Label Beside Input Box) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Token Pool */}
                <div className="side-field-row">
                  <label htmlFor="tokenPoolSelect" className="side-field-label">Token Pool</label>
                  <select
                    id="tokenPoolSelect"
                    value={selectedPool}
                    onChange={(e) => setSelectedPool(e.target.value)}
                    className="side-field-input side-field-input-wide font-mono text-xs"
                  >
                    <option value="NVDA / USDC (0x88B1…90E2)">NVDA / USDC</option>
                    <option value="AAPL / USDC (0x31C4…77B9)">AAPL / USDC</option>
                    <option value="TSLA / USDC (0x91F2…88C1)">TSLA / USDC</option>
                    <option value="MSFT / USDC (0x44A9…33D0)">MSFT / USDC</option>
                    <option value="Unlisted Contract">Unlisted</option>
                  </select>
                </div>

                {/* 2. Amount ($) - NO stepper buttons */}
                <div className="side-field-row">
                  <label htmlFor="simAmountInput" className="side-field-label">Amount ($)</label>
                  <input
                    id="simAmountInput"
                    type="number"
                    min="10"
                    max="100000"
                    step="100"
                    value={simAmount}
                    onChange={(e) => setSimAmount(Number(e.target.value))}
                    className="side-field-input font-mono font-bold"
                  />
                </div>

                {/* 3. Order Side */}
                <div className="side-field-row">
                  <label htmlFor="orderSideSelect" className="side-field-label">Order Side</label>
                  <select
                    id="orderSideSelect"
                    value={orderSide}
                    onChange={(e) => setOrderSide(e.target.value)}
                    className="side-field-input side-field-input-wide text-xs font-semibold"
                  >
                    <option value="Buy RWA Token">Buy RWA Token</option>
                    <option value="Sell RWA Token">Sell RWA Token</option>
                  </select>
                </div>

                {/* 4. Slippage (bps) */}
                <div className="side-field-row">
                  <label htmlFor="slippageInput" className="side-field-label">Slippage (bps)</label>
                  <input
                    id="slippageInput"
                    type="number"
                    min="1"
                    max="500"
                    value={slippageBps}
                    onChange={(e) => setSlippageBps(Number(e.target.value))}
                    className="side-field-input font-mono"
                  />
                </div>

                {/* 5. Agent Signer */}
                <div className="side-field-row">
                  <label htmlFor="agentSignerSelect" className="side-field-label">Agent Signer</label>
                  <select
                    id="agentSignerSelect"
                    value={agentSigner}
                    onChange={(e) => setAgentSigner(e.target.value)}
                    className="side-field-input side-field-input-wide font-mono text-xs"
                  >
                    <option value="rwa-rebalancer-01">rwa-rebalancer-01</option>
                    <option value="nvda-treasury-bot">nvda-treasury-bot</option>
                    <option value="manual-ledger">manual-ledger</option>
                  </select>
                </div>

                {/* 6. Gas Priority */}
                <div className="side-field-row">
                  <label htmlFor="gasPrioritySelect" className="side-field-label">Gas Priority</label>
                  <select
                    id="gasPrioritySelect"
                    value={gasPriority}
                    onChange={(e) => setGasPriority(e.target.value)}
                    className="side-field-input side-field-input-wide text-xs"
                  >
                    <option value="Standard (0.01 gwei)">Standard (0.01 gwei)</option>
                    <option value="Fast (0.05 gwei)">Fast (0.05 gwei)</option>
                    <option value="Urgent (0.10 gwei)">Urgent (0.10 gwei)</option>
                  </select>
                </div>
              </div>

              {/* Scenario Selector Buttons + 1-Sentence Info Hint Below */}
              <div className="space-y-2.5">
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setSimMode("valid")}
                    className={`popup-btn w-full ${simMode === "valid" ? "is-active" : ""}`}
                  >
                    Standard
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimMode("loop")}
                    className={`popup-btn w-full ${simMode === "loop" ? "is-active" : ""}`}
                  >
                    Retry Loop
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimMode("hold")}
                    className={`popup-btn w-full ${simMode === "hold" ? "is-active" : ""}`}
                  >
                    High Value
                  </button>
                </div>

                {/* Short 1-Sentence User Info Section Highlighting Active Mode */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-slate-600 pt-1">
                  <div
                    id="hintCard-valid"
                    className={`p-2.5 rounded-lg border transition-colors ${
                      simMode === "valid"
                        ? "bg-blue-50/80 border-blue-200 text-blue-900 font-medium"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <strong>Standard:</strong> Simulates a valid swap routed privately with a 90% backrun rebate.
                  </div>
                  <div
                    id="hintCard-loop"
                    className={`p-2.5 rounded-lg border transition-colors ${
                      simMode === "loop"
                        ? "bg-blue-50/80 border-blue-200 text-blue-900 font-medium"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <strong>Retry Loop:</strong> Tests an AI agent repeating identical calldata within 60s, blocked at $0 gas.
                  </div>
                  <div
                    id="hintCard-hold"
                    className={`p-2.5 rounded-lg border transition-colors ${
                      simMode === "hold"
                        ? "bg-blue-50/80 border-blue-200 text-blue-900 font-medium"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <strong>High Value:</strong> Tests an order above $10,000 that pauses in the Holding Pen for approval.
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <button
                  id="runEnclaveSimBtn"
                  type="button"
                  onClick={handleRunSim}
                  className="btn-primary-rounded"
                >
                  Simulate
                </button>
                <Link
                  href="/settings?tab=firewall"
                  className="popup-btn"
                >
                  Firewall
                </Link>
              </div>
            </div>

            {/* Skeleton Loader during simulation */}
            {isSimulating && (
              <div id="simSkeletonLoader" className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <div className="text-xs font-mono text-blue-700">
                  Executing state simulation inside AWS Nitro TEE...
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="h-14 skeleton-shimmer" />
                  <div className="h-14 skeleton-shimmer" />
                  <div className="h-14 skeleton-shimmer" />
                  <div className="h-14 skeleton-shimmer" />
                </div>
              </div>
            )}

            {/* Visual 4-Node Pipeline Result */}
            {!isSimulating && (
              <div id="simPipelineGrid" className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-mono text-[10px] uppercase text-slate-400">ABI Check</div>
                    <div id="st1Title" className="font-bold text-slate-900 truncate">{simResult.st1Title}</div>
                    <div id="st1Status" className="font-mono text-emerald-700 font-semibold">{simResult.st1Status}</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-mono text-[10px] uppercase text-slate-400">Loop Guard</div>
                    <div id="st2Title" className="font-bold text-slate-900">{simResult.st2Title}</div>
                    <div id="st2Status" className={`font-mono font-semibold ${simResult.isRevert ? "text-red-600" : "text-emerald-700"}`}>
                      {simResult.st2Status}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-mono text-[10px] uppercase text-slate-400">ArbSys Cap</div>
                    <div id="st3Title" className="font-bold text-slate-900">{simResult.st3Title}</div>
                    <div id="st3Status" className={`font-mono font-semibold ${simResult.isRevert ? "text-red-600" : "text-emerald-700"}`}>
                      {simResult.st3Status}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-mono text-[10px] uppercase text-slate-400">Settlement</div>
                    <div id="st4Title" className="font-bold text-slate-900">{simResult.st4Title}</div>
                    <div id="st4Status" className="font-mono text-blue-700 font-semibold">{simResult.st4Status}</div>
                  </div>
                </div>

                <div className={`p-4 rounded-xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  simResult.isRevert ? "bg-red-950 border border-red-800" : "bg-blue-900"
                }`}>
                  <div>
                    <div id="simOutcomeHeading" className="font-display font-bold text-sm sm:text-base">
                      {simResult.heading}
                    </div>
                    <div id="simOutcomeDetail" className="text-xs text-blue-200">
                      {simResult.detail}
                    </div>
                  </div>
                  <div id="simOutcomeValue" className={`font-mono text-lg font-bold shrink-0 ${
                    simResult.isRevert ? "text-red-400" : "text-emerald-300"
                  }`}>
                    {simResult.value}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pane B: Rebate Estimator & Holding Pen */}
        {wbTab === "calculator" && (
          <div id="wbPane-calculator" className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-7 space-y-4">
                  <h3 className="font-display text-lg font-bold text-slate-900">90% Rebate Estimator</h3>
                  <div className="side-field-row">
                    <label htmlFor="rebateVolInput" className="side-field-label">Monthly Volume ($)</label>
                    <input
                      id="rebateVolInput"
                      type="number"
                      min="1000"
                      max="50000000"
                      step="5000"
                      value={rebateVol}
                      onChange={(e) => setRebateVol(Number(e.target.value))}
                      className="side-field-input font-mono"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[10000, 50000, 250000].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setRebateVol(v)}
                        className={`vol-preset-btn popup-btn btn-sm font-mono ${rebateVol === v ? "is-active" : ""}`}
                      >
                        ${v / 1000}k
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white border border-slate-200 rounded-xl p-3">
                      <div className="text-[11px] text-slate-500">Rebate</div>
                      <div id="calcMonthlyRebate" className="font-mono text-base font-bold text-blue-700 mt-0.5" suppressHydrationWarning>
                        +${monthlyRebate}/mo
                      </div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-3">
                      <div className="text-[11px] text-slate-500">Saved Gas</div>
                      <div id="calcMonthlyGas" className="font-mono text-base font-bold text-slate-900 mt-0.5" suppressHydrationWarning>
                        +${monthlyGas}/mo
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                      <div className="text-[11px] text-blue-800 font-semibold">Annual</div>
                      <div id="calcYearlyTotal" className="font-mono text-base font-bold text-blue-900 mt-0.5" suppressHydrationWarning>
                        +${yearlyTotal}/yr
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-5 bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center">
                  <div className="text-xs font-semibold text-slate-700 mb-2 font-display">Auction Clearing Split</div>
                  <div style={{ height: "150px", width: "150px", position: "relative" }}>
                    <canvas id="rebateSplitChart"></canvas>
                  </div>
                  <div className="flex gap-3 text-[11px] font-mono text-slate-600 mt-2">
                    <span className="text-blue-700 font-semibold">90% User</span>
                    <span className="text-sky-500 font-semibold">5% App</span>
                    <span className="text-slate-800 font-semibold">5% Protocol</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Holding Pen list */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-slate-900">Holding Pen (&gt;$10,000)</h3>
                <span id="holdingPenCountChip" className="px-2.5 py-1 rounded bg-blue-50 text-blue-800 font-mono text-xs font-semibold" suppressHydrationWarning>
                  {holdingPen.filter((x) => x.status === "PENDING").length} Pending
                </span>
              </div>
              <div id="holdingPenList" className="space-y-2.5">
                {holdingPen.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-mono font-bold text-xs text-slate-900" suppressHydrationWarning>
                        {item.id}: {item.asset} (${item.notionalUsd.toLocaleString("en-US")})
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.reasoning}</div>
                    </div>
                    {item.status === "PENDING" ? (
                      <div className="flex gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => approveHoldingItem(item.id)}
                          className="popup-btn btn-sm text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => rejectHoldingItem(item.id)}
                          className="popup-btn btn-sm text-red-600 border-red-300 hover:bg-red-50"
                        >
                          Drop
                        </button>
                      </div>
                    ) : (
                      <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                        item.status === "APPROVED" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                      }`}>
                        {item.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SECTION 4: UPGRADED WASM STATE CHECK (#sec-statecheck) */}
      <section
        id="sec-statecheck"
        className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-8 border-b border-slate-200"
      >
        <div className="reveal-item reveal-slide-left flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">WASM State Check</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Independent Arbitrum Orbit / Robinhood Chain state transition replay in WAVM
            </p>
          </div>
          <button
            id="verifyNewBlockBtn"
            type="button"
            onClick={handleVerifyNewBlock}
            className="btn-primary-rounded shrink-0"
          >
            Verify
          </button>
        </div>

        {/* Live WASM State Transition Verifier Console (4-Metric Header + 3-Step Progress Bar) */}
        <div className="reveal-item reveal-fade-up bg-gradient-to-r from-blue-50/80 via-white to-sky-50/70 border border-blue-200 rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white border border-slate-200">
              <div className="text-[10px] font-mono uppercase text-slate-400">WAVM Module Root</div>
              <div className="font-mono font-bold text-slate-900 mt-0.5">0x6b21...e409</div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200">
              <div className="text-[10px] font-mono uppercase text-slate-400">Latest Assertion</div>
              <div id="wasmLiveBlockLabel" className="font-mono font-bold text-blue-700 mt-0.5" suppressHydrationWarning>
                #{latestBlockNum.toLocaleString("en-US")}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200">
              <div className="text-[10px] font-mono uppercase text-slate-400">Replay Duration</div>
              <div id="wasmLiveDurationLabel" className="font-mono font-bold text-emerald-700 mt-0.5">
                0.89 ms
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200">
              <div className="text-[10px] font-mono uppercase text-slate-400">BoLD Status</div>
              <div id="wasmLiveStatusLabel" className="font-mono font-bold text-emerald-700 mt-0.5">
                100% Match
              </div>
            </div>
          </div>

          {/* 3-Step Verification Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono text-slate-600">
              <span id="wasmStepNarrative">
                1. Fetch Sequencer Batch → 2. Execute WAVM State Transition → 3. Compare Output Merkle Root
              </span>
              <span className="text-blue-700 font-semibold">Verified</span>
            </div>
            <div className="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
              <div id="wasmVerifyProgressBar" className="h-full bg-blue-600 w-full transition-all duration-300" />
            </div>
          </div>
        </div>

        {/* Static Graph 2: Latency Benchmark (#validatorLatencyChart) */}
        <div className="reveal-item reveal-scale-up bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-slate-900">Median Response Latency (ms)</h3>
            <span className="font-mono text-xs font-semibold text-blue-700">1.08 ms vs. 48.2 ms</span>
          </div>
          <div style={{ height: "200px", width: "100%", position: "relative" }}>
            <canvas id="validatorLatencyChart" data-scroll-chart="latency"></canvas>
          </div>
        </div>

        {/* WASM Replay List: Top 5 entries (5th row faded with .wasm-faded-fifth when collapsed) + Show More button */}
        <div className="reveal-item reveal-fade-up bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between font-sans">
            <span className="text-sm font-bold text-slate-900">
              Verified State Assertions ({wasmShowAll ? wasmHistory.length : "Top 5"} Shown)
            </span>
            <span id="wasmTotalCountBadge" className="text-xs font-mono text-slate-500" suppressHydrationWarning>
              {wasmHistory.length} Total Checkpoints
            </span>
          </div>

          {/* Top 5 Visible Rows */}
          <div id="wasmVisibleRows" className="space-y-2">
            {wasmHistory.slice(0, 5).map((entry, idx) => (
              <div
                key={entry.block}
                className={`p-3 rounded-xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-2 ${
                  !wasmShowAll && idx === 4 ? "wasm-faded-fifth" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900" suppressHydrationWarning>
                    Block #{entry.block.toLocaleString("en-US")}
                  </span>
                  <span className="text-slate-400">Root: {entry.root}</span>
                  <span className="text-emerald-700 font-semibold">WAVM: {entry.wavm}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <span className="text-blue-700 font-semibold">{entry.rtt}</span>
                  <span>{entry.age}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Past Entries Container */}
          {wasmShowAll && (
            <div id="wasmPastEntriesContainer" className="space-y-2 pt-2 border-t border-slate-200">
              {wasmHistory.slice(5).map((entry) => (
                <div
                  key={entry.block}
                  className="p-3 rounded-xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900" suppressHydrationWarning>
                      Block #{entry.block.toLocaleString("en-US")}
                    </span>
                    <span className="text-slate-400">Root: {entry.root}</span>
                    <span className="text-emerald-700 font-semibold">WAVM: {entry.wavm}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500">
                    <span className="text-blue-700 font-semibold">{entry.rtt}</span>
                    <span>{entry.age}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-1 flex justify-center">
            <button
              id="wasmShowMoreBtn"
              type="button"
              onClick={() => setWasmShowAll(!wasmShowAll)}
              className="popup-btn btn-sm font-sans"
            >
              {wasmShowAll ? "Show Less" : `Show More (${wasmHistory.length - 5} Past)`}
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 5: $RVLN BUYBACKS & PUBLIC LEDGER (#sec-buybacks) */}
      <section
        id="sec-buybacks"
        className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-8 border-b border-slate-200"
      >
        <div className="reveal-item reveal-fade-up flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">Public Buyback Ledger</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              100% of net protocol revenue buys $RVLN on-chain · Zero team extraction
            </p>
          </div>
          <span className="font-mono text-xs text-blue-700 font-semibold">
            Token: 0xfe2f...b167
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="reveal-item reveal-fade-up bg-white border border-slate-200 rounded-xl p-5 space-y-1 shadow-sm">
            <div className="text-xs text-slate-500">Total $RVLN Bought Back</div>
            <div className="font-mono text-2xl font-bold text-blue-700">430,215</div>
            <div className="text-[11px] text-slate-400 font-mono">100% On-Chain</div>
          </div>
          <div className="reveal-item reveal-fade-up delay-100 bg-white border border-slate-200 rounded-xl p-5 space-y-1 shadow-sm">
            <div className="text-xs text-slate-500">Total Spent</div>
            <div className="font-mono text-2xl font-bold text-slate-900">$18,217.08</div>
            <div className="text-[11px] text-emerald-700 font-semibold font-mono">USDG Settled</div>
          </div>
          <div className="reveal-item reveal-fade-up delay-200 bg-white border border-slate-200 rounded-xl p-5 space-y-1 shadow-sm">
            <div className="text-xs text-slate-500">Net Revenue Share</div>
            <div className="font-mono text-2xl font-bold text-emerald-700">100%</div>
            <div className="text-[11px] text-slate-500 font-mono">Open-Market Swaps</div>
          </div>
          <div className="reveal-item reveal-fade-up delay-300 bg-white border border-slate-200 rounded-xl p-5 space-y-1 shadow-sm">
            <div className="text-xs text-slate-500">Retained by Protocol</div>
            <div className="font-mono text-2xl font-bold text-slate-900">0%</div>
            <div className="text-[11px] text-blue-700 font-semibold font-mono">Zero Fee Cream</div>
          </div>
        </div>

        {/* Cumulative $RVLN Purchased Line Chart (#buybackCurveChart) */}
        <div className="reveal-item reveal-scale-up bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-base font-bold text-slate-900">Cumulative $RVLN Purchased (430,215 RVLN)</h3>
            <span className="font-mono text-xs font-semibold text-blue-700">$17,805.08 Total</span>
          </div>
          <div style={{ height: "220px", width: "100%", position: "relative" }}>
            <canvas id="buybackCurveChart" data-scroll-chart="buyback"></canvas>
          </div>
        </div>

        {/* Ledger Table with Filter Pills & Pagination */}
        <div className="reveal-item reveal-fade-up bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
            <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
              {(["ALL", "PROTECTION", "RPC", "AUCTION"] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => {
                    setLedgerFilter(filter);
                    setLedgerPage(1);
                  }}
                  className={`ledger-filter-btn popup-btn btn-sm ${ledgerFilter === filter ? "is-active" : ""}`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Auto-settled via Orbit DEX 0.05% pool
            </div>
          </div>

          <div className="overflow-x-auto font-mono text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-white text-slate-500">
                  <th className="p-3">Category</th>
                  <th className="p-3">Pool</th>
                  <th
                    className="p-3 cursor-pointer select-none hover:text-blue-700"
                    onClick={() => setLedgerSortAsc(!ledgerSortAsc)}
                  >
                    Amount {ledgerSortAsc ? "↑" : "↓"}
                  </th>
                  <th className="p-3">Latency</th>
                  <th className="p-3">Tx Hash</th>
                </tr>
              </thead>
              <tbody id="ledgerTableBody" className="divide-y divide-slate-100">
                {currentLedgerPage.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-semibold text-blue-800">{row.cat}</td>
                    <td className="p-3 text-slate-900">{row.pool}</td>
                    <td className="p-3 font-bold text-slate-900">{row.label}</td>
                    <td className="p-3 text-slate-500">{row.latency}</td>
                    <td className="p-3 text-blue-600">{row.hash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 border-t border-slate-200 flex items-center justify-between text-xs font-mono bg-slate-50">
            <span id="paginationSummary" className="text-slate-500">
              Page {ledgerPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                id="pagePrevBtn"
                type="button"
                disabled={ledgerPage === 1}
                onClick={() => setLedgerPage((p) => Math.max(1, p - 1))}
                className="popup-btn btn-sm disabled:opacity-40"
              >
                Prev
              </button>
              <button
                id="pageNextBtn"
                type="button"
                disabled={ledgerPage === totalPages}
                onClick={() => setLedgerPage((p) => Math.min(totalPages, p + 1))}
                className="popup-btn btn-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: THROUGHPUT PLANS & HOMEPAGE FAQS (#sec-pricing) */}
      <section
        id="sec-pricing"
        className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-10 border-b border-slate-200"
      >
        <div className="reveal-item reveal-fade-up flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">Throughput Plans</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Co-located Nitro node, private sends, and 90% rebates on every tier
            </p>
          </div>
          <button
            type="button"
            onClick={() => openPlanShowcaseModal()}
            className="popup-btn"
          >
            Compare
          </button>
        </div>

        {/* 4 Auth-Aware Plan Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Free */}
          <div className="reveal-item reveal-fade-up bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-5">
            <div className="space-y-1.5">
              <h3 className="font-display text-base font-bold text-slate-900">Free</h3>
              <div className="font-mono text-2xl font-bold text-slate-900">$0</div>
              <p className="text-xs text-slate-500">5M units · 1,000 req/min</p>
            </div>
            <button
              type="button"
              onClick={() => openPlanShowcaseModal("Free")}
              className={`tier-action-btn w-full ${!loggedIn ? "btn-primary-rounded" : "popup-btn"}`}
            >
              {!loggedIn ? "Upgrade" : "Downgrade"}
            </button>
          </div>

          {/* Card 2: Builder */}
          <div className="reveal-item reveal-fade-up delay-100 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-5">
            <div className="space-y-1.5">
              <h3 className="font-display text-base font-bold text-slate-900">Builder</h3>
              <div className="font-mono text-2xl font-bold text-slate-900">
                $29 <span className="text-xs font-normal text-slate-500">/ 30d</span>
              </div>
              <p className="text-xs text-slate-500">50M units · 12,000 req/min</p>
            </div>
            <button
              type="button"
              onClick={() => openPlanShowcaseModal("Builder")}
              className={`tier-action-btn w-full ${!loggedIn ? "btn-primary-rounded" : "popup-btn"}`}
            >
              {!loggedIn ? "Upgrade" : "Downgrade"}
            </button>
          </div>

          {/* Card 3: Pro (Current Plan) */}
          <div className="reveal-item reveal-fade-up delay-200 bg-blue-50/70 border-2 border-blue-600 rounded-2xl p-5 flex flex-col justify-between space-y-5 shadow-sm">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-slate-900">Pro</h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-semibold">
                  Popular
                </span>
              </div>
              <div className="font-mono text-2xl font-bold text-blue-900">
                $199 <span className="text-xs font-normal text-slate-600">/ 30d</span>
              </div>
              <p className="text-xs text-slate-600">500M units · 60,000 req/min</p>
            </div>
            <button
              type="button"
              onClick={() => openPlanShowcaseModal("Pro")}
              className={`tier-action-btn w-full ${
                !loggedIn ? "btn-primary-rounded" : "popup-btn is-active"
              }`}
            >
              {!loggedIn ? "Upgrade" : activePlan === "Pro" ? "Current Plan" : "Upgrade"}
            </button>
          </div>

          {/* Card 4: Dedicated */}
          <div className="reveal-item reveal-fade-up delay-300 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-5">
            <div className="space-y-1.5">
              <h3 className="font-display text-base font-bold text-slate-900">Dedicated</h3>
              <div className="font-mono text-2xl font-bold text-slate-900">
                $999 <span className="text-xs font-normal text-slate-500">/ 30d</span>
              </div>
              <p className="text-xs text-slate-500">5B units · 250,000 req/min</p>
            </div>
            <button
              type="button"
              onClick={() => openPlanShowcaseModal("Dedicated")}
              className="tier-action-btn btn-primary-rounded w-full"
            >
              Upgrade
            </button>
          </div>
        </div>

        {/* Homepage FAQs Accordion */}
        <div id="sec-faqs" className="reveal-item reveal-fade-up space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
              Frequently Asked Questions
            </h3>
            <button
              id="openFaqModalBtn"
              type="button"
              onClick={openFaqModal}
              className="popup-btn"
            >
              More FAQs
            </button>
          </div>

          <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl bg-white overflow-hidden">
            {/* FAQ Item 1 */}
            <div className="accordion-item">
              <button
                type="button"
                aria-expanded={faqOpen1}
                onClick={() => setFaqOpen1(!faqOpen1)}
                className="accordion-trigger w-full px-6 py-4 text-left flex items-center justify-between font-display font-bold text-base text-slate-900 hover:bg-slate-50 cursor-pointer"
              >
                <span>Can Ravelin read or frontrun my transactions inside the AWS Nitro Enclave?</span>
                <svg
                  className={`accordion-chevron w-4 h-4 text-blue-600 shrink-0 transition-transform ${
                    faqOpen1 ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {faqOpen1 && (
                <div className="px-6 text-xs sm:text-sm text-slate-600 pb-4 leading-relaxed font-sans">
                  No. AWS Nitro Enclaves have no persistent storage, no interactive shell, and no external network interface. Your TLS session terminates inside isolated enclave memory verified by PCR0 attestation.
                </div>
              )}
            </div>

            {/* FAQ Item 2 */}
            <div className="accordion-item">
              <button
                type="button"
                aria-expanded={faqOpen2}
                onClick={() => setFaqOpen2(!faqOpen2)}
                className="accordion-trigger w-full px-6 py-4 text-left flex items-center justify-between font-display font-bold text-base text-slate-900 hover:bg-slate-50 cursor-pointer"
              >
                <span>Do small swaps under $500 still generate a 90% backrun rebate?</span>
                <svg
                  className={`accordion-chevron w-4 h-4 text-blue-600 shrink-0 transition-transform ${
                    faqOpen2 ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {faqOpen2 && (
                <div className="px-6 text-xs sm:text-sm text-slate-600 pb-4 leading-relaxed font-sans">
                  Only trades that create an arbitrage spread larger than the L2 gas fee (~$0.004) attract searcher bids in the 200 ms auction. Small retail swaps under ~$250 still receive full private mempool delivery and $0-gas revert protection.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: SDK INTEGRATION GUIDES (#sec-docs) */}
      <section id="sec-docs" className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-5">
        <div className="reveal-item reveal-fade-up flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">SDK Quickstart</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Drop-in replacement for any EVM JSON-RPC provider</p>
          </div>
          <button
            id="copyCodeSnippetBtn"
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(CODE_SNIPPETS[codeTab]);
              triggerSnackbar("SDK", "Copied code snippet to clipboard.");
            }}
            className="popup-btn"
          >
            Copy Snippet
          </button>
        </div>

        <div className="reveal-item reveal-scale-up bg-slate-900 text-slate-100 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-950">
            <div className="flex gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => setCodeTab("curl")}
                className={`code-tab-btn popup-btn btn-sm ${codeTab === "curl" ? "is-active text-blue-400" : "text-slate-400"}`}
              >
                curl
              </button>
              <button
                type="button"
                onClick={() => setCodeTab("ts")}
                className={`code-tab-btn popup-btn btn-sm ${codeTab === "ts" ? "is-active text-blue-400" : "text-slate-400"}`}
              >
                TypeScript (viem)
              </button>
              <button
                type="button"
                onClick={() => setCodeTab("py")}
                className={`code-tab-btn popup-btn btn-sm ${codeTab === "py" ? "is-active text-blue-400" : "text-slate-400"}`}
              >
                Python (web3.py)
              </button>
            </div>
            <div className="text-[11px] font-mono text-emerald-400 hidden sm:block">
              Chain ID: 4663
            </div>
          </div>
          <pre id="codeSnippetPre" className="p-6 font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed text-blue-200">
            {CODE_SNIPPETS[codeTab]}
          </pre>
        </div>
      </section>

      {/* Global Modals Mounted */}
      <PlanShowcaseModal />
      <RazorpayModal />
      <FaqExplorerModal />
      <LoginModal />
      <DepositConfirmModal />

      {/* Floating Snackbar Toast */}
      {toastMsg && (
        <div
          id="toastSnackbar"
          role="status"
          className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <div className="font-mono text-xs">
            <div className="font-bold text-white">{toastMsg.title}</div>
            <div className="text-slate-300">{toastMsg.desc}</div>
          </div>
        </div>
      )}
    </div>
  );
}
