import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { CurveOrder } from '../types';
import { combineHexStrings } from '../helpers/BytesHelper';
import { CurveExchangeWrapper as Contract } from '../../migrations/deployed.json';

export class CurveExchangeWrapper {
  private networkId: number;

  constructor(
    networkId: number,
  ) {
    this.networkId = networkId;
  }

  public setNetworkId(
    networkId: number,
  ): void {
    this.networkId = networkId;
  }

  public getAddress(): string {
    return Contract[this.networkId.toString()].address;
  }

  public orderToBytes(order: CurveOrder): string {
    if (!order) {
      throw new Error('no CurveOrder');
    }
    const eachTradeRawData = order.trades.map(trade => ethers.utils.defaultAbiCoder.encode(
      [
        'address',
        'int128',
        'int128',
        'uint256',
        'bool',
      ],
      [
        trade.curveAddress,
        new BigNumber(trade.fromId).toFixed(),
        new BigNumber(trade.toId).toFixed(),
        new BigNumber(trade.fromAmount).toFixed(),
        trade.exchangeUnderlying,
      ],
    ));
    const preData =  ethers.utils.defaultAbiCoder.encode(
      [
        'uint256',
        'uint256', // location of bytes
        'uint256', // number of trades
      ],
      [
        new BigNumber(order.minToAmount).toFixed(),
        new BigNumber(64).toFixed(),
        new BigNumber(order.trades.length).toFixed(),
      ],
    );
    return combineHexStrings(preData, ...eachTradeRawData);
  }
}
