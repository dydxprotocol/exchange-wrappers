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

// ============ Contracts ============

const CurveExchangeWrapper = artifacts.require('CurveExchangeWrapper');
const OasisV1SimpleExchangeWrapper = artifacts.require('OasisV1SimpleExchangeWrapper');
const OasisV2SimpleExchangeWrapper = artifacts.require('OasisV2SimpleExchangeWrapper');
const OasisV3SimpleExchangeWrapper = artifacts.require('OasisV3SimpleExchangeWrapper');
const OasisV1MatchingExchangeWrapper = artifacts.require('OasisV1MatchingExchangeWrapper');
const OasisV3MatchingExchangeWrapper = artifacts.require('OasisV3MatchingExchangeWrapper');
const OpenDirectlyExchangeWrapper = artifacts.require('OpenDirectlyExchangeWrapper');
const SaiDaiExchangeWrapper = artifacts.require('SaiDaiExchangeWrapper');
const ZeroExV2ExchangeWrapper = artifacts.require('ZeroExV2ExchangeWrapper');
const ZeroExV2MultiOrderExchangeWrapper = artifacts.require('ZeroExV2MultiOrderExchangeWrapper');
const TestExchangeWrapper = artifacts.require('TestExchangeWrapper');

// ============ Main Migration ============

const migration = async (deployer, network, accounts) => {
  await Promise.all([
    deployer.deploy(CurveExchangeWrapper),
    deployer.deploy(TestExchangeWrapper),
  ]);
};

module.exports = migration;
