-- Ravelin Wall Off-Enclave Telemetry & Observability Schema (ClickHouse)
-- Ingests scrubbed asynchronous enclave decision logs from Robinhood Chain (ID: 4663)

CREATE DATABASE IF NOT EXISTS ravelin_telemetry;

CREATE TABLE IF NOT EXISTS ravelin_telemetry.enclave_audit_logs
(
    event_id UUID DEFAULT generateUUIDv4(),
    timestamp_ms DateTime64(3, 'UTC'),
    chain_id UInt32 DEFAULT 4663,
    enclave_id LowCardinality(String),
    pcr0_hash FixedString(64),
    agent_id LowCardinality(String),
    smart_account FixedString(42),
    target_contract FixedString(42),
    target_symbol LowCardinality(String),
    method_id FixedString(10),
    decoded_signature String,
    calldata_keccak256 FixedString(66),
    l2_execution_gas UInt64,
    l1_blob_fee_wei UInt128,
    total_gas_usd Float64,
    notional_value_usd Float64,
    tri_state Enum8('ALLOW' = 1, 'DENY' = 2, 'REQUIRES_HUMAN_SIGNATURE' = 3),
    rule_triggered LowCardinality(String),
    revert_reason String,
    evaluation_latency_us UInt32
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp_ms)
ORDER BY (chain_id, agent_id, tri_state, timestamp_ms)
TTL toDateTime(timestamp_ms) + INTERVAL 90 DAY DELETE
SETTINGS index_granularity = 8192;

-- Materialized view for 1-minute deny spike detection (Circuit Breaker analytics)
CREATE MATERIALIZED VIEW IF NOT EXISTS ravelin_telemetry.mv_deny_spikes_per_minute
ENGINE = SummingMergeTree()
ORDER BY (agent_id, minute_bucket)
AS SELECT
    agent_id,
    toStartOfMinute(timestamp_ms) AS minute_bucket,
    countIf(tri_state = 'DENY') AS deny_count,
    countIf(tri_state = 'ALLOW') AS allow_count,
    countIf(tri_state = 'REQUIRES_HUMAN_SIGNATURE') AS human_queue_count
FROM ravelin_telemetry.enclave_audit_logs
GROUP BY agent_id, minute_bucket;
