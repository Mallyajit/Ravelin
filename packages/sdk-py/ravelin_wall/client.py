"""
ravelin-wall Python SDK for web3.py & LangChain / ElizaOS Autonomous Agents
Target: Robinhood Chain (Chain ID: 4663 / Testnet: 46630)
"""

from dataclasses import dataclass
from typing import Optional, Dict, Any
import time
import urllib.request
import json


class RavelinWallError(Exception):
    def __init__(self, rule_id: str, revert_string: str, calldata_hash: str = "0x0"):
        super().__init__(f"RavelinWallError: {rule_id} | {revert_string}")
        self.rule_id = rule_id
        self.revert_string = revert_string
        self.calldata_hash = calldata_hash


@dataclass
class RavelinClient:
    api_key: str
    enclave_url: str = "https://enclave.ravelinwall.io"
    chain_id: int = 4663
    agent_id: str = "agent-alpha-01"
    smart_account: str = "0x71C95911E9a5D330f4D621842EC243EE134389A2"

    def evaluate_and_send(self, tx: Dict[str, Any], reasoning: str = "") -> str:
        payload = json.dumps({
            "chainId": self.chain_id,
            "agentId": self.agent_id,
            "smartAccount": self.smart_account,
            "to": tx.get("to"),
            "data": tx.get("data", "0x"),
            "value": str(tx.get("value", 0)),
            "reasoning": reasoning,
        }).encode("utf-8")

        req = urllib.request.Request(
            f"{self.enclave_url}/v1/enclave/evaluate",
            data=payload,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.api_key}",
            },
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read().decode("utf-8"))

        state = result.get("state")
        if state == "ALLOW":
            return result["txHash"]
        if state == "DENY":
            raise RavelinWallError(
                rule_id=result.get("ruleId", "RULE_04_LOOP_DETECTED"),
                revert_string=result.get("revertMessage", "execution reverted: Ravelin Wall Rate Limit"),
                calldata_hash=result.get("calldataHash", "0x0"),
            )
        if state == "REQUIRES_HUMAN_SIGNATURE":
            return self._wait_for_human_signature(result["holdingPenId"])

        raise RuntimeError(f"Unknown enclave response state: {state}")

    def _wait_for_human_signature(self, holding_pen_id: str, timeout_sec: int = 300) -> str:
        deadline = time.time() + timeout_sec
        while time.time() < deadline:
            req = urllib.request.Request(
                f"{self.enclave_url}/v1/enclave/holding-pen/{holding_pen_id}",
                headers={"Authorization": f"Bearer {self.api_key}"},
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                status = json.loads(resp.read().decode("utf-8"))
            if status.get("resolution") == "APPROVED":
                return status["txHash"]
            if status.get("resolution") == "REJECTED":
                raise RavelinWallError(
                    "RULE_09_HUMAN_OPERATOR_REJECTED",
                    "execution reverted: Ravelin Wall Human Operator Rejected",
                    holding_pen_id,
                )
            time.sleep(1.5)
        raise RavelinWallError(
            "RULE_09_HUMAN_SIGNATURE_TIMEOUT",
            "execution reverted: Ravelin Wall Human Signature Timeout",
            holding_pen_id,
        )
