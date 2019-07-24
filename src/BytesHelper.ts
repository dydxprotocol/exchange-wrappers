import web3Utils from 'web3-utils';
import BigNumber from 'bignumber.js';
import BN from 'bn.js';

export function toBytes(
  val: string | BN | BigNumber,
): number[] {
  return web3Utils.hexToBytes(
    web3Utils.padLeft(web3Utils.toHex(val), 64, '0'),
  );
}
