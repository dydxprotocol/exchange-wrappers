import BigNumber from 'bignumber.js';
import { toBytes } from '../BytesHelper';
import { OasisV3MarketOrder } from '../types';
import { OasisV3MatchingExchangeWrapper as Contract } from '../../migrations/deployed.json';

export class OasisV3MatchingExchangeWrapper {
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

  public orderToBytes(order: OasisV3MarketOrder): number[] {
    if (!order.maxPrice) {
      return [];
    }
    const price = new BigNumber(order.maxPrice);
    const priceDenominator = new BigNumber('1e18');
    const priceNumerator = price.times(priceDenominator).integerValue(BigNumber.ROUND_DOWN);
    return []
      .concat(toBytes(priceNumerator))
      .concat(toBytes(priceDenominator));
  }
}
