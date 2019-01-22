import { ZeroExV2ExchangeWrapper } from './exchange_wrappers/ZeroExV2ExchangeWrapper';
import { OasisV1SimpleExchangeWrapper } from './exchange_wrappers/OasisV1SimpleExchangeWrapper';
import { TestExchangeWrapper } from './exchange_wrappers/TestExchangeWrapper';
import { OpenDirectlyExchangeWrapper } from './exchange_wrappers/OpenDirectlyExchangeWrapper';
import {
  Order,
  OrderType,
  TestOrder,
  OasisV1Order,
  ZeroExV2Order,
  OpenDirectlyOrder,
} from './types';

export class OrderMapper {
  private testExchangeWrapper: TestExchangeWrapper;
  private zeroExV2ExchangeWrapper: ZeroExV2ExchangeWrapper;
  private oasisV1SimpleExchangeWrapper: OasisV1SimpleExchangeWrapper;
  private openDirectlyExchangeWrapper: OpenDirectlyExchangeWrapper;

  constructor(
    networkId: number,
  ) {
    this.testExchangeWrapper = new TestExchangeWrapper(networkId);
    this.zeroExV2ExchangeWrapper = new ZeroExV2ExchangeWrapper(networkId);
    this.oasisV1SimpleExchangeWrapper = new OasisV1SimpleExchangeWrapper(networkId);
    this.openDirectlyExchangeWrapper = new OpenDirectlyExchangeWrapper(networkId);
  }

  public setNetworkId(
    networkId: number,
  ): void {
    this.testExchangeWrapper.setNetworkId(networkId);
    this.zeroExV2ExchangeWrapper.setNetworkId(networkId);
    this.oasisV1SimpleExchangeWrapper.setNetworkId(networkId);
    this.openDirectlyExchangeWrapper.setNetworkId(networkId);
  }

  public mapOrder(order: Order): { bytes: number[], exchangeWrapperAddress: string } {
    const { type, ...orderData } = order;

    switch (type) {
      case OrderType.Test:
        return {
          bytes: this.testExchangeWrapper.orderToBytes(orderData as TestOrder),
          exchangeWrapperAddress: this.testExchangeWrapper.getAddress(),
        };

      case OrderType.ZeroExV2:
        return {
          bytes: this.zeroExV2ExchangeWrapper.orderToBytes(orderData as ZeroExV2Order),
          exchangeWrapperAddress: this.zeroExV2ExchangeWrapper.getAddress(),
        };

      case OrderType.OasisV1:
        return {
          bytes: this.oasisV1SimpleExchangeWrapper.orderToBytes(orderData as OasisV1Order),
          exchangeWrapperAddress: this.oasisV1SimpleExchangeWrapper.getAddress(),
        };

      case OrderType.OpenDirectly:
        return {
          bytes: this.openDirectlyExchangeWrapper.orderToBytes(orderData as OpenDirectlyOrder),
          exchangeWrapperAddress: this.openDirectlyExchangeWrapper.getAddress(),
        };

      default:
        throw new Error(`Invalid order type ${type}`);
    }
  }
}
