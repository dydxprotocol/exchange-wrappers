import BigNumber from 'bignumber.js';
import { ZeroExV2MultiOrder } from '../types';
import { allToBytes } from '../helpers/BytesHelper';
import { ZeroExV2MultiOrderExchangeWrapper as Contract } from '../../migrations/deployed.json';

export class ZeroExV2MultiOrderExchangeWrapper {
  private networkId: number;

  constructor(
    networkId: number,
  ) {
    this.networkId = networkId;
  }

  public getAddress(): string {
    return Contract[this.networkId.toString()].address;
  }

  public setNetworkId(
    networkId: number,
  ): void {
    this.networkId = networkId;
  }

  public orderToBytes(multiOrder: ZeroExV2MultiOrder): string {
    const values: any[] = [];
    if (!multiOrder.maxPrice || new BigNumber(multiOrder.maxPrice).isZero()) {
      const zero = new BigNumber(0);
      values.push(zero);
      values.push(zero);
    } else {
      const base = new BigNumber('1e18');
      const numerator = base.times(multiOrder.maxPrice).integerValue(BigNumber.ROUND_CEIL);
      values.push(numerator);
      values.push(base);
    }
    for (let i = 0; i < multiOrder.orders.length; i += 1) {
      const order = multiOrder.orders[i];
      values.push(order.makerAddress);
      values.push(order.takerAddress);
      values.push(order.feeRecipientAddress);
      values.push(order.senderAddress);
      values.push(order.makerAssetAmount);
      values.push(order.takerAssetAmount);
      values.push(order.expirationTimeSeconds);
      values.push(order.salt);
      values.push(order.signature);
    }
    return allToBytes(...values);
  }
}
