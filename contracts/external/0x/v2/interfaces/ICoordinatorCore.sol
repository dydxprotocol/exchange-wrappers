pragma solidity ^0.5.9;
pragma experimental ABIEncoderV2;

import "../libs/LibZeroExTransaction.sol";


contract ICoordinatorCore {

    /// @dev Executes a 0x transaction that has been signed by the feeRecipients that correspond to each order in the transaction's Exchange calldata.
    /// @param transaction 0x transaction containing salt, signerAddress, and data.
    /// @param txOrigin Required signer of Ethereum transaction calling this function.
    /// @param transactionSignature Proof that the transaction has been signed by the signer.
    /// @param approvalExpirationTimeSeconds Array of expiration times in seconds for which each corresponding approval signature expires.
    /// @param approvalSignatures Array of signatures that correspond to the feeRecipients of each order in the transaction's Exchange calldata.
    function executeTransaction(
        LibZeroExTransaction.ZeroExTransaction memory transaction,
        address txOrigin,
        bytes memory transactionSignature,
        uint256[] memory approvalExpirationTimeSeconds,
        bytes[] memory approvalSignatures
    )
        public;
}