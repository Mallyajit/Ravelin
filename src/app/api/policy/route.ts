import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    chain_id: 4663,
    enclave_version: "1.4.2-nitro",
    arbsys_precompile: "0x0000000000000000000000000000000000000064",
    budget_constraint: { max_hourly_usd: 500.0, include_arbsys_l1_blob_fee: true },
    cooldown_timer: { duplicate_calldata_window_seconds: 60, rocksdb_eviction_ttl_seconds: 3660 },
    human_override_threshold: { notional_usd_trigger: 10000.0 },
  });
}
