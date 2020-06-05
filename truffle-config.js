require('dotenv-flow').config(); // eslint-disable-line
const HDWalletProvider = require('@truffle/hdwallet-provider'); // eslint-disable-line

module.exports = {
  networks: {
    mainnet: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '1',
      gasPrice: process.env.GAS_PRICE,
      gas: 7900000
    },
    kovan: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '42',
      gasPrice: 1000000000, // 1 gwei
      gas: 7900000
    },
    dev: {
      host: 'localhost',
      port: 8545,
      network_id: '*',
      gasPrice: 1000000000, // 1 gwei
      gas: 7900000
    },
    coverage: {
      host: 'localhost',
      network_id: '*',
      port: 8555,
      gas: 0xfffffffffff,
      gasPrice: 0x01,
    },
    docker: {
      host: 'localhost',
      network_id: '1212',
      port: 8545
    }
  },
  compilers: {
    solc: {
      version: '0.5.16',
      parser: 'solcjs',
      settings: {
        optimizer: {
          enabled: true,
          runs: 10000
        },
      },
    },
  },
  plugins: ['solidity-coverage'],
  mocha: {
    timeout: false,
  },
};
