import { OpenDirectlyOrder } from '../types';
import { OpenDirectlyExchangeWrapper as Contract } from '../../migrations/deployed.json';

export class OpenDirectlyExchangeWrapper {
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

  public orderToBytes(order: OpenDirectlyOrder): string {
    if (!order) {
      throw new Error('no OpenDirectlyOrder');
    }
    return '0x';
  }
}
