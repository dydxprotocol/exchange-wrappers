import web3Utils from 'web3-utils';
import { BigNumberable } from '../types';

export function argToBytes(val: BigNumberable): string {
  return web3Utils.padLeft(web3Utils.toHex(val), 64, '0');
}

export function allToBytes(...values: BigNumberable[]): string {
  let result: string = '0x';
  for (const value in values) {
    result += argToBytes(value);
  }
  return result;
}
