import { toBytes } from '../BytesHelper';
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
      .concat(toBytes(order.originator))
      .concat(toBytes(order.makerToken))
      .concat(toBytes(order.takerToken))
      .concat(toBytes(order.makerAmount))
      .concat(toBytes(order.takerAmount))
      .concat(toBytes(order.allegedTakerAmount))
      .concat(toBytes(order.desiredMakerAmount));
  }
}
