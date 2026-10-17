/**
 * @ravelin-wall/sdk
 * Deterministic TEE Firewall & ERC-4337 Co-Signer SDK for Robinhood Chain (Chain ID: 4663)
 * Compatible with viem, ethers.js, LangChain, and ElizaOS agents.
 */

export type RavelinTriState = 'ALLOW' | 'DENY' | 'REQUIRES_HUMAN_SIGNATURE';

export interface RavelinConfig {
  apiKey: string;
  enclaveEndpoint: string;
  chainId?: 4663 | 46630;
  agentId: string;
  smartAccountAddress: `0x${string}`;
  sponsorGasPaymaster?: boolean;
  humanOverrideTimeoutMs?: number;
}

export interface UserOperationIntent {
  to: `0x${string}`;
  data: `0x${string}`;
  value?: bigint;
  agentReasoningContext?: string;
}

export interface RavelinEvaluationResult {
  state: RavelinTriState;
  txHash?: `0x${string}`;
  userOpHash?: `0x${string}`;
  enclaveSignature?: `0x${string}`;
  pcr0Attestation: string;
  latencyMs: number;
  arbsysGasBreakdown: {
    l2ExecutionEth: string;
    l1BlobEth: string;
    totalUsd: number;
  };
  ruleId?: string;
  revertMessage?: string;
  holdingPenId?: string;
}

export class RavelinWallError extends Error {
  public readonly code: string;
  public readonly revertString: string;
  public readonly calldataHash: string;

  constructor(code: string, revertString: string, calldataHash: string) {
    super(`RavelinWallError: ${code} — ${revertString}`);
    this.name = 'RavelinWallError';
    this.code = code;
    this.revertString = revertString;
    this.calldataHash = calldataHash;
  }
}

export class RavelinWallClient {
  private readonly config: Required<RavelinConfig>;

  constructor(config: RavelinConfig) {
    this.config = {
      chainId: 4663,
      sponsorGasPaymaster: true,
      humanOverrideTimeoutMs: 300_000,
      ...config,
    };
  }

  /**
   * Wraps an existing viem WalletClient or ethers Signer to intercept eth_sendRawTransaction
   * and route ERC-4337 UserOperations through the Ravelin Wall AWS Nitro Enclave.
   */
  public wrap<T extends Record<string, any>>(walletClient: T): T & { ravelin: RavelinWallClient } {
    const self = this;
    return new Proxy(walletClient, {
      get(target, prop, receiver) {
        if (prop === 'avelin' || prop === 'ravelin') return self;
        if (prop === 'sendTransaction' || prop === 'sendUserOperation') {
          return async (txRequest: UserOperationIntent) => {
            return self.interceptAndEvaluate(txRequest);
          };
        }
        return Reflect.get(target, prop, receiver);
      },
    }) as T & { ravelin: RavelinWallClient };
  }

  public async interceptAndEvaluate(intent: UserOperationIntent): Promise<`0x${string}`> {
    const response = await fetch(`${this.config.enclaveEndpoint}/v1/enclave/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        'X-Ravelin-Chain-Id': String(this.config.chainId),
        'X-Ravelin-Agent-Id': this.config.agentId,
      },
      body: JSON.stringify({
        smartAccount: this.config.smartAccountAddress,
        to: intent.to,
        data: intent.data,
        value: (intent.value ?? 0n).toString(),
        sponsorGas: this.config.sponsorGasPaymaster,
        reasoning: intent.agentReasoningContext ?? '',
      }),
    });

    const result: RavelinEvaluationResult = await response.json();

    if (result.state === 'ALLOW' && result.txHash) {
      return result.txHash;
    }

    if (result.state === 'DENY') {
      throw new RavelinWallError(
        result.ruleId ?? 'RULE_UNKNOWN_DENY',
        result.revertMessage ?? 'execution reverted: Ravelin Wall Policy Violation',
        result.userOpHash ?? '0x0'
      );
    }

    if (result.state === 'REQUIRES_HUMAN_SIGNATURE' && result.holdingPenId) {
      return this.awaitHumanCoSignature(result.holdingPenId);
    }

    throw new Error('Unexpected Ravelin Wall enclave state response.');
  }

  private async awaitHumanCoSignature(holdingPenId: string): Promise<`0x${string}`> {
    const started = Date.now();
    while (Date.now() - started < this.config.humanOverrideTimeoutMs) {
      const poll = await fetch(
        `${this.config.enclaveEndpoint}/v1/enclave/holding-pen/${holdingPenId}`,
        { headers: { 'Authorization': `Bearer ${this.config.apiKey}` } }
      );
      const status = await poll.json();
      if (status.resolution === 'APPROVED' && status.txHash) {
        return status.txHash as `0x${string}`;
      }
      if (status.resolution === 'REJECTED') {
        throw new RavelinWallError(
          'RULE_09_HUMAN_OPERATOR_REJECTED',
          'execution reverted: Ravelin Wall Human Operator Rejected Transaction',
          holdingPenId
        );
      }
      await new Promise((r) => setTimeout(r, 1500));
    }
    throw new RavelinWallError(
      'RULE_09_HUMAN_SIGNATURE_TIMEOUT',
      'execution reverted: Ravelin Wall Human Override Timed Out',
      holdingPenId
    );
  }
}
