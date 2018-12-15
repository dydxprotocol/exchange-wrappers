import web3Utils from 'web3-utils';
import BN from 'bn.js';
import BigNumber from 'bignumber.js';
import { ZeroExV2Order } from '../types';
import { ZeroExV2ExchangeWrapper as Contract } from '../../migrations/deployed.json';

export class ZeroExV2ExchangeWrapper {
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

  public orderToBytes(order: ZeroExV2Order): number[] {
    return []
      .concat(this.toBytes(order.makerAddress))
      .concat(this.toBytes(order.takerAddress))
      .concat(this.toBytes(order.feeRecipientAddress))
      .concat(this.toBytes(order.senderAddress))
      .concat(this.toBytes(order.makerAssetAmount))
      .concat(this.toBytes(order.takerAssetAmount))
      .concat(this.toBytes(order.makerFee))
      .concat(this.toBytes(order.takerFee))
      .concat(this.toBytes(order.expirationTimeSeconds))
      .concat(this.toBytes(order.salt))
      .concat(this.toBytes(order.signature));
  }

  private toBytes(val: string | BN | BigNumber) {
    return web3Utils.hexToBytes(
      web3Utils.padLeft(web3Utils.toHex(val), 64, '0'),
    );
  }
}
