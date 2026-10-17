"use client";
import React, { useEffect, useState } from "react";

export function CoLocationTopology() {
  const [rtt, setRtt] = useState("0.84");
  const [blockNum, setBlockNum] = useState(48912044);

  useEffect(() => {
    const interval = setInterval(() => {
      const jitter = (0.78 + Math.random() * 0.14).toFixed(2);
      setRtt(jitter);
      setBlockNum((b) => b + 10);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="blue-gradient-box border border-white/30 rounded-2xl p-5 flex flex-col items-center shadow-2xl text-white relative">
      {/* Top Telemetry Header */}
      <div className="w-full flex items-center justify-between text-xs font-mono text-blue-100 mb-3 pb-2 border-b border-white/20">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
          <span className="font-semibold text-white tracking-wide">LIVE CO-LOCATION TOPOLOGY</span>
        </span>
        <span className="px-2 py-0.5 rounded-full bg-white/15 border border-white/25 text-emerald-300 font-bold">
          {rtt} ms RTT
        </span>
      </div>

      {/* Animated SVG Globe & Fiber Stream */}
      <svg
        viewBox="0 0 320 220"
        className="w-full max-w-[320px] h-auto overflow-visible"
        role="img"
        aria-label="Animated Co-located Robinhood Sequencer and Ravelin Node Globe"
      >
        <defs>
          <radialGradient id="globeCoreGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.0" />
          </radialGradient>
          <linearGradient id="fiberGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="50%" stopColor="#67E8F9" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
          <path id="txPathForward" d="M 105 102 Q 160 72 215 102" />
          <path id="txPathReturn" d="M 215 106 Q 160 136 105 106" />
        </defs>

        {/* Glowing Globe Halo & Rotating Outer Ring */}
        <circle cx="160" cy="112" r="88" fill="url(#globeCoreGrad)" />
        <circle
          cx="160"
          cy="112"
          r="80"
          fill="none"
          stroke="#BFDBFE"
          strokeOpacity="0.55"
          strokeWidth="1.4"
          strokeDasharray="4 4"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 160 112"
            to="360 160 112"
            dur="36s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Latitude & Longitude Grid */}
        <ellipse cx="160" cy="112" rx="80" ry="32" fill="none" stroke="#DBEAFE" strokeOpacity="0.4" strokeWidth="1" />
        <ellipse
          cx="160"
          cy="112"
          rx="80"
          ry="58"
          fill="none"
          stroke="#DBEAFE"
          strokeOpacity="0.3"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <ellipse cx="160" cy="112" rx="36" ry="80" fill="none" stroke="#DBEAFE" strokeOpacity="0.4" strokeWidth="1" />

        {/* Continent Dot Matrix */}
        <g fill="#EFF6FF" opacity="0.95">
          <circle cx="102" cy="76" r="2.2" />
          <circle cx="114" cy="72" r="2.2" />
          <circle cx="126" cy="76" r="2.2" />
          <circle cx="96" cy="86" r="2.2" />
          <circle cx="108" cy="84" r="2.6" />
          <circle cx="120" cy="88" r="2.2" />
          <circle cx="176" cy="74" r="2.2" />
          <circle cx="188" cy="78" r="2.2" />
          <circle cx="200" cy="84" r="2.2" />
          <circle cx="170" cy="90" r="2.2" />
          <circle cx="184" cy="94" r="2.6" />
          <circle cx="196" cy="96" r="2.2" />
          <circle cx="132" cy="136" r="2.2" />
          <circle cx="142" cy="146" r="2.2" />
          <circle cx="138" cy="158" r="2.2" />
          <circle cx="184" cy="136" r="2.2" />
          <circle cx="196" cy="144" r="2.2" />
          <circle cx="190" cy="154" r="2.2" />
        </g>

        {/* Direct Fiber Link Arcs */}
        <use href="#txPathForward" fill="none" stroke="url(#fiberGrad)" strokeWidth="2.5" />
        <use href="#txPathReturn" fill="none" stroke="#67E8F9" strokeWidth="1.8" strokeDasharray="4 4" opacity="0.9" />

        {/* Animated Data Packets Streaming Across Fiber */}
        <circle r="4" fill="#FDE047">
          <animateMotion dur="1.1s" repeatCount="indefinite">
            <mpath href="#txPathForward" />
          </animateMotion>
        </circle>
        <circle r="3.5" fill="#34D399">
          <animateMotion dur="1.1s" begin="0.55s" repeatCount="indefinite">
            <mpath href="#txPathForward" />
          </animateMotion>
        </circle>
        <circle r="3.5" fill="#38BDF8">
          <animateMotion dur="1.3s" repeatCount="indefinite">
            <mpath href="#txPathReturn" />
          </animateMotion>
        </circle>

        {/* Left Node: ROBINHOOD CHAIN SEQUENCER */}
        <circle cx="105" cy="104" r="8" fill="none" stroke="#FBBF24" strokeWidth="2">
          <animate attributeName="r" values="7;22;7" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.95;0;0.95" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="105" cy="104" r="7.5" fill="#FBBF24" stroke="#FFFFFF" strokeWidth="2" />

        {/* Right Node: RAVELIN NITRO NODE */}
        <circle cx="215" cy="104" r="8" fill="none" stroke="#34D399" strokeWidth="2">
          <animate attributeName="r" values="7;22;7" dur="2s" begin="0.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.95;0;0.95" dur="2s" begin="0.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="215" cy="104" r="7.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />

        {/* Node Badges */}
        <rect x="14" y="20" width="128" height="26" rx="7" fill="#172554" stroke="#FBBF24" strokeWidth="1.4" />
        <text x="78" y="36" textAnchor="middle" fill="#FDE68A" fontFamily="JetBrains Mono" fontSize="9.5" fontWeight="700">
          ● CHAIN SEQUENCER
        </text>
        <line x1="88" y1="46" x2="103" y2="96" stroke="#FBBF24" strokeWidth="1" strokeDasharray="2 2" />

        <rect x="178" y="20" width="128" height="26" rx="7" fill="#172554" stroke="#34D399" strokeWidth="1.4" />
        <text x="242" y="36" textAnchor="middle" fill="#6EE7B7" fontFamily="JetBrains Mono" fontSize="9.5" fontWeight="700">
          ● RAVELIN NITRO
        </text>
        <line x1="232" y1="46" x2="217" y2="96" stroke="#34D399" strokeWidth="1" strokeDasharray="2 2" />

        {/* Bottom Status Pill */}
        <rect x="55" y="182" width="210" height="24" rx="12" fill="#1E3A8A" stroke="#93C5FD" strokeWidth="1.2" />
        <text x="160" y="197" textAnchor="middle" fill="#FFFFFF" fontFamily="JetBrains Mono" fontSize="9.5" fontWeight="700">
          BLOCK #{blockNum.toLocaleString()} · 1ms DIRECT FIBER
        </text>
      </svg>

      {/* Bottom Telemetry Strip */}
      <div className="w-full grid grid-cols-3 gap-2 pt-2 mt-2 border-t border-white/20 text-center font-mono text-[11px]">
        <div>
          <div className="text-blue-100">ZONE</div>
          <div className="text-white font-bold">US-East-1a</div>
        </div>
        <div>
          <div className="text-blue-100">PEER HOP</div>
          <div className="text-emerald-300 font-bold">{rtt} ms</div>
        </div>
        <div>
          <div className="text-blue-100">MEMPOOL</div>
          <div className="text-amber-300 font-bold">Private</div>
        </div>
      </div>
    </div>
  );
}
