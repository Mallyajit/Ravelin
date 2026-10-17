import { NextResponse } from "next/server";

export async function GET() {
  const data = {
    chain_id: 4663,
    network: "Robinhood Chain",
    token: {
      address: "0xfe2f49a188b1c03d9a82b167",
      symbol: "RVLN",
      name: "Ravelin Network Token",
      total_supply: "100000000",
    },
    treasury: {
      address: "0x44A9e102f8c31029b77c3104",
      model: "100% Revenue Open-Market Buybacks",
    },
    metrics: {
      revenue_earned_usd: 18217.08,
      collected_onchain_usd: 18355.56,
      pending_batch_usd: 97.08,
      breakdown: {
        protection_fees_usd: 6173.25,
        rpc_plans_usd: 9816.0,
        request_overage_usd: 2227.83,
        backrun_auction_surplus_usd: 138.48,
      },
      rvln_bought_back_total: 430215,
      total_buyback_spent_usd: 18168.82,
      buyback_count: 5,
    },
    swaps: [
      {
        id: "BB-005",
        txHash: "0x0deb741e21b8c49988f31049219b28a994c8e1a2f07b44a9e102f8c31029b77c",
        timestamp: "2026-10-16T18:42:10Z",
        amountRvln: 168291,
        spentUsdg: 7120.4,
        avgPriceUsd: 0.04231,
        dex: "Robinhood Orbit DEX (UniV3 Pool 0.05%)",
        verified: true,
      },
      {
        id: "BB-004",
        txHash: "0x7a83c21f904b772210e419b28a994c8e1a2f07b44a9e102f8c31029b77c0892a",
        timestamp: "2026-10-12T14:15:22Z",
        amountRvln: 112400,
        spentUsdg: 4750.0,
        avgPriceUsd: 0.04226,
        dex: "Robinhood Orbit DEX (UniV3 Pool 0.05%)",
        verified: true,
      },
      {
        id: "BB-003",
        txHash: "0x44c19e8b12f9907741d219b28a994c8e1a2f07b44a9e102f8c31029b77c11f4d",
        timestamp: "2026-10-05T09:30:45Z",
        amountRvln: 84310,
        spentUsdg: 3560.12,
        avgPriceUsd: 0.04222,
        dex: "Robinhood Orbit DEX (UniV3 Pool 0.05%)",
        verified: true,
      },
      {
        id: "BB-002",
        txHash: "0x19f2a00b654e129931cc19b28a994c8e1a2f07b44a9e102f8c31029b77c88a10",
        timestamp: "2026-09-28T16:05:11Z",
        amountRvln: 42150,
        spentUsdg: 1780.0,
        avgPriceUsd: 0.04223,
        dex: "Robinhood Orbit DEX (UniV3 Pool 0.05%)",
        verified: true,
      },
      {
        id: "BB-001",
        txHash: "0x88b2f11a43d9026620da19b28a994c8e1a2f07b44a9e102f8c31029b77c44d01",
        timestamp: "2026-09-21T11:20:00Z",
        amountRvln: 23064,
        spentUsdg: 958.3,
        avgPriceUsd: 0.04155,
        dex: "Robinhood Orbit DEX (UniV3 Pool 0.05%)",
        verified: true,
      },
    ],
  };

  return NextResponse.json(data);
}
