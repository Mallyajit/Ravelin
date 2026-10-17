//! Ravelin Wall — EVM-Native Stateful Verification Enclave
//! Target Network: Robinhood Chain (Arbitrum Orbit L2, Chain ID: 4663 / Testnet: 46630)
//! Block Cadence: 100ms | Precompile: ArbSys (0x0000000000000000000000000000000000000064)

use std::collections::{HashMap, HashSet};
use std::time::{SystemTime, UNIX_EPOCH};

pub const ROBINHOOD_MAINNET_CHAIN_ID: u64 = 4663;
pub const ROBINHOOD_TESTNET_CHAIN_ID: u64 = 46630;
pub const ARBSYS_PRECOMPILE: &str = "0x0000000000000000000000000000000000000064";

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum TriStateDecision {
    Allow {
        enclave_signature: String,
        paymaster_data: Option<String>,
        pcr0_attestation: String,
        total_gas_usd: f64,
    },
    Deny {
        rule_id: String,
        revert_string: String,
    },
    RequiresHumanSignature {
        rule_id: String,
        holding_pen_id: String,
        reason: String,
    },
}

#[derive(Debug, Clone)]
pub struct DecodedCalldata {
    pub to: String,
    pub value_wei: u128,
    pub value_usd: f64,
    pub method_id: String,
    pub calldata_hash: String,
    pub raw_calldata: String,
}

#[derive(Debug, Clone)]
pub struct ArbSysGasQuote {
    pub l2_execution_gas: u64,
    pub l2_base_fee_gwei: f64,
    pub l1_blob_data_bytes: usize,
    pub l1_blob_fee_wei: u128,
    pub total_fee_eth: f64,
    pub total_fee_usd: f64,
}

#[derive(Debug, Clone)]
pub struct AuditRecord {
    pub timestamp_ms: u64,
    pub calldata_hash: String,
    pub target_contract: String,
    pub method_id: String,
    pub gas_cost_usd: f64,
    pub notional_usd: f64,
    pub decision: String,
}

#[derive(Debug, Clone)]
pub struct PolicyConfig {
    pub chain_id: u64,
    pub hourly_budget_usd: f64,
    pub duplicate_cooldown_sec: u64,
    pub human_override_threshold_usd: f64,
    pub whitelisted_contracts: HashSet<String>,
    pub circuit_breaker_max_denies_per_min: usize,
    pub circuit_breaker_tripped: bool,
}

pub struct StatefulEnclaveEngine {
    pub policy: PolicyConfig,
    pub pcr0: String,
    pub pcr1: String,
    pub pcr2: String,
    pub records: Vec<AuditRecord>,
    pub last_seen_hash_ms: HashMap<String, u64>,
}

impl StatefulEnclaveEngine {
    pub fn new(policy: PolicyConfig) -> Self {
        Self {
            policy,
            pcr0: "8f9d2c4e7b1a093f6d5c8b2e4a1f0c9d3e7b6a5f4c2d1e0b9a8f7e6d5c4b3a21".to_string(),
            pcr1: "4a1b9e0d2c3f8a7b6e5d4c3b2a1908f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1".to_string(),
            pcr2: "c7e03f9a12d84b65e1098c7a6f5d4e3b2c1a09f8e7d6c5b4a3f2e1d0c9b8a765".to_string(),
            records: Vec::new(),
            last_seen_hash_ms: HashMap::new(),
        }
    }

    /// Simulates Arbitrum Orbit ArbSys (0x...0064) L2 execution + L1 Ethereum blob data fee
    pub fn simulate_arbsys_gas(&self, raw_calldata: &str, eth_price_usd: f64) -> ArbSysGasQuote {
        let byte_len = raw_calldata.trim_start_matches("0x").len() / 2;
        let l2_execution_gas: u64 = 48_000 + (byte_len as u64 * 16);
        let l2_base_fee_gwei: f64 = 0.05; // 100ms Robinhood Chain Orbit base fee
        let l2_fee_eth = (l2_execution_gas as f64 * l2_base_fee_gwei) / 1e9;

        // L1 Blob data availability cost via ArbSys.getCurrentTxL1GasFees()
        let l1_blob_fee_eth = (byte_len as f64 * 184.0) / 1e9;
        let total_fee_eth = l2_fee_eth + l1_blob_fee_eth;
        let total_fee_usd = total_fee_eth * eth_price_usd;

        ArbSysGasQuote {
            l2_execution_gas,
            l2_base_fee_gwei,
            l1_blob_data_bytes: byte_len,
            l1_blob_fee_wei: (l1_blob_fee_eth * 1e18) as u128,
            total_fee_eth,
            total_fee_usd,
        }
    }

    /// Evicts records older than longest cooldown rule + 60s buffer to preserve TEE RAM
    pub fn evict_expired_memory(&mut self, now_ms: u64) -> usize {
        let ttl_ms = (self.policy.duplicate_cooldown_sec + 60) * 1000;
        let before = self.records.len();
        self.records.retain(|r| now_ms.saturating_sub(r.timestamp_ms) <= ttl_ms);
        self.last_seen_hash_ms.retain(|_, ts| now_ms.saturating_sub(*ts) <= ttl_ms);
        before.saturating_sub(self.records.len())
    }

    /// Evaluates a proposed ERC-4337 UserOperation or eth_sendRawTransaction intent
    pub fn evaluate_intent(&mut self, decoded: &DecodedCalldata, eth_price_usd: f64) -> TriStateDecision {
        let now_ms = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_millis() as u64;

        self.evict_expired_memory(now_ms);

        // 0. Check global hard-stop circuit breaker
        if self.policy.circuit_breaker_tripped {
            return TriStateDecision::Deny {
                rule_id: "RULE_00_CIRCUIT_BREAKER_OPEN".to_string(),
                revert_string: "execution reverted: Ravelin Wall Circuit Breaker Tripped".to_string(),
            };
        }

        // 1. Check contract whitelist
        let target_norm = decoded.to.to_lowercase();
        if !self.policy.whitelisted_contracts.contains(&target_norm) {
            self.record_attempt(now_ms, decoded, 0.0, "DENY");
            self.check_circuit_breaker(now_ms);
            return TriStateDecision::Deny {
                rule_id: "RULE_07_TARGET_CONTRACT_NOT_WHITELISTED".to_string(),
                revert_string: "execution reverted: Ravelin Wall Target Contract Not Whitelisted".to_string(),
            };
        }

        // 2. Check stateful duplicate-calldata cooldown (loop detection)
        if let Some(prev_ms) = self.last_seen_hash_ms.get(&decoded.calldata_hash) {
            let elapsed_ms = now_ms.saturating_sub(*prev_ms);
            if elapsed_ms < self.policy.duplicate_cooldown_sec * 1000 {
                self.record_attempt(now_ms, decoded, 0.0, "DENY");
                self.check_circuit_breaker(now_ms);
                return TriStateDecision::Deny {
                    rule_id: "RULE_04_LOOP_DETECTED".to_string(),
                    revert_string: "execution reverted: Ravelin Wall Rate Limit (Duplicate Calldata Loop)".to_string(),
                };
            }
        }

        // 3. Calculate Arbitrum Nitro L2 + L1 Blob gas via ArbSys precompile simulation
        let gas_quote = self.simulate_arbsys_gas(&decoded.raw_calldata, eth_price_usd);
        let rolling_hour_spend: f64 = self
            .records
            .iter()
            .filter(|r| now_ms.saturating_sub(r.timestamp_ms) <= 3_600_000 && r.decision == "ALLOW")
            .map(|r| r.gas_cost_usd + r.notional_usd)
            .sum();

        // 4. Check human override threshold first for high-value RWA/Stock Token orders
        if decoded.value_usd >= self.policy.human_override_threshold_usd {
            self.last_seen_hash_ms.insert(decoded.calldata_hash.clone(), now_ms);
            self.record_attempt(now_ms, decoded, gas_quote.total_fee_usd, "REQUIRES_HUMAN_SIGNATURE");
            return TriStateDecision::RequiresHumanSignature {
                rule_id: "RULE_09_HUMAN_THRESHOLD_EXCEEDED".to_string(),
                holding_pen_id: format!("hp_{}", &decoded.calldata_hash[2..10]),
                reason: format!(
                    "Order notional ${:.2} exceeds human co-signature threshold (${:.2})",
                    decoded.value_usd, self.policy.human_override_threshold_usd
                ),
            };
        }

        // 5. Check hourly budget constraint (L2 gas + L1 blob fee + notional value)
        if rolling_hour_spend + gas_quote.total_fee_usd + decoded.value_usd > self.policy.hourly_budget_usd {
            self.record_attempt(now_ms, decoded, gas_quote.total_fee_usd, "DENY");
            self.check_circuit_breaker(now_ms);
            return TriStateDecision::Deny {
                rule_id: "RULE_02_HOURLY_BUDGET_EXCEEDED".to_string(),
                revert_string: "execution reverted: Ravelin Wall Hourly Budget Limit Exceeded".to_string(),
            };
        }

        // 6. ALLOW: Record state and sign inside enclave
        self.last_seen_hash_ms.insert(decoded.calldata_hash.clone(), now_ms);
        self.record_attempt(now_ms, decoded, gas_quote.total_fee_usd, "ALLOW");

        TriStateDecision::Allow {
            enclave_signature: format!("0x94f8a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e1b"),
            paymaster_data: Some("0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789000000000000000000000064".to_string()),
            pcr0_attestation: self.pcr0.clone(),
            total_gas_usd: gas_quote.total_fee_usd,
        }
    }

    fn record_attempt(&mut self, now_ms: u64, decoded: &DecodedCalldata, gas_usd: f64, decision: &str) {
        self.records.push(AuditRecord {
            timestamp_ms: now_ms,
            calldata_hash: decoded.calldata_hash.clone(),
            target_contract: decoded.to.clone(),
            method_id: decoded.method_id.clone(),
            gas_cost_usd: gas_usd,
            notional_usd: decoded.value_usd,
            decision: decision.to_string(),
        });
    }

    fn check_circuit_breaker(&mut self, now_ms: u64) {
        let recent_denies = self
            .records
            .iter()
            .filter(|r| now_ms.saturating_sub(r.timestamp_ms) <= 60_000 && r.decision == "DENY")
            .count();
        if recent_denies >= self.policy.circuit_breaker_max_denies_per_min {
            self.policy.circuit_breaker_tripped = true;
        }
    }
}
