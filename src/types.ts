/*

    Copyright 2020 dYdX Trading Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

*/

import BigNumber from 'bignumber.js';

export type address = string;
export type BigNumberable = BigNumber | number | string;

export enum OrderType {
  Test = 'TEST',
  ZeroExV2 = 'ZERO_EX_V2',
  ZeroExV2MultiOrder = 'ZERO_EX_V2_MULTI_ORDER',
  OasisV1 = 'OASIS_V1',
  OasisV2 = 'OASIS_V2',
  OasisV3 = 'OASIS_V3',
  OasisV3Market = 'OASIS_V3_MARKET',
  OpenDirectly = 'OPEN_DIRECTLY',
  SaiDai = 'SAI_DAI',
}

export interface Order {
  type: OrderType;
  exchangeWrapperAddress?: string;
}

export interface TestOrder extends Order {
  originator: string;
  makerToken: string;
  takerToken: string;
  makerAmount: BigNumber;
  takerAmount: BigNumber;
  allegedTakerAmount: BigNumber;
  desiredMakerAmount: BigNumber;
}

interface ZeroExV2OrderBase {
  exchangeAddress: string;
  expirationTimeSeconds: BigNumber;
  feeRecipientAddress: string;
  makerAddress: string;
  makerAssetAmount: BigNumber;
  makerAssetData: string;
  makerFee: BigNumber;
  salt: BigNumber;
  senderAddress: string;
  signature: string;
  takerAddress: string;
  takerAssetAmount: BigNumber;
  takerAssetData: string;
  takerFee: BigNumber;
}

export interface ZeroExV2Order extends Order, ZeroExV2OrderBase {
}

export interface ZeroExV2MultiOrder extends Order {
  maxPrice?: string | BigNumber;
  orders: ZeroExV2OrderBase[];
}

export interface OasisV1Order extends Order {
  id: string | BigNumber;
}

export interface OasisV2Order extends Order {
  id: string | BigNumber;
}

export interface OasisV3Order extends Order {
  id: string | BigNumber;
}

export interface OasisV3MarketOrder extends Order {
  maxPrice?: string | BigNumber;
}

export interface OpenDirectlyOrder extends Order {}

export interface SaiDaiOrder extends Order {}
