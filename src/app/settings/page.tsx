"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEnclave } from "@/context/EnclaveContext";
import { PlanShowcaseModal, PLAN_COMPARISON_ROWS, formatCellVal } from "@/components/PlanShowcaseModal";
import { RazorpayModal } from "@/components/RazorpayModal";
import { DepositConfirmModal } from "@/components/DepositConfirmModal";

type SettingsTab = "profile" | "apikeys" | "firewall" | "rebates" | "plans" | "billing";

function SettingsContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as SettingsTab) || "profile";
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);

  useEffect(() => {
    const tabParam = searchParams.get("tab") as SettingsTab;
    if (tabParam && ["profile", "apikeys", "firewall", "rebates", "plans", "billing"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const {
    userName,
    userEmail,
    activePlan,
    escrowUsd,
    enclavePaused,
    setEnclavePaused,
    triggerSnackbar,
    openPlanShowcaseModal,
    openDepositModal,
    toastMsg,
  } = useEnclave();

  // Profile State
  const [name, setName] = useState(userName);
  const [jobTitle, setJobTitle] = useState("Head of Execution");
  const [orgName, setOrgName] = useState("Quantum RWA Fund LP");
  const [email, setEmail] = useState(userEmail);
  const [telegram, setTelegram] = useState("@alexchen_rwa");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [avatarBg, setAvatarBg] = useState("bg-blue-600");
  const [passkeyOn, setPasskeyOn] = useState(true);
  const [eip712On, setEip712On] = useState(true);
  const [autoLock, setAutoLock] = useState("4h");
  const [currency, setCurrency] = useState("USD");
  const [hasSecondarySession, setHasSecondarySession] = useState(true);

  // API Keys State
  const [apiKey, setApiKey] = useState("ordo_live_98a4f2c1e7b049d3a812");
  const [webhookUrl, setWebhookUrl] = useState("https://api.quantumfund.io/webhooks/ravelin-enclave");

  // Firewall State (NO steppers, side-field-rows)
  const [hourlyBudget, setHourlyBudget] = useState(500);
  const [holdThreshold, setHoldThreshold] = useState(10000);
  const [maxGasUsd, setMaxGasUsd] = useState(0.25);
  const [slippageBps, setSlippageBps] = useState(50);
  const [loopCooldown, setLoopCooldown] = useState(60);
  const [maxReverts, setMaxReverts] = useState(3);
  const [agentRateLimit, setAgentRateLimit] = useState(120);
  const [nonceMode, setNonceMode] = useState("STRICT");

  // Firewall policy switches
  const [gasGuardOn, setGasGuardOn] = useState(true);
  const [loopBlockOn, setLoopBlockOn] = useState(true);
  const [infiniteApproveBlockOn, setInfiniteApproveBlockOn] = useState(true);
  const [strictWhitelistOn, setStrictWhitelistOn] = useState(true);

  // Whitelisted Pools
  const [whitelistPools, setWhitelistPools] = useState([
    { name: "NVDA / USDC Pool", addr: "0x88B1…90E2", selectors: "swap, transfer" },
    { name: "AAPL / USDC Pool", addr: "0x31C4…77B9", selectors: "swap, transfer" },
    { name: "USD.AI Liquidity Engine", addr: "0x4F92…11A0", selectors: "mint, redeem" },
  ]);
  const [newPoolInput, setNewPoolInput] = useState("AMZN / USDC Pool (0x99C1…44E0)");

  // Wallet State
  const [payoutWallet, setPayoutWallet] = useState("0x71C9a84F2b9011e889A2");
  const [payoutToken, setPayoutToken] = useState("USDG");

  // Billing State
  const [autoScaleOverage, setAutoScaleOverage] = useState(true);
  const [overageCap, setOverageCap] = useState(150);

  const handleAddPool = () => {
    if (!newPoolInput.trim()) return;
    setWhitelistPools((prev) => [
      { name: newPoolInput.trim(), addr: "Verified RWA Pool", selectors: "swap, transfer" },
      ...prev,
    ]);
    triggerSnackbar("Firewall", `Added ${newPoolInput} to enclave whitelist.`);
    setNewPoolInput("");
  };

  const handleRemovePool = (idx: number) => {
    setWhitelistPools((prev) => prev.filter((_, i) => i !== idx));
    triggerSnackbar("Firewall", "Removed pool from whitelist.");
  };

  return (
    <div id="dedicatedSettingsView" className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Top Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        {[
          { id: "profile", label: "Profile" },
          { id: "apikeys", label: "API Keys" },
          { id: "firewall", label: "Firewall" },
          { id: "rebates", label: "Wallet" },
          { id: "plans", label: "Plans" },
          { id: "billing", label: "Billing" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id as SettingsTab)}
            className={`popup-btn px-4 py-2 text-xs font-semibold ${
              activeTab === t.id ? "is-active font-bold" : ""
            }`}
          >
            {t.label}
          </button>
        ))}

        <Link href="/" className="ml-auto popup-btn px-4 py-2 text-xs">
          ← Back to Main Webpage
        </Link>
      </div>

      {/* TAB 1: OPERATOR PROFILE (#editPage-profile) */}
      {activeTab === "profile" && (
        <div id="editPage-profile" className="edit-page-pane space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-4">
                <div
                  id="profileAvatarPreview"
                  className={`w-16 h-16 rounded-2xl ${avatarBg} text-white font-display font-bold text-xl flex items-center justify-center shadow-sm`}
                >
                  AC
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-display text-2xl font-bold text-slate-900">Operator Profile</h1>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[11px] font-semibold">
                      KYC &amp; Enclave Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage your institutional identity, 2FA security, alert routing, and active sessions
                  </p>
                </div>
              </div>

              {/* 3 Theme Color Switcher Circles */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAvatarBg("bg-blue-600")}
                  className={`w-7 h-7 rounded-full bg-blue-600 border-2 border-white ring-2 ring-blue-600 cursor-pointer ${
                    avatarBg === "bg-blue-600" ? "scale-110" : ""
                  }`}
                  aria-label="Blue theme"
                />
                <button
                  type="button"
                  onClick={() => setAvatarBg("bg-slate-900")}
                  className={`w-7 h-7 rounded-full bg-slate-900 border-2 border-white ring-1 ring-slate-300 cursor-pointer ${
                    avatarBg === "bg-slate-900" ? "scale-110" : ""
                  }`}
                  aria-label="Slate theme"
                />
                <button
                  type="button"
                  onClick={() => setAvatarBg("bg-emerald-600")}
                  className={`w-7 h-7 rounded-full bg-emerald-600 border-2 border-white ring-1 ring-slate-300 cursor-pointer ${
                    avatarBg === "bg-emerald-600" ? "scale-110" : ""
                  }`}
                  aria-label="Emerald theme"
                />
              </div>
            </div>

            {/* 1. Identity & Organization (6 side-field-row inputs) */}
            <div className="space-y-3">
              <h2 className="font-display text-sm font-bold uppercase tracking-wider font-mono text-blue-700">
                1. Identity &amp; Organization
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="side-field-row">
                  <label htmlFor="editProfileNameInput" className="side-field-label">Full Name</label>
                  <input
                    id="editProfileNameInput"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="side-field-input side-field-input-wide"
                  />
                </div>
                <div className="side-field-row">
                  <label htmlFor="editJobTitleInput" className="side-field-label">Role / Title</label>
                  <input
                    id="editJobTitleInput"
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="side-field-input side-field-input-wide"
                  />
                </div>
                <div className="side-field-row">
                  <label htmlFor="editOrgNameInput" className="side-field-label">Organization</label>
                  <input
                    id="editOrgNameInput"
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="side-field-input side-field-input-wide"
                  />
                </div>
                <div className="side-field-row">
                  <label htmlFor="editProfileEmailInput" className="side-field-label">Work Email</label>
                  <input
                    id="editProfileEmailInput"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="side-field-input side-field-input-wide"
                  />
                </div>
                <div className="side-field-row">
                  <label htmlFor="editTelegramInput" className="side-field-label">Telegram</label>
                  <input
                    id="editTelegramInput"
                    type="text"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    className="side-field-input side-field-input-wide font-mono"
                  />
                </div>
                <div className="side-field-row">
                  <label htmlFor="editTimezoneSelect" className="side-field-label">Timezone</label>
                  <select
                    id="editTimezoneSelect"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="side-field-input side-field-input-wide cursor-pointer"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST · UTC+5:30)</option>
                    <option value="America/New_York">America/New_York (EST · UTC-5)</option>
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="Europe/London">Europe/London (GMT · UTC+0)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Hardware Security & Signing Wallets */}
            <div className="space-y-3 pt-2">
              <h2 className="font-display text-sm font-bold uppercase tracking-wider font-mono text-blue-700">
                2. Hardware Security &amp; Signing Wallets
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Hardware Passkey / YubiKey 2FA</div>
                    <div className="text-[11px] text-slate-500">Required for API key rotation &amp; withdrawals</div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={passkeyOn}
                    onClick={() => setPasskeyOn(!passkeyOn)}
                    className={`policy-toggle toggle-track ${passkeyOn ? "is-on" : ""}`}
                  >
                    <span className="toggle-knob" />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <div className="text-xs font-bold text-slate-900">EIP-712 Enclave Policy Signing</div>
                    <div className="text-[11px] text-slate-500">Require wallet signature on firewall edits</div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={eip712On}
                    onClick={() => setEip712On(!eip712On)}
                    className={`policy-toggle toggle-track ${eip712On ? "is-on" : ""}`}
                  >
                    <span className="toggle-knob" />
                  </button>
                </div>

                <div className="side-field-row">
                  <label htmlFor="profileSessionTimeout" className="side-field-label">Auto-Lock</label>
                  <select
                    id="profileSessionTimeout"
                    value={autoLock}
                    onChange={(e) => setAutoLock(e.target.value)}
                    className="side-field-input cursor-pointer"
                  >
                    <option value="30m">30 Minutes</option>
                    <option value="4h">4 Hours</option>
                    <option value="24h">24 Hours</option>
                  </select>
                </div>

                <div className="side-field-row">
                  <label htmlFor="profileCurrencySelect" className="side-field-label">Display Currency</label>
                  <select
                    id="profileCurrencySelect"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="side-field-input cursor-pointer"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Notification Channels (3-channel checkbox matrix) */}
            <div className="space-y-3 pt-2">
              <h2 className="font-display text-sm font-bold uppercase tracking-wider font-mono text-blue-700">
                3. Notification Channels
              </h2>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Event Trigger</th>
                      <th className="p-3 text-center">Email</th>
                      <th className="p-3 text-center">Telegram</th>
                      <th className="p-3 text-center">Webhook</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-medium text-slate-900">Holding Pen Order Paused (&gt;$10,000)</td>
                      <td className="p-3 text-center"><input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600 cursor-pointer" /></td>
                      <td className="p-3 text-center"><input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600 cursor-pointer" /></td>
                      <td className="p-3 text-center"><input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600 cursor-pointer" /></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-slate-900">AI Duplicate Retry Loop Refused</td>
                      <td className="p-3 text-center"><input type="checkbox" className="w-4 h-4 accent-blue-600 cursor-pointer" /></td>
                      <td className="p-3 text-center"><input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600 cursor-pointer" /></td>
                      <td className="p-3 text-center"><input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600 cursor-pointer" /></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-slate-900">Monthly Request Units &gt; 80%</td>
                      <td className="p-3 text-center"><input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600 cursor-pointer" /></td>
                      <td className="p-3 text-center"><input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600 cursor-pointer" /></td>
                      <td className="p-3 text-center"><input type="checkbox" className="w-4 h-4 accent-blue-600 cursor-pointer" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. Active Sessions */}
            <div className="space-y-2.5 pt-2">
              <h2 className="font-display text-sm font-bold uppercase tracking-wider font-mono text-blue-700">
                4. Active Sessions
              </h2>
              <div id="activeSessionsList" className="space-y-2 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-slate-900">Workstation Chrome · Linux (Current Session)</div>
                    <div className="font-mono text-[11px] text-slate-500">IP 103.88.14.92 · Active now</div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-mono text-[11px] font-semibold">
                    Current
                  </span>
                </div>
                {hasSecondarySession && (
                  <div id="secondarySessionItem" className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-slate-900">Ravelin CLI Daemon · US-East Bastion</div>
                      <div className="font-mono text-[11px] text-slate-500">IP 54.210.88.19 · Idle 2h</div>
                    </div>
                    <button
                      id="revokeSessionBtn"
                      type="button"
                      onClick={() => {
                        setHasSecondarySession(false);
                        triggerSnackbar("Security", "Revoked US-East CLI daemon session.");
                      }}
                      className="popup-btn btn-sm text-red-600"
                    >
                      Revoke
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-100">
              <button
                id="saveProfilePageBtn"
                type="button"
                onClick={() => triggerSnackbar("Profile", "Saved operator profile & security preferences.")}
                className="btn-primary-rounded"
              >
                Save Changes
              </button>
              <Link href="/" className="popup-btn">
                Back
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: API KEYS (#editPage-apikeys) */}
      {activeTab === "apikeys" && (
        <div id="editPage-apikeys" className="edit-page-pane bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">API Keys &amp; Webhooks</h1>
            <p className="text-xs text-slate-500 mt-1">Private sequencer credentials and Holding Pen webhooks</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-slate-400">Production Key</div>
              <div id="settingsApiKeyText" className="text-slate-900 font-bold text-sm mt-0.5">
                {apiKey}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                id="copySettingsKeyBtn"
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(apiKey);
                  triggerSnackbar("API Keys", "Copied production key.");
                }}
                className="popup-btn"
              >
                Copy
              </button>
              <button
                id="rotateSettingsKeyBtn"
                type="button"
                onClick={() => {
                  const nk = "ordo_live_" + Math.random().toString(16).slice(2, 18);
                  setApiKey(nk);
                  triggerSnackbar("API Keys", "Rotated production key.");
                }}
                className="popup-btn text-blue-700"
              >
                Rotate
              </button>
            </div>
          </div>
          <div className="side-field-row">
            <label htmlFor="editWebhookUrlInput" className="side-field-label">Webhook URL</label>
            <input
              id="editWebhookUrlInput"
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="side-field-input side-field-input-wide font-mono text-xs"
            />
          </div>
          <div className="flex gap-3">
            <button
              id="saveApiKeysPageBtn"
              type="button"
              onClick={() => triggerSnackbar("API Keys", "Saved webhook configuration.")}
              className="btn-primary-rounded"
            >
              Save
            </button>
            <Link href="/" className="popup-btn">
              Back
            </Link>
          </div>
        </div>
      )}

      {/* TAB 3: DETERMINISTIC FIREWALL CONTROLS (#editPage-firewall) */}
      {activeTab === "firewall" && (
        <div id="editPage-firewall" className="edit-page-pane space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-mono text-[11px] font-semibold">
                  AWS Nitro Enclave Policy
                </span>
                <h1 className="font-display text-2xl font-bold text-slate-900 mt-1">
                  Deterministic Firewall Controls
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">Enforced pre-broadcast in 0.18 ms</p>
              </div>
              <div className="flex items-center gap-2.5">
                <span
                  id="enclaveStatusBadge"
                  className={`px-3 py-1.5 rounded-full font-mono text-xs font-semibold ${
                    enclavePaused
                      ? "bg-red-50 border border-red-200 text-red-700"
                      : "bg-emerald-50 border border-emerald-200 text-emerald-700"
                  }`}
                >
                  {enclavePaused ? "Enclave Paused" : "Enclave Active"}
                </span>
                <button
                  id="killSwitchBtn"
                  type="button"
                  onClick={() => {
                    const next = !enclavePaused;
                    setEnclavePaused(next);
                    triggerSnackbar(
                      "Kill-Switch",
                      next ? "Paused all outbound enclave signatures." : "Resumed enclave transaction signing."
                    );
                  }}
                  className={`popup-btn ${
                    enclavePaused
                      ? "text-emerald-700 border-emerald-300"
                      : "text-red-600 border-red-200 hover:border-red-500"
                  }`}
                >
                  {enclavePaused ? "Resume" : "Pause Key"}
                </button>
              </div>
            </div>

            {/* 1. Spend, Gas & Slippage Ceilings (NO Steppers, Labels Beside Inputs) */}
            <div className="space-y-3">
              <h2 className="font-display text-sm font-bold uppercase tracking-wider font-mono text-blue-700">
                1. Spend, Gas &amp; Slippage Ceilings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="side-field-row">
                  <label htmlFor="policyBudgetInput" className="side-field-label">Hourly Cap ($)</label>
                  <input
                    id="policyBudgetInput"
                    type="number"
                    min="25"
                    max="100000"
                    step="25"
                    value={hourlyBudget}
                    onChange={(e) => setHourlyBudget(Number(e.target.value))}
                    className="side-field-input font-mono font-bold"
                  />
                </div>
                <div className="side-field-row">
                  <label htmlFor="policyHoldThresholdInput" className="side-field-label">Hold Threshold ($)</label>
                  <input
                    id="policyHoldThresholdInput"
                    type="number"
                    min="500"
                    max="500000"
                    step="500"
                    value={holdThreshold}
                    onChange={(e) => setHoldThreshold(Number(e.target.value))}
                    className="side-field-input font-mono font-bold"
                  />
                </div>
                <div className="side-field-row">
                  <label htmlFor="policyMaxGasUsdInput" className="side-field-label">Max Tx Gas ($)</label>
                  <input
                    id="policyMaxGasUsdInput"
                    type="number"
                    min="0.01"
                    max="25"
                    step="0.05"
                    value={maxGasUsd}
                    onChange={(e) => setMaxGasUsd(Number(e.target.value))}
                    className="side-field-input font-mono font-bold"
                  />
                </div>
                <div className="side-field-row">
                  <label htmlFor="policySlippageBpsInput" className="side-field-label">Max Slippage (bps)</label>
                  <input
                    id="policySlippageBpsInput"
                    type="number"
                    min="5"
                    max="1000"
                    step="5"
                    value={slippageBps}
                    onChange={(e) => setSlippageBps(Number(e.target.value))}
                    className="side-field-input font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* 2. AI Retry Loop & Circuit Breakers (Labels Beside Inputs) */}
            <div className="space-y-3 pt-2">
              <h2 className="font-display text-sm font-bold uppercase tracking-wider font-mono text-blue-700">
                2. AI Retry Loop &amp; Circuit Breakers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="side-field-row">
                  <label htmlFor="policyCooldownInput" className="side-field-label">Loop Cooldown (s)</label>
                  <input
                    id="policyCooldownInput"
                    type="number"
                    min="4"
                    max="3600"
                    step="5"
                    value={loopCooldown}
                    onChange={(e) => setLoopCooldown(Number(e.target.value))}
                    className="side-field-input font-mono font-bold"
                  />
                </div>
                <div className="side-field-row">
                  <label htmlFor="policyMaxRevertsInput" className="side-field-label">Revert Limit</label>
                  <input
                    id="policyMaxRevertsInput"
                    type="number"
                    min="1"
                    max="20"
                    step="1"
                    value={maxReverts}
                    onChange={(e) => setMaxReverts(Number(e.target.value))}
                    className="side-field-input font-mono font-bold"
                  />
                </div>
                <div className="side-field-row">
                  <label htmlFor="policyRateLimitInput" className="side-field-label">Agent Rate (tx/m)</label>
                  <input
                    id="policyRateLimitInput"
                    type="number"
                    min="1"
                    max="5000"
                    step="10"
                    value={agentRateLimit}
                    onChange={(e) => setAgentRateLimit(Number(e.target.value))}
                    className="side-field-input font-mono font-bold"
                  />
                </div>
                <div className="side-field-row">
                  <label htmlFor="policyNonceModeSelect" className="side-field-label">Nonce Guard</label>
                  <select
                    id="policyNonceModeSelect"
                    value={nonceMode}
                    onChange={(e) => setNonceMode(e.target.value)}
                    className="side-field-input font-mono text-xs cursor-pointer"
                  >
                    <option value="STRICT">Strict Sequential</option>
                    <option value="PARALLEL">Parallel Sub-Keys</option>
                  </select>
                </div>
              </div>

              {/* 4 Policy Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <div className="text-xs font-bold text-slate-900">ArbSys L1 + L2 Gas Guard</div>
                    <div className="text-[11px] text-slate-500">Refuse tx if L1 blob fee spikes</div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={gasGuardOn}
                    onClick={() => setGasGuardOn(!gasGuardOn)}
                    className={`policy-toggle toggle-track ${gasGuardOn ? "is-on" : ""}`}
                  >
                    <span className="toggle-knob" />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Duplicate Calldata Blocker</div>
                    <div className="text-[11px] text-slate-500">Drop identical agent retries at $0 gas</div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={loopBlockOn}
                    onClick={() => setLoopBlockOn(!loopBlockOn)}
                    className={`policy-toggle toggle-track ${loopBlockOn ? "is-on" : ""}`}
                  >
                    <span className="toggle-knob" />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Block Infinite ERC-20 Approve</div>
                    <div className="text-[11px] text-slate-500">Refuse MaxUint256 token approvals</div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={infiniteApproveBlockOn}
                    onClick={() => setInfiniteApproveBlockOn(!infiniteApproveBlockOn)}
                    className={`policy-toggle toggle-track ${infiniteApproveBlockOn ? "is-on" : ""}`}
                  >
                    <span className="toggle-knob" />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Strict Contract Whitelist</div>
                    <div className="text-[11px] text-slate-500">Only allow verified stock-token pools</div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={strictWhitelistOn}
                    onClick={() => setStrictWhitelistOn(!strictWhitelistOn)}
                    className={`policy-toggle toggle-track ${strictWhitelistOn ? "is-on" : ""}`}
                  >
                    <span className="toggle-knob" />
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Whitelisted Pools */}
            <div className="space-y-3 pt-2">
              <h2 className="font-display text-sm font-bold uppercase tracking-wider font-mono text-blue-700">
                3. Whitelisted Robinhood Chain Contracts
              </h2>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="side-field-row flex-1">
                  <label htmlFor="newWhitelistLabelInput" className="side-field-label">Pool Address</label>
                  <input
                    id="newWhitelistLabelInput"
                    type="text"
                    value={newPoolInput}
                    onChange={(e) => setNewPoolInput(e.target.value)}
                    className="side-field-input side-field-input-wide font-mono text-xs"
                  />
                </div>
                <button
                  id="addWhitelistPoolBtn"
                  type="button"
                  onClick={handleAddPool}
                  className="popup-btn"
                >
                  Add Pool
                </button>
              </div>

              <div id="whitelistPoolsContainer" className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {whitelistPools.map((pool, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                  >
                    <div className="font-mono text-xs">
                      <div className="font-bold text-slate-900">{pool.name}</div>
                      <div className="text-[11px] text-slate-500">{pool.addr} · {pool.selectors}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePool(idx)}
                      className="popup-btn btn-sm text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-100">
              <button
                id="saveFirewallPageBtn"
                type="button"
                onClick={() =>
                  triggerSnackbar(
                    "Firewall",
                    `Committed $${hourlyBudget}/hr cap and ${loopCooldown}s loop guard to Nitro TEE.`
                  )
                }
                className="btn-primary-rounded"
              >
                Save
              </button>
              <Link href="/" className="popup-btn">
                Back
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REBATE PAYOUT WALLET (#editPage-rebates) */}
      {activeTab === "rebates" && (
        <div id="editPage-rebates" className="edit-page-pane bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">Wallet</h1>
            <p className="text-xs text-slate-500 mt-1">Destination wallet and settlement token for 90% rebates</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="side-field-row">
              <label htmlFor="editRebateWalletInput" className="side-field-label">Payout Wallet</label>
              <input
                id="editRebateWalletInput"
                type="text"
                value={payoutWallet}
                onChange={(e) => setPayoutWallet(e.target.value)}
                className="side-field-input side-field-input-wide font-mono"
              />
            </div>
            <div className="side-field-row">
              <label htmlFor="editRebateTokenInput" className="side-field-label">Token</label>
              <select
                id="editRebateTokenInput"
                value={payoutToken}
                onChange={(e) => setPayoutToken(e.target.value)}
                className="side-field-input cursor-pointer"
              >
                <option value="USDG">USDG (Stablecoin)</option>
                <option value="ETH">Native ETH</option>
                <option value="USDC">USDC</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              id="saveRebatesPageBtn"
              type="button"
              onClick={() => triggerSnackbar("Wallet", "Saved rebate payout address.")}
              className="btn-primary-rounded"
            >
              Save
            </button>
            <Link href="/" className="popup-btn">
              Back
            </Link>
          </div>
        </div>
      )}

      {/* TAB 5: PLANS SUBPAGE (#editPage-plans) */}
      {activeTab === "plans" && (
        <div id="editPage-plans" className="edit-page-pane space-y-8">
          <div className="bg-gradient-to-br from-blue-50 via-white to-sky-50 border border-blue-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono text-[11px] font-semibold">
                  Ravelin One
                </span>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                  Throughput Plans &amp; Benefits
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">Select any tier below or launch the visual benefits showcase</p>
              </div>
              <button
                type="button"
                onClick={() => openPlanShowcaseModal()}
                className="btn-primary-rounded"
              >
                Showcase
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "Free", price: "$0", units: "5M request units / 30d", btn: "Downgrade", isPro: false },
                { name: "Builder", price: "$29", units: "50M request units / 30d", btn: "Downgrade", isPro: false },
                { name: "Pro", price: "$199", units: "500M request units / 30d", btn: "Current Plan", isPro: true },
                { name: "Dedicated", price: "$999", units: "5B request units / 30d", btn: "Upgrade", isPro: false },
              ].map((tier) => (
                <div
                  key={tier.name}
                  className={`rounded-2xl p-5 flex flex-col justify-between space-y-4 ${
                    tier.isPro
                      ? "bg-white border-2 border-blue-600 shadow-md"
                      : "bg-white border border-slate-200"
                  }`}
                >
                  <div className="space-y-1.5">
                    {tier.isPro ? (
                      <div className="flex items-center justify-between">
                        <span className="font-display font-bold text-base text-blue-700">Pro</span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-semibold">Popular</span>
                      </div>
                    ) : (
                      <div className="font-display font-bold text-base text-slate-900">{tier.name}</div>
                    )}
                    <div className="font-mono text-2xl font-bold text-slate-900">{tier.price}</div>
                    <p className="text-xs text-slate-500">{tier.units}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openPlanShowcaseModal(tier.name)}
                    className={`w-full ${
                      tier.isPro ? "popup-btn is-active" : tier.btn === "Upgrade" ? "btn-primary-rounded" : "popup-btn"
                    }`}
                  >
                    {tier.btn}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 18-Feature Comparison Table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-slate-900">Plan Feature Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm sm:text-base">
                <thead>
                  <tr className="border-b-2 border-slate-200 bg-slate-50 font-display text-slate-900">
                    <th className="p-4 sm:p-5 w-2/5 font-bold">Capability</th>
                    <th className="p-4 sm:p-5 text-center font-bold">Free</th>
                    <th className="p-4 sm:p-5 text-center font-bold">Builder</th>
                    <th className="p-4 sm:p-5 text-center bg-blue-50/80 text-blue-800 font-bold">Pro</th>
                    <th className="p-4 sm:p-5 text-center font-bold">Dedicated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {PLAN_COMPARISON_ROWS.map((row) => (
                    <tr key={row.label} className="hover:bg-slate-50/90 transition-colors">
                      <td className="p-4 sm:p-5 font-semibold text-slate-900">{row.label}</td>
                      <td className="p-4 sm:p-5 text-center">{formatCellVal(row.free, false)}</td>
                      <td className="p-4 sm:p-5 text-center">{formatCellVal(row.builder, false)}</td>
                      <td className="p-4 sm:p-5 text-center bg-blue-50/40">{formatCellVal(row.pro, true)}</td>
                      <td className="p-4 sm:p-5 text-center">{formatCellVal(row.dedicated, false)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: BILLING & USAGE CONSOLE (#editPage-billing) */}
      {activeTab === "billing" && (
        <div id="editPage-billing" className="edit-page-pane space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            {/* Header: REMOVED "Plans" button beside "Deposit" */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono text-[11px] font-semibold">
                    Active Subscription
                  </span>
                  <span className="font-mono text-xs text-slate-500">Renews Nov 14, 2026</span>
                </div>
                <h1 id="billingCurrentPlanHeading" className="font-display text-2xl font-bold text-slate-900 mt-1">
                  {activePlan} Plan · $199 / 30 days
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Paid via Robinhood Chain USDG Escrow (Contract 0x77A1…39C0)
                </p>
              </div>

              {/* ONLY Deposit Button (Plans Button Removed per Request) */}
              <div>
                <button
                  id="topUpEscrowBtn"
                  type="button"
                  onClick={openDepositModal}
                  className="btn-primary-rounded"
                >
                  Deposit
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">Request Units (30d)</span>
                  <span className="font-mono font-bold text-blue-700">62.5%</span>
                </div>
                <div className="font-mono text-lg font-bold text-slate-900">
                  312.4M <span className="text-xs font-normal text-slate-500">/ 500M</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 w-[62.5%] rounded-full" />
                </div>
                <div className="text-[11px] font-mono text-slate-500">0 RUs charged on 1,480 refused loops</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">Peak Throughput (24h)</span>
                  <span className="font-mono font-bold text-slate-700">68.7%</span>
                </div>
                <div className="font-mono text-lg font-bold text-slate-900">
                  41,200 <span className="text-xs font-normal text-slate-500">/ 60k rpm</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 w-[68.7%] rounded-full" />
                </div>
                <div className="text-[11px] font-mono text-slate-500">0 throttled requests in last 30d</div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-blue-900">Rebates Earned (30d)</span>
                  <span className="font-mono font-bold text-emerald-700">172% Covered</span>
                </div>
                <div className="font-mono text-lg font-bold text-blue-950">
                  +$342.80 <span className="text-xs font-normal text-blue-700">USDG</span>
                </div>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  Your 90% backrun rebates exceeded your $199 plan cost by <strong>+$143.80</strong> this cycle.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-900">Request Unit Breakdown by Method</div>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">eth_call / eth_estimateGas</span>
                    <span className="font-semibold text-slate-900">184.0M RUs (58.9%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">eth_sendRawTransaction</span>
                    <span className="font-semibold text-slate-900">82.0M RUs (26.2%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">eth_subscribe / eth_getLogs</span>
                    <span className="font-semibold text-slate-900">46.4M RUs (14.9%)</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Auto-Scale Overage ($3 / 1M RUs)</div>
                    <div className="text-[11px] text-slate-500">Prevent hard-stop if monthly quota is reached</div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={autoScaleOverage}
                    onClick={() => setAutoScaleOverage(!autoScaleOverage)}
                    className={`policy-toggle toggle-track ${autoScaleOverage ? "is-on" : ""}`}
                  >
                    <span className="toggle-knob" />
                  </button>
                </div>
                <div className="side-field-row">
                  <label htmlFor="billingOverageCapInput" className="side-field-label">Overage Cap ($)</label>
                  <input
                    id="billingOverageCapInput"
                    type="number"
                    min="0"
                    max="10000"
                    step="25"
                    value={overageCap}
                    onChange={(e) => setOverageCap(Number(e.target.value))}
                    className="side-field-input font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* On-Chain Settlement History */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-base font-bold text-slate-900">On-Chain Settlement History</h2>
                <span id="escrowBalanceBadge" className="font-mono text-xs text-blue-700 font-semibold">
                  Escrow Balance: {escrowUsd.toFixed(2)} USDG
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Cycle Tier</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Block</th>
                      <th className="p-3 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 text-slate-700">Oct 15, 2026</td>
                      <td className="p-3 font-semibold text-slate-900">Pro (500M RUs)</td>
                      <td className="p-3 font-bold text-slate-900">199.00 USDG</td>
                      <td className="p-3 text-blue-700">#48,104,220</td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => triggerSnackbar("Receipt", "Verified on-chain settlement for Oct 15, 2026 · 199.00 USDG.")}
                          className="invoice-receipt-btn popup-btn btn-sm"
                        >
                          Proof
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700">Sep 15, 2026</td>
                      <td className="p-3 font-semibold text-slate-900">Pro (500M RUs)</td>
                      <td className="p-3 font-bold text-slate-900">199.00 USDG</td>
                      <td className="p-3 text-blue-700">#45,512,110</td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => triggerSnackbar("Receipt", "Verified on-chain settlement for Sep 15, 2026 · 199.00 USDG.")}
                          className="invoice-receipt-btn popup-btn btn-sm"
                        >
                          Proof
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                id="saveBillingPageBtn"
                type="button"
                onClick={() => triggerSnackbar("Billing", `Saved $${overageCap} USDG overage cap.`)}
                className="btn-primary-rounded"
              >
                Save
              </button>
              <Link href="/" className="popup-btn">
                Back
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Global Modals for Settings Page */}
      <DepositConfirmModal />
      <PlanShowcaseModal />
      <RazorpayModal />

      {/* Toast Snackbar */}
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

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400 font-mono text-xs">Loading Settings...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
