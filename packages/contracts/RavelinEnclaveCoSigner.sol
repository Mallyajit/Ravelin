// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title RavelinEnclaveCoSigner
 * @notice ERC-4337 Smart Account Co-Signer & AWS Nitro PCR0 Attestation Verifier
 * @dev Deployed on Robinhood Chain (Arbitrum Orbit L2, Chain ID: 4663)
 */
interface IArbSys {
    function arbBlockNumber() external view returns (uint256);
    function getCurrentTxL1GasFees() external view returns (uint256);
}

contract RavelinEnclaveCoSigner {
    IArbSys public constant ARBSYS = IArbSys(0x0000000000000000000000000000000000000064);

    address public owner;
    address public enclaveSigningKey;
    bytes32 public expectedPcr0Hash;
    bool public circuitBreakerPaused;

    event EnclaveAttestationUpdated(address indexed newKey, bytes32 indexed pcr0Hash);
    event CircuitBreakerTriggered(address indexed triggeredBy, uint256 arbBlockNumber);
    event UserOpCoSigned(bytes32 indexed userOpHash, uint256 l1BlobFeeWei);

    error EnclavePausedByCircuitBreaker();
    error InvalidPcr0Attestation(bytes32 provided, bytes32 expected);
    error InvalidEnclaveSignature();

    modifier onlyOwner() {
        require(msg.sender == owner, "RavelinWall: caller is not owner");
        _;
    }

    constructor(address _enclaveKey, bytes32 _pcr0Hash) {
        owner = msg.sender;
        enclaveSigningKey = _enclaveKey;
        expectedPcr0Hash = _pcr0Hash;
    }

    function validateEnclaveCoSignature(
        bytes32 userOpHash,
        bytes32 providedPcr0,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external returns (bool) {
        if (circuitBreakerPaused) revert EnclavePausedByCircuitBreaker();
        if (providedPcr0 != expectedPcr0Hash) {
            revert InvalidPcr0Attestation(providedPcr0, expectedPcr0Hash);
        }

        bytes32 digest = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", userOpHash, providedPcr0));
        address recovered = ecrecover(digest, v, r, s);
        if (recovered != enclaveSigningKey || recovered == address(0)) {
            revert InvalidEnclaveSignature();
        }

        uint256 l1BlobFee = ARBSYS.getCurrentTxL1GasFees();
        emit UserOpCoSigned(userOpHash, l1BlobFee);
        return true;
    }

    function triggerEmergencyPause() external onlyOwner {
        circuitBreakerPaused = true;
        emit CircuitBreakerTriggered(msg.sender, ARBSYS.arbBlockNumber());
    }

    function rotateEnclaveAttestation(address _newKey, bytes32 _newPcr0) external onlyOwner {
        enclaveSigningKey = _newKey;
        expectedPcr0Hash = _newPcr0;
        circuitBreakerPaused = false;
        emit EnclaveAttestationUpdated(_newKey, _newPcr0);
    }
}
