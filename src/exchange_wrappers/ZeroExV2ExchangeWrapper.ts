import { ZeroExV2Order } from '../types';
import { allToBytes } from '../helpers/BytesHelper';
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

  public orderToBytes(order: ZeroExV2Order): string {
    return allToBytes(
      order.makerAddress,
      order.takerAddress,
      order.feeRecipientAddress,
      order.senderAddress,
      order.makerAssetAmount,
      order.takerAssetAmount,
      order.makerFee,
      order.takerFee,
      order.expirationTimeSeconds,
      order.salt,
      order.signature,
    );
  }
}
