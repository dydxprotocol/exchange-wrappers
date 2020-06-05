import { expect } from './helpers/Expect';

import oasisV1SimpleExchangeWrapper from '../build/contracts/OasisV1SimpleExchangeWrapper.json';
import oasisV2SimpleExchangeWrapper from '../build/contracts/OasisV2SimpleExchangeWrapper.json';
import oasisV3SimpleExchangeWrapper from '../build/contracts/OasisV3SimpleExchangeWrapper.json';
import oasisV1MatchingExchangeWrapper from '../build/contracts/OasisV1MatchingExchangeWrapper.json';
import oasisV3MatchingExchangeWrapper from '../build/contracts/OasisV3MatchingExchangeWrapper.json';
import openDirectlyExchangeWrapper from '../build/contracts/OpenDirectlyExchangeWrapper.json';
import saiDaiExchangeWrapper from '../build/contracts/SaiDaiExchangeWrapper.json';
import testExchangeWrapper from '../build/contracts/TestExchangeWrapper.json';
import zeroExV2ExchangeWrapper from '../build/contracts/ZeroExV2ExchangeWrapper.json';
import zeroExV2MultiOrderExchangeWrapper from '../build/contracts/ZeroExV2MultiOrderExchangeWrapper.json';

describe('Bytecode Size', () => {
  it('Has a bytecode that does not exceed the maximum', async () => {
    if (process.env.COVERAGE === 'true') {
      return;
    }

    // Max size is 0x6000 (= 24576) bytes
    const maxSize = 24576 * 2; // 2 characters per byte
    expect(oasisV1SimpleExchangeWrapper.deployedBytecode.length).is.lessThan(maxSize);
    expect(oasisV2SimpleExchangeWrapper.deployedBytecode.length).is.lessThan(maxSize);
    expect(oasisV3SimpleExchangeWrapper.deployedBytecode.length).is.lessThan(maxSize);
    expect(oasisV1MatchingExchangeWrapper.deployedBytecode.length).is.lessThan(maxSize);
    expect(oasisV3MatchingExchangeWrapper.deployedBytecode.length).is.lessThan(maxSize);
    expect(openDirectlyExchangeWrapper.deployedBytecode.length).is.lessThan(maxSize);
    expect(saiDaiExchangeWrapper.deployedBytecode.length).is.lessThan(maxSize);
    expect(testExchangeWrapper.deployedBytecode.length).is.lessThan(maxSize);
    expect(zeroExV2ExchangeWrapper.deployedBytecode.length).is.lessThan(maxSize);
    expect(zeroExV2MultiOrderExchangeWrapper.deployedBytecode.length).is.lessThan(maxSize);
  });
});
