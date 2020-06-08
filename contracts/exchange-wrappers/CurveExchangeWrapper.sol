/*

    Copyright 2020 dYdX Trading Inc.

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

import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";
import { ICurve } from "../external/curve/ICurve.sol";
import { ExchangeWrapper } from "../interfaces/ExchangeWrapper.sol";
import { TokenInteract } from "../lib/TokenInteract.sol";


/**
 * @title CurveExchangeWrapper
 * @author dYdX
 *
 * dYdX ExchangeWrapper to interface with Curve.
 */
contract CurveExchangeWrapper is
    ExchangeWrapper
{
    using SafeMath for uint256;
    using TokenInteract for address;

    struct Trade {
        address curveAddress;
        int128 fromId;
        int128 toId;
        uint256 fromAmount;
        bool exchangeUnderlying;
    }

    // ============ Public Functions ============

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
        (
            uint256 minToAmount,
            Trade[] memory trades
        ) = abi.decode(orderData, (uint256, Trade[]));

        uint256 totalFromAmount = 0;

        for (uint256 i = 0; i < trades.length; i++) {
            Trade memory trade = trades[i];
            takerToken.approve(trade.curveAddress, trade.fromAmount);
            totalFromAmount = totalFromAmount.add(trade.fromAmount);

            if (trade.exchangeUnderlying) {
                ICurve(trade.curveAddress).exchange_underlying(
                    trade.fromId,
                    trade.toId,
                    trade.fromAmount,
                    0
                );
            } else {
                ICurve(trade.curveAddress).exchange(
                    trade.fromId,
                    trade.toId,
                    trade.fromAmount,
                    0
                );
            }
        }

        uint256 toAmount = makerToken.balanceOf(address(this));

        require(
             toAmount >= minToAmount,
            "minToAmount not satisfied"
        );
        require(
             totalFromAmount == requestedFillAmount,
            "totalFromAmount does not equal requestedFillAmount"
        );

        makerToken.approve(receiver, toAmount);

        return toAmount;
    }

    function getExchangeCost(
        address /* makerToken */,
        address /* takerToken */,
        uint256 /* desiredMakerToken */,
        bytes calldata /* orderData */
    )
        external
        view
        returns (uint256)
    {
        revert("getExchangeCost not implemented");
    }
}
