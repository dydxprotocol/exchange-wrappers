import { ZeroExV2ExchangeWrapper } from './exchange_wrappers/ZeroExV2ExchangeWrapper';
import { OasisV1SimpleExchangeWrapper } from './exchange_wrappers/OasisV1SimpleExchangeWrapper';
import {
  Order,
  OrderType,
  OasisV1Order,
  ZeroExV2Order,
} from './types';

export class OrderMapper {
  private zeroExV2ExchangeWrapper: ZeroExV2ExchangeWrapper;
  private oasisV1SimpleExchangeWrapper: OasisV1SimpleExchangeWrapper;

  constructor(
    networkId: number,
  ) {
    this.zeroExV2ExchangeWrapper = new ZeroExV2ExchangeWrapper(networkId);
    this.oasisV1SimpleExchangeWrapper = new OasisV1SimpleExchangeWrapper(networkId);
  }

  public setNetworkId(
    networkId: number,
  ): void {
    this.zeroExV2ExchangeWrapper.setNetworkId(networkId);
    this.oasisV1SimpleExchangeWrapper.setNetworkId(networkId);
  }

  public mapOrder(order: Order): { bytes: number[], exchangeWrapperAddress: string } {
    const { type, ...orderData } = order;

    switch (type) {
      case OrderType.ZeroExV2:
        return {
          bytes: this.zeroExV2ExchangeWrapper.orderToBytes(orderData as ZeroExV2Order),
          exchangeWrapperAddress: this.zeroExV2ExchangeWrapper.getAddress(),
        };

      case OrderType.OasisV1:
        return {
          bytes: this.oasisV1SimpleExchangeWrapper.orderToBytes(
            orderData as OasisV1Order,
          ),
          exchangeWrapperAddress: this.oasisV1SimpleExchangeWrapper.getAddress(),
        };

      default:
        throw new Error(`Invalid order type ${type}`);
    }
  }
}
