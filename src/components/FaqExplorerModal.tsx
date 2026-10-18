"use client";

import React, { useState, useMemo } from "react";
import { useEnclave } from "@/context/EnclaveContext";

interface FaqItem {
  id: number;
  cat: "Architecture" | "Firewall" | "Rebates" | "Billing";
  pop: number;
  tech: number;
  rec: number;
  q: string;
  a: string;
}

const FAQ_DATABASE: FaqItem[] = [
  {
    id: 1,
    cat: "Architecture",
    pop: 99,
    tech: 95,
    rec: 9,
    q: "Can Ravelin read or frontrun my transactions inside the AWS Nitro Enclave?",
    a: "No. AWS Nitro Enclaves run with an isolated CPU/memory space and have no persistent storage, interactive shell, or external network stack. Your TLS connection terminates inside the enclave, and operators can verify the signed PCR0 attestation measurement before routing order flow.",
  },
  {
    id: 2,
    cat: "Firewall",
    pop: 97,
    tech: 92,
    rec: 10,
    q: "Why do AI trading agents get stuck in retry loops on Robinhood Chain?",
    a: "Because Robinhood Chain produces blocks every 100 ms, autonomous LLM and Python agents frequently re-submit identical swap calldata when an oracle tick or nonce lags. Without Ravelin’s 0.18 ms RocksDB calldata hash check, a looping agent can burn hundreds of dollars in L1+L2 revert gas in under a minute.",
  },
  {
    id: 3,
    cat: "Architecture",
    pop: 95,
    tech: 88,
    rec: 8,
    q: "What happens if Ravelin’s co-located Nitro node goes down?",
    a: "Our US-East load balancer health-checks the primary enclave every 50 ms and fails over to a warm standby Nitro instance in the same availability zone in under 150 ms. In @ravelin-wall/sdk, you can also configure whether your agent halts (fail-closed) or falls back to public RPC.",
  },
  {
    id: 4,
    cat: "Architecture",
    pop: 94,
    tech: 80,
    rec: 7,
    q: "Can I use MetaMask, Rabby, Viem, or Ethers without installing your SDK?",
    a: "Yes. https://rpc.ravelin.network is a standard EVM JSON-RPC endpoint for Robinhood Chain (Chain ID 4663). Any wallet or library works out of the box by setting your RPC URL and appending your API key.",
  },
  {
    id: 5,
    cat: "Rebates",
    pop: 92,
    tech: 85,
    rec: 6,
    q: "Do small retail swaps under $500 still earn the 90% backrun rebate?",
    a: "Only trades that move a stock-token pool’s price enough to create an arbitrage spread larger than the L2 gas fee (~$0.004) attract searcher bids in the 200 ms auction. Swaps under ~$250 rarely create backrun arbitrage, though they still get private mempool delivery and $0-gas revert protection.",
  },
  {
    id: 6,
    cat: "Billing",
    pop: 91,
    tech: 78,
    rec: 5,
    q: "How are Request Units (RUs) metered across subscription plans?",
    a: "Light reads (eth_blockNumber, eth_chainId) count as 10 RUs; state simulations and private sends (eth_call, eth_sendRawTransaction) count as 25 RUs; indexed log queries (eth_getLogs) count as 75 RUs. On Pro and Dedicated tiers, refused duplicate loops consume 0 RUs.",
  },
  {
    id: 7,
    cat: "Billing",
    pop: 89,
    tech: 82,
    rec: 4,
    q: "What happens if my bot hits 100% of its monthly Request Unit quota?",
    a: "In the Billing console, you can toggle Auto-Scale Overage ($3 per 1M extra RUs up to your custom USDG ceiling) so production bots never drop orders, or keep Hard-Stop enabled to cap costs at $0 overage.",
  },
  {
    id: 8,
    cat: "Firewall",
    pop: 88,
    tech: 98,
    rec: 3,
    q: "How does the ArbSys (0x...0064) precompile affect my hourly spend cap?",
    a: "Robinhood Chain (an Arbitrum Orbit L2) charges both an L2 execution fee and an L1 data posting fee. Ravelin queries ArbGasInfo / ArbSys 0x...0064 before broadcast so sudden L1 blob fee spikes cannot breach your hourly dollar cap.",
  },
  {
    id: 9,
    cat: "Firewall",
    pop: 86,
    tech: 84,
    rec: 2,
    q: "Why was my $15,000 order routed to the Holding Pen instead of executing?",
    a: "Orders exceeding your Holding Pen threshold (default $10,000) are paused in RocksDB state memory before reaching the sequencer. You can approve or drop them with one click in the Workbench or via a signed webhook.",
  },
  {
    id: 10,
    cat: "Rebates",
    pop: 84,
    tech: 86,
    rec: 1,
    q: "How can I verify that 100% of net protocol revenue buys $RVLN?",
    a: "Every open-market buyback swap is executed against the $RVLN contract (0xfe2f…b167) on Robinhood Chain and published in the On-Chain Audit Ledger with its block number and transaction hash.",
  },
];

export function FaqExplorerModal() {
  const { isFaqModalOpen, closeFaqModal } = useEnclave();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterTab, setFilterTab] = useState<"category" | "sort">("category");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "Architecture",
    "Firewall",
    "Rebates",
    "Billing",
  ]);
  const [sortBy, setSortBy] = useState<"popular" | "tech" | "recent">("popular");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const filteredItems = useMemo(() => {
    let items = FAQ_DATABASE.filter((item) => {
      const matchCat = selectedCategories.length === 0 || selectedCategories.includes(item.cat);
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.q.toLowerCase().includes(q) ||
        item.a.toLowerCase().includes(q) ||
        item.cat.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });

    items = [...items].sort((a, b) => {
      if (sortBy === "popular") return b.pop - a.pop;
      if (sortBy === "tech") return b.tech - a.tech;
      return b.rec - a.rec;
    });

    return items;
  }, [searchQuery, selectedCategories, sortBy]);

  if (!isFaqModalOpen) return null;

  return (
    <div
      id="faqExplorerModal"
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header: ONLY "Frequently Asked Questions" + Cross Icon */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between gap-4 bg-white">
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            Frequently Asked Questions
          </h3>
          <button
            id="closeFaqModalBtn"
            type="button"
            aria-label="Close"
            onClick={closeFaqModal}
            className="cross-icon-btn"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Search + Filter Button with 2-Column Popover */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 relative">
          <input
            id="faqSearchInput"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions..."
            className="flex-1 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600"
          />

          {/* Filter Trigger Button with Funnel Icon */}
          <div className="relative">
            <button
              id="faqFilterTriggerBtn"
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 bg-white hover:border-blue-600 text-xs sm:text-sm font-semibold text-slate-800 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <span>Filter</span>
            </button>

            {/* 2-Column Filter Popup Under Filter Button */}
            {isFilterOpen && (
              <div
                id="faqFilterPopover"
                className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-xl shadow-2xl p-3 z-50 grid grid-cols-12 gap-3"
              >
                {/* Left Column: Category and Sort Selector Tabs */}
                <div className="col-span-5 border-r border-slate-100 pr-2 space-y-1">
                  <button
                    type="button"
                    onClick={() => setFilterTab("category")}
                    className={`w-full px-3 py-2 text-left text-xs font-semibold rounded-lg transition-colors ${
                      filterTab === "category" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Category
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterTab("sort")}
                    className={`w-full px-3 py-2 text-left text-xs font-semibold rounded-lg transition-colors ${
                      filterTab === "sort" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Sort
                  </button>
                </div>

                {/* Right Column */}
                <div className="col-span-7 pl-1">
                  {filterTab === "category" ? (
                    <div className="space-y-2 py-1">
                      {(["Architecture", "Firewall", "Rebates", "Billing"] as const).map((cat) => (
                        <label
                          key={cat}
                          className="flex items-center gap-2.5 text-xs font-medium text-slate-700 hover:text-blue-700 cursor-pointer transition-transform hover:translate-x-1"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(cat)}
                            onChange={() => toggleCategory(cat)}
                            className="w-3.5 h-3.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                          />
                          <span>{cat}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-1.5 py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSortBy("popular");
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left text-xs py-1.5 px-2 rounded font-medium transition-transform hover:translate-x-1 cursor-pointer ${
                          sortBy === "popular" ? "text-blue-700 font-bold" : "text-slate-700 hover:text-blue-600"
                        }`}
                      >
                        Most Popular
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSortBy("tech");
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left text-xs py-1.5 px-2 rounded font-medium transition-transform hover:translate-x-1 cursor-pointer ${
                          sortBy === "tech" ? "text-blue-700 font-bold" : "text-slate-700 hover:text-blue-600"
                        }`}
                      >
                        Technical Depth
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSortBy("recent");
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left text-xs py-1.5 px-2 rounded font-medium transition-transform hover:translate-x-1 cursor-pointer ${
                          sortBy === "recent" ? "text-blue-700 font-bold" : "text-slate-700 hover:text-blue-600"
                        }`}
                      >
                        Recently Added
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Questions Accordion List */}
        <div id="faqModalList" className="p-6 overflow-y-auto space-y-3 flex-1 divide-y divide-slate-100">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No questions matched your filter or search query.
            </div>
          ) : (
            filteredItems.map((item) => {
              const isOpen = expandedId === item.id;
              return (
                <div key={item.id} className="pt-3 first:pt-0">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setExpandedId(isOpen ? null : item.id)}
                    className="w-full py-3 text-left flex items-start justify-between gap-4 font-display font-bold text-base sm:text-lg text-slate-900 hover:text-blue-700 transition-colors cursor-pointer"
                  >
                    <span>{item.q}</span>
                    <svg
                      className={`w-5 h-5 text-blue-600 shrink-0 mt-0.5 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
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

                  {isOpen && (
                    <div className="pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">
                            {item.cat}
                          </span>
                        </div>
                        <p>{item.a}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
