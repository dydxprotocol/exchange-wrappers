import { OasisV3Order } from '../types';
import { allToBytes } from '../helpers/BytesHelper';
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

  public orderToBytes(order: OasisV3Order): string {
    return allToBytes(order.id);
  }
}
