import BigNumber from 'bignumber.js';
import { toBytes } from '../BytesHelper';
import { ZeroExV2MultiOrder } from '../types';
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

  public orderToBytes(multiOrder: ZeroExV2MultiOrder): number[] {
    let result = [];
    if (!multiOrder.maxPrice || new BigNumber(multiOrder.maxPrice).isZero()) {
      const zero = new BigNumber(0);
      result = result
        .concat(toBytes(zero))
        .concat(toBytes(zero));
    } else {
      const base = new BigNumber('1e18');
      const numerator = base.times(multiOrder.maxPrice).integerValue(BigNumber.ROUND_CEIL);
      result = result
        .concat(toBytes(numerator))
        .concat(toBytes(base));
    }
    for (let i = 0; i < multiOrder.orders.length; i += 1) {
      const order = multiOrder.orders[i];
      result = result
        .concat(toBytes(order.makerAddress))
        .concat(toBytes(order.takerAddress))
        .concat(toBytes(order.feeRecipientAddress))
        .concat(toBytes(order.senderAddress))
        .concat(toBytes(order.makerAssetAmount))
        .concat(toBytes(order.takerAssetAmount))
        .concat(toBytes(order.expirationTimeSeconds))
        .concat(toBytes(order.salt))
        .concat(toBytes(order.signature));
    }
    return result;
  }
}
