import { expect } from './helpers/Expect';
import { OrderType } from '../src/types';
import { allToBytes } from '../src/helpers/BytesHelper';

import { CurveExchangeWrapper } from '../src/exchange_wrappers/CurveExchangeWrapper';

const testAddress = '0x1111111111111111111111111111111111111111';
let curve: CurveExchangeWrapper;

describe('CurveExchangeWrapper', () => {
  before(async () => {
    curve = new CurveExchangeWrapper(1001);
  });

  it('orderToBytes', async () => {
    const bytes = curve.orderToBytes({
      type: OrderType.Curve,
      minToAmount: 1234,
      trades: [{
        curveAddress: testAddress,
        fromId: 1,
        toId: 2,
        fromAmount: 4321,
        exchangeUnderlying: false,
      }],
    });
    expect(bytes).to.eq(allToBytes(
      1234,
      64,
      1,
      testAddress,
      1,
      2,
      4321,
      0,
    ));
  });
});
