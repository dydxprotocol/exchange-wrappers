/*

    Copyright 2018 dYdX Trading Inc.

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

import BN from 'bn.js';
import BigNumber from 'bignumber.js';

export enum OrderType {
  Test = 'TEST',
  ZeroExV2 = 'ZERO_EX_V2',
  OasisV1 = 'OASIS_V1',
  OasisV2 = 'OASIS_V2',
  OasisV3 = 'OASIS_V3',
  OpenDirectly = 'OPEN_DIRECTLY',
}

export interface Order {
  type: OrderType;
  exchangeWrapperAddress?: string;
}

export interface TestOrder extends Order {
  originator: string;
  makerToken: string;
  takerToken: string;
  makerAmount: BigNumber | BN;
  takerAmount: BigNumber | BN;
  allegedTakerAmount: BigNumber | BN;
}

export interface ZeroExV2Order extends Order {
  exchangeAddress: string;
  expirationTimeSeconds: BigNumber | BN;
  feeRecipientAddress: string;
  makerAddress: string;
  makerAssetAmount: BigNumber | BN;
  makerAssetData: string;
  makerFee: BigNumber | BN;
  salt: BigNumber | BN;
  senderAddress: string;
  signature: string;
  takerAddress: string;
  takerAssetAmount: BigNumber | BN;
  takerAssetData: string;
  takerFee: BigNumber | BN;
}

export interface OasisV1Order extends Order {
  id: string | BN;
}

export interface OasisV2Order extends Order {
  id: string | BN;
}

export interface OasisV3Order extends Order {
  id: string | BN;
}

export interface OpenDirectlyOrder extends Order {}
