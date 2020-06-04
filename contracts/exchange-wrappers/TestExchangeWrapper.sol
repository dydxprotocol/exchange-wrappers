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
    address public constant EXCHANGE_ADDRESS = address(0x1);

    // ============ Structs ============

    struct Order {
        address originator;
        address makerToken;
        address takerToken;
        uint256 makerAmount;
        uint256 takerAmount;
        uint256 allegedTakerAmount;
        uint256 desiredMakerAmount;
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
        require(
            order.takerAmount == requestedFillAmount,
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
            order.desiredMakerAmount == desiredMakerToken,
            "DesiredMakerAmount mismatch"
        );
        require(
            order.makerToken == makerToken,
            "MakerToken mismatch"
        );
        require(
            order.takerToken == takerToken,
            "TakerToken mismatch"
        );

        return order.allegedTakerAmount;
    }

    // ============ Private functions ============

    function parseData(
        bytes memory orderData
    )
        private
        pure
        returns (Order memory)
    {
        require(
            orderData.length == 224,
            "orderData invalid length"
        );

        Order memory order;

        /* solium-disable-next-line security/no-inline-assembly */
        assembly {
            mstore(order,           mload(add(orderData, 32)))  // originator
            mstore(add(order, 32),  mload(add(orderData, 64)))  // makerToken
            mstore(add(order, 64),  mload(add(orderData, 96)))  // takerToken
            mstore(add(order, 96),  mload(add(orderData, 128))) // makerAmount
            mstore(add(order, 128), mload(add(orderData, 160))) // takerAmount
            mstore(add(order, 160), mload(add(orderData, 192))) // allegedTakerAmount
            mstore(add(order, 192), mload(add(orderData, 224))) // desiredMakerAmount
        }

        return order;
    }
}
