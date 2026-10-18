"use client";

import React, { useEffect, useRef } from "react";

export function CoLocationTopology() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const R = 118;
    let timeTick = 0;
    let animFrameId: number;

    function isContinent(lat: number, lon: number): boolean {
      // North America
      if (lat >= 50 && lat <= 68 && lon >= -160 && lon <= -60) return true;
      if (lat >= 30 && lat <= 50 && lon >= -124 && lon <= -68) return true;
      if (lat >= 16 && lat <= 30 && lon >= -108 && lon <= -80) return true;
      // Greenland
      if (lat >= 62 && lat <= 78 && lon >= -54 && lon <= -20) return true;
      // South America
      if (lat >= -15 && lat <= 12 && lon >= -80 && lon <= -36) return true;
      if (lat >= -38 && lat <= -15 && lon >= -72 && lon <= -44) return true;
      if (lat >= -54 && lat <= -38 && lon >= -74 && lon <= -62) return true;
      // Europe (Western, Central, Northern)
      if (lat >= 36 && lat <= 58 && lon >= -9 && lon <= 38) return true;
      if (lat >= 58 && lat <= 70 && lon >= 4 && lon <= 34) return true;
      // Africa
      if (lat >= 5 && lat <= 35 && lon >= -17 && lon <= 48) return true;
      if (lat >= -34 && lat <= 5 && lon >= 10 && lon <= 42) return true;
      // Asia
      if (lat >= 22 && lat <= 68 && lon >= 38 && lon <= 142) return true;
      return false;
    }

    const landDots: { phi: number; theta: number }[] = [];
    for (let lat = -56; lat <= 74; lat += 3.0) {
      const phi = (lat * Math.PI) / 180;
      const lonStep = Math.max(2.6, 3.0 / Math.max(0.28, Math.cos(phi)));
      for (let lon = -180; lon < 180; lon += lonStep) {
        if (isContinent(lat, lon)) {
          landDots.push({ phi: phi, theta: (lon * Math.PI) / 180 });
        }
      }
    }

    function project3D(phi: number, theta: number, rotLon: number) {
      const lon = theta + rotLon;
      const tilt = 0.24;
      const x0 = R * Math.cos(phi) * Math.sin(lon);
      const y0 = R * Math.sin(phi);
      const z0 = R * Math.cos(phi) * Math.cos(lon);
      const y = y0 * Math.cos(tilt) - z0 * Math.sin(tilt);
      const z = y0 * Math.sin(tilt) + z0 * Math.cos(tilt);
      return { x: cx + x0, y: cy - y, z: z };
    }

    // Green Dot: US-East North America Continent (lat 39 N, lon -77 W)
    const ravLat = (39.0 * Math.PI) / 180;
    const ravLon = (-77.0 * Math.PI) / 180;

    // Orange Dot: Across the Atlantic Sea on the European Continent (lat 48.5 N, lon 9.0 E)
    const seqLat = (48.5 * Math.PI) / 180;
    const seqLon = (9.0 * Math.PI) / 180;

    function drawFrame() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      // Center rotation on the North Atlantic (around lon -34 W => rotLon +0.58)
      const rotLon = 0.58 + Math.sin(timeTick) * 0.22;

      // Light icy-blue ocean sphere
      const oceanGrad = ctx.createRadialGradient(cx - 32, cy - 32, 16, cx, cy, R);
      oceanGrad.addColorStop(0, "#FFFFFF");
      oceanGrad.addColorStop(0.55, "#EFF6FF");
      oceanGrad.addColorStop(1, "#DBEAFE");
      ctx.fillStyle = oceanGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      // Subtle graticule lines
      ctx.strokeStyle = "rgba(59, 130, 246, 0.14)";
      ctx.lineWidth = 0.9;
      for (let lat = -30; lat <= 60; lat += 30) {
        const pLat = (lat * Math.PI) / 180;
        ctx.beginPath();
        let started = false;
        for (let lon = -180; lon <= 180; lon += 8) {
          const pt = project3D(pLat, (lon * Math.PI) / 180, rotLon);
          if (pt.z > 0) {
            if (!started) {
              ctx.moveTo(pt.x, pt.y);
              started = true;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      }

      // Outer atmosphere rim
      ctx.strokeStyle = "#93C5FD";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();

      // Continent Dots
      for (let i = 0; i < landDots.length; i++) {
        const p = project3D(landDots[i].phi, landDots[i].theta, rotLon);
        if (p.z > -6) {
          const depthAlpha = Math.min(0.92, Math.max(0.2, (p.z + 10) / (R * 1.05)));
          ctx.fillStyle = "rgba(37, 99, 235, " + depthAlpha.toFixed(2) + ")";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.z > 25 ? 2.0 : 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Project North America Node (Green) and European Continent Node Across the Sea (Orange)
      const ravNode = project3D(ravLat, ravLon, rotLon);
      const seqNode = project3D(seqLat, seqLon, rotLon);

      // High Trans-Atlantic Fiber Arc Across the Sea
      const ctrlX = (ravNode.x + seqNode.x) / 2;
      const ctrlY = Math.min(ravNode.y, seqNode.y) - 44;

      ctx.strokeStyle = "#0284C7";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(ravNode.x, ravNode.y);
      ctx.quadraticCurveTo(ctrlX, ctrlY, seqNode.x, seqNode.y);
      ctx.stroke();

      // Packet Pulse 1 (North America -> Europe)
      const t1 = (timeTick * 2.6) % 1;
      const p1x = (1 - t1) * (1 - t1) * ravNode.x + 2 * (1 - t1) * t1 * ctrlX + t1 * t1 * seqNode.x;
      const p1y = (1 - t1) * (1 - t1) * ravNode.y + 2 * (1 - t1) * t1 * ctrlY + t1 * t1 * seqNode.y;
      ctx.fillStyle = "#0284C7";
      ctx.beginPath();
      ctx.arc(p1x, p1y, 4.2, 0, Math.PI * 2);
      ctx.fill();

      // Packet Pulse 2 (Europe -> North America)
      const t2 = 1 - ((timeTick * 2.6 + 0.5) % 1);
      const p2x = (1 - t2) * (1 - t2) * ravNode.x + 2 * (1 - t2) * t2 * ctrlX + t2 * t2 * seqNode.x;
      const p2y = (1 - t2) * (1 - t2) * ravNode.y + 2 * (1 - t2) * t2 * ctrlY + t2 * t2 * seqNode.y;
      ctx.fillStyle = "#10B981";
      ctx.beginPath();
      ctx.arc(p2x, p2y, 3.8, 0, Math.PI * 2);
      ctx.fill();

      // Green Node on North America
      ctx.fillStyle = "#10B981";
      ctx.beginPath();
      ctx.arc(ravNode.x, ravNode.y, 6.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Orange Node on Europe (Across the Sea)
      ctx.fillStyle = "#F97316";
      ctx.beginPath();
      ctx.arc(seqNode.x, seqNode.y, 6.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Update timeTick (0.0024 per frame for smooth relaxed rotation)
      timeTick += 0.0024;
      animFrameId = requestAnimationFrame(drawFrame);
    }

    drawFrame();

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <div className="reveal-item reveal-scale-up bg-gradient-to-br from-blue-50/90 via-sky-50/60 to-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-md border border-blue-200 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-100 pb-4">
        <div>
          <div className="text-[11px] font-mono uppercase text-blue-700 font-semibold">
            Trans-Atlantic Continent Peering · Sub-Millisecond Ingress
          </div>
          <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
            Live Earth Co-Location Topology
          </h2>
        </div>
        <span className="px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 font-mono text-xs text-blue-800 font-semibold">
          100% WASM Verified
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-7 flex flex-col items-center">
          <div className="relative w-full max-w-[300px] aspect-square flex items-center justify-center">
            <canvas
              ref={canvasRef}
              id="globeCanvas"
              width={300}
              height={300}
              className="w-full h-full"
            />
          </div>
          <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-600 px-2 pt-1">
            <span className="flex items-center gap-1.5 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              US-East Nitro Node
            </span>
            <span className="text-blue-700 font-semibold">Cross-Ocean Fiber Link</span>
            <span className="flex items-center gap-1.5 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              EU Sequencer Relay
            </span>
          </div>
        </div>

        <div className="md:col-span-5 space-y-3.5">
          <div className="p-4 rounded-xl bg-white border border-blue-100 shadow-sm space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-2xl font-bold text-slate-900">1.08 ms</span>
              <span className="font-mono text-xs font-semibold text-emerald-700">-97.7% Latency</span>
            </div>
            <div className="text-xs text-slate-500">Median co-located gateway response</div>
            <div className="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 w-[12%] rounded-full" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-blue-100 shadow-sm space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-2xl font-bold text-blue-700">90%</span>
              <span className="font-mono text-xs font-semibold text-blue-600">200 ms Auction</span>
            </div>
            <div className="text-xs text-slate-500">Backrun rebate credited to wallet</div>
            <div className="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[90%] rounded-full" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-blue-100 shadow-sm space-y-1.5">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-2xl font-bold text-slate-900">$0 Gas</span>
              <span className="font-mono text-xs font-semibold text-blue-700">0.18 ms Check</span>
            </div>
            <div className="text-xs text-slate-500">Refused reverts &amp; AI retry loops</div>
          </div>
        </div>
      </div>
    </div>
  );
}
