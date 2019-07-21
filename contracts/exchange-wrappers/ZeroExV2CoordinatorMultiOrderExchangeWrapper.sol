pragma solidity 0.5.9;
pragma experimental ABIEncoderV2;

import { SafeMath } from "openzeppelin-solidity/contracts/math/SafeMath.sol";
import { IExchange } from "../external/0x/v2/interfaces/IExchange.sol";
import { ICoordinatorCore } from "../external/0x/v2/interfaces/ICoordinatorCore.sol";
import { LibOrder } from "../external/0x/v2/libs/LibOrder.sol";
import { LibZeroExTransaction } from "../external/0x/v2/libs/LibZeroExTransaction.sol";
import { ExchangeWrapper } from "../interfaces/ExchangeWrapper.sol";
import { TokenInteract } from "../lib/TokenInteract.sol";
import { AdvancedTokenInteract } from "../lib/AdvancedTokenInteract.sol";

/**
 * @title ZeroExV2MultiOrderExchangeWrapper
 * @author 0x
 *
 * dYdX ExchangeWrapper to interface with 0x Version 2.1 Coordinator contract. Sends multiple orders at once. Assumes no
 * ZRX fees.
 */
contract ZeroExV2CoordinatorMultiOrderExchangeWrapper is
    LibOrder,
    LibZeroExTransaction,
    ExchangeWrapper
{
    using SafeMath for uint256;
    using TokenInteract for address;
    using AdvancedTokenInteract for address;

    // ============ Constants ============

    // bytes4(keccak256("isValidWalletSignature(bytes32,address,bytes)"))
    // The 0x Exchange v2.1 contract requires that this value is returned for a successful `Wallet` signature validation
    bytes4 constant IS_VALID_WALLET_SIGNATURE_MAGIC_VALUE = 0xb0671381;

    // Byte that represents the 0x Exchange v2.1 `Wallet` signature type
    bytes constant WALLET_SIGNATURE_TYPE = hex"04";

    // ============ Structs ============

    struct TokenAmounts {
        uint256 takerAmount;
        uint256 makerAmount;
    }

    struct CoordinatorArgs {
        Order[] orders;                           // orders for `marketSellOrdersNoThrow`
        bytes[] orderSignatures;                  // maker signatures for each order
        uint256 transactionSalt;                  // salt to facilitate randomness in ZeroExTransaction hash
        uint256[] approvalExpirationTimeSeconds;  // timestamps at which Coordinator approvals expire
        bytes[] approvalSignatures;               // signatures of Coordinators that approved the transaction
    }

    struct MakerTakerTokenBalances {
        uint256 makerTokenBalance;
        uint256 takerTokenBalance;
    }

    struct FillResults {
        uint256 makerTokenFilledAmount;
        uint256 takerTokenFilledAmount;
    }

    // ============ State Variables ============

    // address of the ZeroEx V2.1 Coordinator
    address public ZERO_EX_COORDINATOR;

    // address of the ZeroEx V2 ERC20Proxy
    address public ZERO_EX_TOKEN_PROXY;

    // ============ Constructor ============
    constructor(
        address zeroExCoordinator,
        address zeroExProxy
    )
        public
    {
        ZERO_EX_COORDINATOR = zeroExCoordinator;
        ZERO_EX_TOKEN_PROXY = zeroExProxy;
    }

    // ============ Public Functions ============

    /**
     * Exchange some amount of takerToken for makerToken.
     *
     * @param  receiver             Address to set allowance on once the trade has completed
     * @param  makerToken           Address of makerToken, the token to receive
     * @param  takerToken           Address of takerToken, the token to pay
     * @param  requestedFillAmount  Amount of takerToken being paid
     * @param  orderData            Arbitrary bytes data for any information to pass to the exchange
     * @return                      The amount of makerToken received
     */
    function exchange(
        address /* tradeOriginator */,
        address receiver,
        address makerToken,
        address takerToken,
        uint256 requestedFillAmount,
        bytes calldata orderData
    )
        external
        returns (uint256)
    {
        // Ensure that the ERC20Proxy can take the takerTokens from this contract
        takerToken.ensureAllowance(ZERO_EX_TOKEN_PROXY, requestedFillAmount);

        (TokenAmounts memory priceRatio, CoordinatorArgs memory args) = abi.decode(
            orderData,
            (TokenAmounts, CoordinatorArgs)
        );

        // Query initial balances of makerToken and takerToken
        // These should be 0 unless tokens were erroneously sent to this contract
        MakerTakerTokenBalances memory initialBalances = getMakerTakerTokenBalances(makerToken, takerToken);
    
        // Encode data for `marketSellOrdersNoThrow`
        bytes memory marketSellOrdersNoThrowData = abi.encodeWithSelector(
            IExchange(address(0)).marketSellOrdersNoThrow.selector,
            args.orders,
            requestedFillAmount,
            args.orderSignatures
        );

        // Construct ZeroExTransaction on behalf of this contract
        ZeroExTransaction memory transaction = ZeroExTransaction({
            salt: args.transactionSalt,
            data: marketSellOrdersNoThrowData,
            signerAddress: address(this)
        });

        // Call `marketSellOrdersNoThrow` through the Coordinator contract
        // Either succeeds or throws
        ICoordinatorCore(ZERO_EX_COORDINATOR).executeTransaction(
            transaction,
            tx.origin,
            WALLET_SIGNATURE_TYPE,
            args.approvalExpirationTimeSeconds,
            args.approvalSignatures
        );

        // Query balances after fill and calculate amounts filled
        FillResults memory fillResults = calculateFillResults(makerToken, takerToken, initialBalances);

        // Validate that all taker tokens were sold
        require(
            fillResults.takerTokenFilledAmount == requestedFillAmount,
            "ZeroExV2CoordinatorMultiOrderExchangeWrapper#exchange: Cannot sell enough taker token"
        );

        // Validate that max price is not violated
        validateTradePrice(
            priceRatio,
            fillResults.takerTokenFilledAmount,
            fillResults.makerTokenFilledAmount
        );

        // Ensure that the caller can take the makerTokens from this contract
        makerToken.ensureAllowance(receiver, fillResults.makerTokenFilledAmount);

        return fillResults.makerTokenFilledAmount;
    }

    /**
     * Get amount of takerToken required to buy a certain amount of makerToken for a given trade.
     * Should match the takerToken amount used in exchangeForAmount. If the order cannot provide
     * exactly desiredMakerToken, then it must return the price to buy the minimum amount greater
     * than desiredMakerToken
     *
     * @param  makerToken         Address of makerToken, the token to receive
     * @param  takerToken         Address of takerToken, the token to pay
     * @param  desiredMakerToken  Amount of makerToken requested
     * @param  orderData          Arbitrary bytes data for any information to pass to the exchange
     * @return                    Amount of takerToken the needed to complete the exchange
     */
    function getExchangeCost(
        address makerToken,
        address takerToken,
        uint256 desiredMakerToken,
        bytes calldata orderData
    )
        external
        view
        returns (uint256)
    {}

    /**
     * Used to validate `Wallet` signatures for this contract within the 0x Exchange contract.
     * This function will consider all hash and signature combinations as valid.
     * @return Magic value required for a successful `Wallet` signature validation in the 0x Exchange v2.1 contract. 
     */
    function isValidSignature(
        bytes32 /* hash */,
        bytes calldata /* signature */
    )
        external
        returns (bytes4)
    {
        // All signatures are always considered valid
        // This contract should never hold a balance, but value can be passed through
        return IS_VALID_WALLET_SIGNATURE_MAGIC_VALUE;
    }

    /**
     * Gets maker and taker token balances of this contract.
     */
    function getMakerTakerTokenBalances(
        address makerToken,
        address takerToken
    )
        private
        view
        returns (MakerTakerTokenBalances memory balances)
    {
        address exchangeWrapper = address(this);
        balances.makerTokenBalance = makerToken.balanceOf(exchangeWrapper);
        balances.takerTokenBalance = takerToken.balanceOf(exchangeWrapper);
        return balances;
    }

    /**
     * Calculates the fill results based off of the delta in current balances and initial balances
     * of the maker and taker tokens.
     */
    function calculateFillResults(
        address makerToken,
        address takerToken,
        MakerTakerTokenBalances memory initialBalances
    )
        private
        view
        returns (FillResults memory fillResults)
    {
        MakerTakerTokenBalances memory currentBalances = getMakerTakerTokenBalances(makerToken, takerToken);
        fillResults.makerTokenFilledAmount = currentBalances.makerTokenBalance.sub(initialBalances.makerTokenBalance);
        fillResults.takerTokenFilledAmount = currentBalances.takerTokenBalance.sub(initialBalances.takerTokenBalance);
        return fillResults;
    }

    /**
     * Validates that a certain takerAmount and makerAmount are within the maxPrice bounds
     */
    function validateTradePrice(
        TokenAmounts memory priceRatio,
        uint256 takerAmount,
        uint256 makerAmount
    )
        private
        pure
    {
        require(
            priceRatio.makerAmount == 0 ||
            takerAmount.mul(priceRatio.makerAmount) <= makerAmount.mul(priceRatio.takerAmount),
            "ZeroExV2CoordinatorMultiOrderExchangeWrapper#validateTradePrice: Price greater than maxPrice"
        );
    }
}