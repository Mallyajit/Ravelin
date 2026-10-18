import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    protocol: "Ravelin Network",
    chain_id: 4663,
    token_contract: "0xfe2f49a188b1c03d9a82b167",
    revenue_earned_usd: 18217.08,
    rvln_bought_back: 430215,
    last_buyback_tx: "0x0deb741e88a2c190c4029988f3",
  });
}
