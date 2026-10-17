import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const notionalUsd = Number(body.notionalUsd ?? 140);
  const isDuplicateLoop = Boolean(body.isDuplicateLoop);

  if (isDuplicateLoop) {
    return NextResponse.json(
      {
        state: "DENY",
        ruleId: "RULE_04_LOOP_DETECTED",
        revertMessage: "execution reverted: Ravelin Wall Rate Limit (Duplicate Calldata Loop)",
        pcr0Attestation: "8f9d2c4e7b1a093f6d5c8b2e4a1f0c9d3e7b6a5f4c2d1e0b9a8f7e6d5c4b3a21",
        latencyMs: 9.2,
      },
      { status: 429 }
    );
  }

  if (notionalUsd >= 10000) {
    return NextResponse.json({
      state: "REQUIRES_HUMAN_SIGNATURE",
      ruleId: "RULE_09_HUMAN_THRESHOLD_EXCEEDED",
      holdingPenId: "HP-9041",
      pcr0Attestation: "8f9d2c4e7b1a093f6d5c8b2e4a1f0c9d3e7b6a5f4c2d1e0b9a8f7e6d5c4b3a21",
      latencyMs: 11.1,
    });
  }

  return NextResponse.json({
    state: "ALLOW",
    txHash: "0x3b8e91a4f7c2d0e1a5b6c7d8e9f0a1b2c3d4e5f60718293a4b5c6d7e8f9091a4",
    enclaveSignature: "0x94f8a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e1b",
    pcr0Attestation: "8f9d2c4e7b1a093f6d5c8b2e4a1f0c9d3e7b6a5f4c2d1e0b9a8f7e6d5c4b3a21",
    arbsysGasBreakdown: {
      l2ExecutionEth: "0.00005",
      l1BlobEth: "0.00014",
      totalUsd: 0.48,
    },
    latencyMs: 11.4,
  });
}
