import { OasisV2Order } from '../types';
import { allToBytes } from '../helpers/BytesHelper';
import { OasisV2SimpleExchangeWrapper as Contract } from '../../migrations/deployed.json';

export class OasisV2SimpleExchangeWrapper {
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

  public orderToBytes(order: OasisV2Order): string {
    return allToBytes(order.id);
  }
}
