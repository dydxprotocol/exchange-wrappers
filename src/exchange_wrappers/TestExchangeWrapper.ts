import web3Utils from 'web3-utils';
import BN from 'bn.js';
import BigNumber from 'bignumber.js';
import { TestOrder } from '../types';
import { TestExchangeWrapper as Contract } from '../../migrations/deployed.json';

export class TestExchangeWrapper {
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

  public orderToBytes(order: TestOrder): number[] {
    return []
      .concat(this.toBytes(order.originator))
      .concat(this.toBytes(order.makerToken))
      .concat(this.toBytes(order.takerToken))
      .concat(this.toBytes(order.makerAmount))
      .concat(this.toBytes(order.takerAmount))
      .concat(this.toBytes(order.allegedTakerAmount))
      .concat(this.toBytes(order.desiredMakerAmount));
  }

  private toBytes(val: string | BN | BigNumber) {
    return web3Utils.hexToBytes(
      web3Utils.padLeft(web3Utils.toHex(val), 64, '0'),
    );
  }
}
