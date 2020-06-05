import web3Utils from 'web3-utils';
import { BigNumberable } from '../types';

export function argToBytes(val: BigNumberable): string {
  return web3Utils.padLeft(web3Utils.toHex(val), 64, '0');
}

export function allToBytes(...values: BigNumberable[]): string {
  return combineHexStrings(...values.map(v => argToBytes(v)));
}

export function combineHexStrings(...args: string[]): string {
  return `0x${args.map(stripHexPrefix).join('')}`;
}

export function stripHexPrefix(input: string) {
  if (input.startsWith('0x')) {
    return input.slice(2);
  }
  return input;
}
