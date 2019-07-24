import { toBytes } from '../BytesHelper';
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
      .concat(toBytes(order.makerAddress))
      .concat(toBytes(order.takerAddress))
      .concat(toBytes(order.feeRecipientAddress))
      .concat(toBytes(order.senderAddress))
      .concat(toBytes(order.makerAssetAmount))
      .concat(toBytes(order.takerAssetAmount))
      .concat(toBytes(order.makerFee))
      .concat(toBytes(order.takerFee))
      .concat(toBytes(order.expirationTimeSeconds))
      .concat(toBytes(order.salt))
      .concat(toBytes(order.signature));
  }
}
