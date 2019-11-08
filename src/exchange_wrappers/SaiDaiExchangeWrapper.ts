import {
  SaiDaiOrder,
} from '../types';
import { SaiDaiExchangeWrapper as Contract } from '../../migrations/deployed.json';

export class SaiDaiExchangeWrapper {
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

  public orderToBytes(order: SaiDaiOrder): number[] {
    if (!order) {
      throw new Error('no SaiDaiOrder');
    }
    return [];
  }
}
