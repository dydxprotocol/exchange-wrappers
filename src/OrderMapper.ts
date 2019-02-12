import { ZeroExV2ExchangeWrapper } from './exchange_wrappers/ZeroExV2ExchangeWrapper';
import { OasisV1SimpleExchangeWrapper } from './exchange_wrappers/OasisV1SimpleExchangeWrapper';
import { OasisV2SimpleExchangeWrapper } from './exchange_wrappers/OasisV2SimpleExchangeWrapper';
import { OasisV3SimpleExchangeWrapper } from './exchange_wrappers/OasisV3SimpleExchangeWrapper';
import { TestExchangeWrapper } from './exchange_wrappers/TestExchangeWrapper';
import { OpenDirectlyExchangeWrapper } from './exchange_wrappers/OpenDirectlyExchangeWrapper';
import {
  Order,
  OrderType,
  TestOrder,
  OasisV1Order,
  OasisV2Order,
  OasisV3Order,
  ZeroExV2Order,
  OpenDirectlyOrder,
} from './types';

export class OrderMapper {
  private testExchangeWrapper: TestExchangeWrapper;
  private zeroExV2ExchangeWrapper: ZeroExV2ExchangeWrapper;
  private oasisV1SimpleExchangeWrapper: OasisV1SimpleExchangeWrapper;
  private oasisV2SimpleExchangeWrapper: OasisV2SimpleExchangeWrapper;
  private oasisV3SimpleExchangeWrapper: OasisV3SimpleExchangeWrapper;
  private openDirectlyExchangeWrapper: OpenDirectlyExchangeWrapper;

  constructor(
    networkId: number,
  ) {
    this.testExchangeWrapper = new TestExchangeWrapper(networkId);
    this.zeroExV2ExchangeWrapper = new ZeroExV2ExchangeWrapper(networkId);
    this.oasisV1SimpleExchangeWrapper = new OasisV1SimpleExchangeWrapper(networkId);
    this.oasisV2SimpleExchangeWrapper = new OasisV2SimpleExchangeWrapper(networkId);
    this.oasisV3SimpleExchangeWrapper = new OasisV3SimpleExchangeWrapper(networkId);
    this.openDirectlyExchangeWrapper = new OpenDirectlyExchangeWrapper(networkId);
  }

  public setNetworkId(
    networkId: number,
  ): void {
    this.testExchangeWrapper.setNetworkId(networkId);
    this.zeroExV2ExchangeWrapper.setNetworkId(networkId);
    this.oasisV1SimpleExchangeWrapper.setNetworkId(networkId);
    this.oasisV2SimpleExchangeWrapper.setNetworkId(networkId);
    this.oasisV3SimpleExchangeWrapper.setNetworkId(networkId);
    this.openDirectlyExchangeWrapper.setNetworkId(networkId);
  }

  public mapOrder(order: Order): { bytes: number[], exchangeWrapperAddress: string } {
    const { type, ...orderData } = order;

    switch (type) {
      case OrderType.Test:
        return {
          bytes: this.testExchangeWrapper.orderToBytes(orderData as TestOrder),
          exchangeWrapperAddress: order.exchangeWrapperAddress ||
            this.testExchangeWrapper.getAddress(),
        };

      case OrderType.ZeroExV2:
        return {
          bytes: this.zeroExV2ExchangeWrapper.orderToBytes(orderData as ZeroExV2Order),
          exchangeWrapperAddress: order.exchangeWrapperAddress ||
            this.zeroExV2ExchangeWrapper.getAddress(),
        };

      case OrderType.OasisV1:
        return {
          bytes: this.oasisV1SimpleExchangeWrapper.orderToBytes(orderData as OasisV1Order),
          exchangeWrapperAddress: order.exchangeWrapperAddress ||
            this.oasisV1SimpleExchangeWrapper.getAddress(),
        };

      case OrderType.OasisV2:
        return {
          bytes: this.oasisV2SimpleExchangeWrapper.orderToBytes(orderData as OasisV2Order),
          exchangeWrapperAddress: order.exchangeWrapperAddress ||
            this.oasisV2SimpleExchangeWrapper.getAddress(),
        };

      case OrderType.OasisV3:
        return {
          bytes: this.oasisV3SimpleExchangeWrapper.orderToBytes(orderData as OasisV3Order),
          exchangeWrapperAddress: order.exchangeWrapperAddress ||
            this.oasisV3SimpleExchangeWrapper.getAddress(),
        };

      case OrderType.OpenDirectly:
        return {
          bytes: this.openDirectlyExchangeWrapper.orderToBytes(orderData as OpenDirectlyOrder),
          exchangeWrapperAddress: order.exchangeWrapperAddress ||
            this.openDirectlyExchangeWrapper.getAddress(),
        };

      default:
        throw new Error(`Invalid order type ${type}`);
    }
  }
}
