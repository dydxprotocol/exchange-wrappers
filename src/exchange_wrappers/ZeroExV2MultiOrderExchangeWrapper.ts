import web3Utils from 'web3-utils';
import BN from 'bn.js';
import BigNumber from 'bignumber.js';
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
        .concat(this.toBytes(zero))
        .concat(this.toBytes(zero));
    } else {
      const base = new BigNumber('1e18');
      const numerator = base.times(multiOrder.maxPrice).integerValue(BigNumber.ROUND_CEIL);
      result = result
        .concat(this.toBytes(numerator))
        .concat(this.toBytes(base));
    }
    for (let i = 0; i < multiOrder.orders.length; i += 1) {
      const order = multiOrder.orders[i];
      result = result
        .concat(this.toBytes(order.makerAddress))
        .concat(this.toBytes(order.takerAddress))
        .concat(this.toBytes(order.feeRecipientAddress))
        .concat(this.toBytes(order.senderAddress))
        .concat(this.toBytes(order.makerAssetAmount))
        .concat(this.toBytes(order.takerAssetAmount))
        .concat(this.toBytes(order.expirationTimeSeconds))
        .concat(this.toBytes(order.salt))
        .concat(this.toBytes(order.signature));
    }
    return result;
  }

  private toBytes(val: string | BN | BigNumber) {
    return web3Utils.hexToBytes(
      web3Utils.padLeft(web3Utils.toHex(val), 64, '0'),
    );
  }
}
