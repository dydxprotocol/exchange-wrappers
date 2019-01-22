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

pragma solidity 0.5.1;

import { ExchangeWrapper } from "../interfaces/ExchangeWrapper.sol";
import { TokenInteract } from "../lib/TokenInteract.sol";


/**
 * @title TestExchangeWrapper
 * @author dYdX
 *
 * An ExchangeWrapper for testing
 */
contract TestExchangeWrapper is
    ExchangeWrapper
{
    using TokenInteract for address;

    // ============ Constants ============

    // arbitrary address to send the tokens to (they are burned)
    address constant EXCHANGE_ADDRESS = address(0x1);

    // ============ Structs ============

    struct Order {
        address originator;
        address makerToken;
        address takerToken;
        uint256 makerAmount;
        uint256 takerAmount;
    }

    // ============ ExchangeWrapper functions ============

    function exchange(
        address tradeOriginator,
        address receiver,
        address makerToken,
        address takerToken,
        uint256 requestedFillAmount,
        bytes calldata orderData
    )
        external
        returns (uint256)
    {
        Order memory order = parseData(orderData);

        require(
            order.originator == tradeOriginator,
            "Originator mismatch"
        );
        require(
            order.makerToken == makerToken,
            "MakerToken mismatch"
        );
        require(
            order.takerToken == takerToken,
            "TakerToken mismatch"
        );

        takerToken.transfer(EXCHANGE_ADDRESS, requestedFillAmount);
        makerToken.approve(receiver, order.makerAmount);

        return order.makerAmount;
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
        Order memory order = parseData(orderData);

        require(
            order.makerAmount == desiredMakerToken,
            "MakerAmount mismatch"
        );
        require(
            order.makerToken == makerToken,
            "MakerToken mismatch"
        );
        require(
            order.takerToken == takerToken,
            "TakerToken mismatch"
        );

        return order.takerAmount;
    }

    // ============ Private functions ============

    function parseData(
        bytes memory data
    )
        private
        pure
        returns (Order memory)
    {
        require(
            data.length == 160,
            "Exchange data invalid length"
        );

        uint256 makerToken;
        uint256 takerToken;
        uint256 originator;
        uint256 makerAmount;
        uint256 takerAmount;

        /* solium-disable-next-line security/no-inline-assembly */
        assembly {
            originator := mload(add(data, 32))
            makerToken := mload(add(data, 64))
            takerToken := mload(add(data, 92))
            makerAmount := mload(add(data, 128))
            takerAmount := mload(add(data, 160))
        }

        return Order({
            originator: address(originator),
            makerToken: address(makerToken),
            takerToken: address(takerToken),
            makerAmount: makerAmount,
            takerAmount: takerAmount
        });
    }
}
