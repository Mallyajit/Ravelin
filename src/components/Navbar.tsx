"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEnclave } from "@/context/EnclaveContext";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    loggedIn,
    userName,
    userEmail,
    activePlan,
    walletAddress,
    logout,
    openLoginModal,
    openPlanShowcaseModal,
    openFaqModal,
    isLeftDrawerOpen,
    openLeftDrawer,
    closeLeftDrawer,
  } = useEnclave();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleScrollTo = (anchor: string) => {
    closeLeftDrawer();
    if (pathname === "/") {
      const el = document.getElementById(anchor);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(`/#${anchor}`);
    }
  };

  const handleSubpageNav = (tab: string) => {
    setIsProfileMenuOpen(false);
    closeLeftDrawer();
    router.push(`/settings?tab=${tab}`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* 3-Line Hamburger Trigger for Left Drawer */}
            <button
              id="openLeftDrawerBtn"
              type="button"
              aria-label="Open menu"
              onClick={openLeftDrawer}
              className="popup-btn btn-icon text-slate-700 hover:text-blue-700"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5 text-left focus:outline-none">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-display font-bold text-sm flex items-center justify-center">
                R
              </div>
              <div>
                <span className="font-display font-bold text-base tracking-tight text-slate-900">
                  Ravelin
                </span>
                <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[11px] font-medium">
                  Robinhood Chain · 4663
                </span>
              </div>
            </Link>
          </div>

          {/* Subpage Breadcrumb (Visible when navigating away from home page) */}
          {pathname !== "/" && (
            <div id="subpageBreadcrumb" className="flex items-center gap-2.5 text-xs">
              <button
                id="backToMainPageBtn"
                type="button"
                onClick={() => router.push("/")}
                className="popup-btn btn-sm"
              >
                Back
              </button>
              <span className="text-slate-300">/</span>
              <span id="currentSubpageTitle" className="font-semibold text-slate-800 capitalize">
                {pathname === "/settings"
                  ? "Settings"
                  : pathname === "/pricing"
                  ? "Pricing"
                  : pathname.replace("/", "")}
              </span>
            </div>
          )}

          {/* Right-Side Authentication State Container */}
          <div className="flex items-center gap-3">
            {!loggedIn ? (
              <button
                id="headerSignInBtn"
                type="button"
                onClick={openLoginModal}
                className="btn-primary-rounded"
              >
                Sign In
              </button>
            ) : (
              <div ref={profileMenuRef} className="relative">
                <button
                  id="profileMenuTriggerBtn"
                  type="button"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="popup-btn px-3 py-1.5 gap-2.5 rounded-full"
                >
                  <div className="relative">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-display font-bold text-xs flex items-center justify-center">
                      AC
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 ring-2 ring-white" />
                  </div>
                  <span className="font-semibold text-slate-800 text-xs hidden sm:inline">
                    Alex Chen
                  </span>
                  <svg className="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Top-Right Profile Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div
                    id="profileDropdownMenu"
                    className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-2xl py-1.5 z-50 divide-y divide-slate-100 text-xs animate-in fade-in zoom-in-95 duration-100"
                  >
                    <div className="px-4 py-2.5">
                      <div id="dropdownUserName" className="font-bold text-slate-900">
                        {userName}
                      </div>
                      <div id="dropdownUserEmail" className="text-slate-500 font-mono text-[11px] truncate">
                        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)} · {activePlan}
                      </div>
                    </div>
                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => handleSubpageNav("profile")}
                        className="w-full px-4 py-2 text-left hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium cursor-pointer"
                      >
                        Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSubpageNav("apikeys")}
                        className="w-full px-4 py-2 text-left hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium cursor-pointer"
                      >
                        API Keys
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSubpageNav("firewall")}
                        className="w-full px-4 py-2 text-left hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium cursor-pointer"
                      >
                        Firewall
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSubpageNav("rebates")}
                        className="w-full px-4 py-2 text-left hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium cursor-pointer"
                      >
                        Wallet
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSubpageNav("plans")}
                        className="w-full px-4 py-2 text-left hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium cursor-pointer"
                      >
                        Plans
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSubpageNav("billing")}
                        className="w-full px-4 py-2 text-left hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium cursor-pointer"
                      >
                        Billing
                      </button>
                    </div>
                    <div className="py-1">
                      {/* Clean "Sign Out" button with NO parenthetical text */}
                      <button
                        id="dropdownSignOutBtn"
                        type="button"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          logout();
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 font-medium cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Left 3-Line Menu Drawer (#leftMenuDrawer) */}
      <div
        id="leftMenuDrawer"
        aria-label="Main Menu"
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-slate-200 shadow-2xl transition-transform duration-300 flex flex-col justify-between p-6 overflow-y-auto ${
          isLeftDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-display font-bold text-base flex items-center justify-center">
                R
              </div>
              <div>
                <div className="font-display font-bold text-base text-slate-900 leading-none">
                  Ravelin
                </div>
                <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                  Chain ID 4663
                </div>
              </div>
            </div>
            <button
              id="closeLeftDrawerBtn"
              type="button"
              aria-label="Close menu"
              onClick={closeLeftDrawer}
              className="cross-icon-btn"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Under Explore: Exactly 5 Items (No duplicate Configuration section) */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-blue-600 font-semibold px-1">
              Explore
            </div>
            <button
              type="button"
              onClick={() => handleScrollTo("sec-workbench")}
              className="drawer-nav-btn popup-btn w-full justify-start px-4 text-xs font-semibold"
            >
              Simulator
            </button>
            <button
              type="button"
              onClick={() => handleScrollTo("sec-statecheck")}
              className="drawer-nav-btn popup-btn w-full justify-start px-4 text-xs font-semibold"
            >
              WASM Check
            </button>
            <button
              type="button"
              onClick={() => {
                closeLeftDrawer();
                openPlanShowcaseModal();
              }}
              className="drawer-nav-btn popup-btn w-full justify-start px-4 text-xs font-semibold"
            >
              Plans &amp; Billing
            </button>
            <button
              type="button"
              onClick={() => handleScrollTo("sec-docs")}
              className="drawer-nav-btn popup-btn w-full justify-start px-4 text-xs font-semibold"
            >
              SDK Quickstart
            </button>
            <button
              type="button"
              onClick={() => {
                closeLeftDrawer();
                openFaqModal();
              }}
              className="drawer-nav-btn popup-btn w-full justify-start px-4 text-xs font-semibold"
            >
              FAQs
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 space-y-2.5">
          <div id="drawerAuthStatus" className="text-xs text-slate-500 font-medium">
            {loggedIn ? `${userName} · ${activePlan}` : "Not Authenticated"}
          </div>
          <button
            id="drawerAuthActionBtn"
            type="button"
            onClick={() => {
              closeLeftDrawer();
              if (loggedIn) {
                openPlanShowcaseModal();
              } else {
                openLoginModal();
              }
            }}
            className="btn-primary-rounded w-full"
          >
            {loggedIn ? "Plans" : "Sign In"}
          </button>
        </div>
      </div>

      {/* Backdrop overlay for Left Drawer */}
      {isLeftDrawerOpen && (
        <div
          onClick={closeLeftDrawer}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-2xs transition-opacity duration-300"
        />
      )}
    </>
  );
}
