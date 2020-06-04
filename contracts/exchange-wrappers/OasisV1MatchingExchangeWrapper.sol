/*

    Copyright 2018 dYdX Trading Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

*/

pragma solidity 0.5.16;
pragma experimental ABIEncoderV2;

import { SafeMath } from "openzeppelin-solidity/contracts/math/SafeMath.sol";
import { IMatchingMarketV1 } from "../external/Maker/OasisV1/IMatchingMarketV1.sol";
import { ExchangeReader } from "../interfaces/ExchangeReader.sol";
import { ExchangeWrapper } from "../interfaces/ExchangeWrapper.sol";
import { AdvancedTokenInteract } from "../lib/AdvancedTokenInteract.sol";
import { TokenInteract } from "../lib/TokenInteract.sol";


/**
 * @title OasisV1MatchingExchangeWrapper
 * @author dYdX
 *
 * dYdX ExchangeWrapper to interface with Maker's MatchingMarket contract (Oasis exchange)
 */
contract OasisV1MatchingExchangeWrapper is
    ExchangeWrapper,
    ExchangeReader
{
    using SafeMath for uint256;
    using TokenInteract for address;
    using AdvancedTokenInteract for address;

    // ============ Structs ============

    struct Offer {
        uint256 makerAmount;
        address makerToken;
        uint256 takerAmount;
        address takerToken;
    }

    // ============ State Variables ============

    address public MATCHING_MARKET;

    // ============ Constructor ============

    constructor(
        address matchingMarket
    )
        public
    {
        MATCHING_MARKET = matchingMarket;
    }

    // ============ Public Functions ============

    function exchange(
        address /*tradeOriginator*/,
        address receiver,
        address makerToken,
        address takerToken,
        uint256 requestedFillAmount,
        bytes calldata orderData
    )
        external
        returns (uint256)
    {
        IMatchingMarketV1 market = IMatchingMarketV1(MATCHING_MARKET);

        // make sure that the exchange can take the tokens from this contract
        takerToken.ensureAllowance(address(market), requestedFillAmount);

        // do the exchange
        uint256 receivedMakerAmount = market.sellAllAmount(
            takerToken,
            requestedFillAmount,
            makerToken,
            0
        );

        // validate results
        requireBelowMaximumPrice(requestedFillAmount, receivedMakerAmount, orderData);

        // set allowance for the receiver
        makerToken.ensureAllowance(receiver, receivedMakerAmount);

        return receivedMakerAmount;
    }

    function getExchangeCost(
        address makerToken,
        address takerToken,
        uint256 desiredMakerToken,
        bytes calldata orderData
    )
        external
        view
        returns (uint256)
    {
        IMatchingMarketV1 market = IMatchingMarketV1(MATCHING_MARKET);

        uint256 costInTakerToken = market.getPayAmount(
            takerToken,
            makerToken,
            desiredMakerToken
        );

        requireBelowMaximumPrice(costInTakerToken, desiredMakerToken, orderData);

        return costInTakerToken;
    }

    function getMaxMakerAmount(
        address makerToken,
        address takerToken,
        bytes calldata orderData
    )
        external
        view
        returns (uint256)
    {
        (uint256 takerAmountRatio, uint256 makerAmountRatio) = getMaximumPrice(orderData);
        require(
            makerAmountRatio > 0,
            "OasisV1MatchingExchangeWrapper#getMaxMakerAmount: No maximum price given"
        );

        IMatchingMarketV1 market = IMatchingMarketV1(MATCHING_MARKET);
        uint256 offerId = market.getBestOffer(makerToken, takerToken);
        uint256 totalMakerAmount = 0;

        while (offerId != 0) {
            // get the offer info
            Offer memory offer = getOffer(market, offerId);

            assert(makerToken == offer.makerToken);
            assert(takerToken == offer.takerToken);

            // decide whether the offer satisfies the price ratio provided
            if (offer.makerAmount.mul(takerAmountRatio) < offer.takerAmount.mul(makerAmountRatio)) {
                break;
            } else {
                totalMakerAmount = totalMakerAmount.add(offer.makerAmount);
            }
            offerId = market.getWorseOffer(offerId);
        }

        return totalMakerAmount;
    }

    // ============ Private Functions ============

    function requireBelowMaximumPrice(
        uint256 takerAmount,
        uint256 makerAmount,
        bytes memory orderData
    )
        private
        pure
    {
        (uint256 takerAmountRatio, uint256 makerAmountRatio) = getMaximumPrice(orderData);
        if (takerAmountRatio > 0 || makerAmountRatio > 0) {
            // all amounts have previously been required to fit within 128 bits each
            require(
                takerAmount.mul(makerAmountRatio) <= makerAmount.mul(takerAmountRatio),
                "OasisV1MatchingExchangeWrapper:#requireBelowMaximumPrice: price is too high"
            );
        }
    }

    function getOffer(
        IMatchingMarketV1 market,
        uint256 offerId
    )
        private
        view
        returns (Offer memory)
    {
        (
            uint256 offerMakerAmount,
            address offerMakerToken,
            uint256 offerTakerAmount,
            address offerTakerToken
        ) = market.getOffer(offerId);

        return Offer({
            makerAmount: offerMakerAmount,
            makerToken: offerMakerToken,
            takerAmount: offerTakerAmount,
            takerToken: offerTakerToken
        });
    }

    // ============ Parsing Functions ============

    function getMaximumPrice(
        bytes memory orderData
    )
        private
        pure
        returns (uint256, uint256)
    {
        uint256 takerAmountRatio = 0;
        uint256 makerAmountRatio = 0;

        if (orderData.length > 0) {
            require(
                orderData.length == 64,
                "OasisV1MatchingExchangeWrapper:#getMaximumPrice: orderData is not the right length"
            );

            /* solium-disable-next-line security/no-inline-assembly */
            assembly {
                takerAmountRatio := mload(add(orderData, 32))
                makerAmountRatio := mload(add(orderData, 64))
            }

            // require numbers to fit within 128 bits to prevent overflow when checking bounds
            require(
                uint128(takerAmountRatio) == takerAmountRatio,
                "OasisV1MatchingExchangeWrapper:#getMaximumPrice: takerAmountRatio > 128 bits"
            );
            require(
                uint128(makerAmountRatio) == makerAmountRatio,
                "OasisV1MatchingExchangeWrapper:#getMaximumPrice: makerAmountRatio > 128 bits"
            );

            // since this is a price ratio, the denominator cannot be zero
            require(
                makerAmountRatio > 0,
                "OasisV1MatchingExchangeWrapper:#getMaximumPrice: makerAmountRatio cannot be zero"
            );
        }

        return (takerAmountRatio, makerAmountRatio);
    }
}
