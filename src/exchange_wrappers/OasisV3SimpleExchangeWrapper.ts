import web3Utils from 'web3-utils';
import BN from 'bn.js';
import {
  OasisV3Order,
} from '../types';
import { OasisV3SimpleExchangeWrapper as Contract } from '../../migrations/deployed.json';

export class OasisV3SimpleExchangeWrapper {
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

  public orderToBytes(order: OasisV3Order): number[] {
    return this.toBytes(order.id);
  }

  private toBytes(val: string | BN) {
    return web3Utils.hexToBytes(
      web3Utils.padLeft(web3Utils.toHex(val), 64, '0'),
    );
  }
}
