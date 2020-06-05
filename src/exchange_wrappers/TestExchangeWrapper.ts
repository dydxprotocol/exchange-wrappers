import { TestOrder } from '../types';
import { allToBytes } from '../helpers/BytesHelper';
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

  public orderToBytes(order: TestOrder): string {
    return allToBytes(
      order.originator,
      order.makerToken,
      order.takerToken,
      order.makerAmount,
      order.takerAmount,
      order.allegedTakerAmount,
      order.desiredMakerAmount,
    );
  }
}
