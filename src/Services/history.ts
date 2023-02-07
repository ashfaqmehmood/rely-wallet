import axios from 'axios';
import * as Sentry from '@sentry/react-native';
// @ts-ignore-next-line
// TODO: develop a new abi decoder library
import {
  ARBISCAN_API_KEY,
  ARBITRUM_RPC,
  AVALANCHE_RPC,
  BSCSCAN_API_KEY,
  BSC_RPC,
  CRONOSSCAN_API_KEY,
  CRONOS_RPC,
  ETHEREUM_RPC,
  ETHERSCAN_API_KEY,
  FANTOMSCAN_API_KEY,
  FANTOM_RPC,
  OPTIMISM_API_KEY,
  OPTIMISM_RPC,
  POLYGONSCAN_API_KEY,
  POLYGON_RPC,
  SNOWTRACE_API_KEY,
} from '@/Utils/constants';
import { getTransactionReceipt, getWeb3Instance, setProvider } from '@/Utils/web3/web3';
import { ERC20ABI } from '@/Utils/ABI';

let web3 = getWeb3Instance();

export const etherscan = {
  getTransactions: (address: string) => {
    return new Promise((resolve, reject) => {
      axios.get(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&offset=100&sort=desc&apikey=${ETHERSCAN_API_KEY}`).then(async (result) => {
        let transactions = await Promise.all(result.data.result.map(async (tx: any) => {
          tx.chain = 'ethereum';
          tx.symbol = 'ETH';
          tx.is_erc20 = tx.methodId == '0xa9059cbb' ? true : false;
          if (tx.is_erc20) {
            setProvider(ETHEREUM_RPC);
            tx.token = await getTokenMetadata('eth', tx.to);
            tx.receipt = await getTransactionReceipt(tx.hash);
            let decoded_logs = web3.eth.abi.decodeLog([
              {
                "indexed": true,
                "name": "from",
                "type": "address"
              },
              {
                "indexed": true,
                "name": "to",
                "type": "address"
              },
              {
                "indexed": false,
                "name": "value",
                "type": "uint256"
              }
            ], tx.receipt.logs[0].data, tx.receipt.logs[0].topics.slice(1));

            tx.logs = {
              from: decoded_logs.from,
              to: decoded_logs.to,
              value: decoded_logs.value
            };
          }
          return tx;
        }))
        resolve(transactions);
      }).catch((err) => {
        console.log('etherscan getTransactions');
        console.log(err);
        reject(err);
      });
    });
  }
}

export const bscscan = {
  getTransactions: (address: string) => {
    return new Promise((resolve, reject) => {
      axios.get(`https://api.bscscan.com/api?module=account&action=txlist&address=${address}&offset=100&sort=desc&apikey=${BSCSCAN_API_KEY}`).then(async (result) => {
        let transactions = await Promise.all(result.data.result.map(async (tx: any) => {
          tx.chain = 'bsc';
          tx.symbol = 'BNB';
          tx.is_erc20 = tx.methodId == '0xa9059cbb' ? true : false;
          if (tx.is_erc20) {
            try {
              setProvider(BSC_RPC);
              tx.token = await getTokenMetadata('bsc', tx.to);
              tx.receipt = await getTransactionReceipt(tx.hash);
              let decoded_logs = web3.eth.abi.decodeLog([
                {
                  "indexed": true,
                  "name": "from",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "name": "to",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "name": "value",
                  "type": "uint256"
                }
              ], tx.receipt.logs[0].data, tx.receipt.logs[0].topics.slice(1));

              tx.logs = {
                from: decoded_logs.from,
                to: decoded_logs.to,
                value: decoded_logs.value
              };
            } catch (error) {
              console.log(error);
              console.log('try catch error');
            }
          }
          return tx;
        }))
        resolve(transactions);
      }).catch((err) => {
        console.log('bscscan getTransactions');
        console.log(err);
        console.log(JSON.stringify(err));
        reject(err);
      });
    });
  }
}

export const arbitrum = {
  getTransactions: (address: string) => {
    return new Promise((resolve, reject) => {
      axios.get(`https://api.arbiscan.io/api?module=account&action=txlist&address=${address}&offset=100&sort=desc&apikey=${ARBISCAN_API_KEY}`).then(async (result) => {
        let transactions = await Promise.all(result.data.result.map(async (tx: any) => {
          tx.chain = 'arbitrum';
          tx.symbol = 'ETH';
          tx.is_erc20 = tx.methodId == '0xa9059cbb' ? true : false;
          if (tx.is_erc20) {
            setProvider(ARBITRUM_RPC);
            tx.token = await getTokenMetadata('arbitrum', tx.to);
            tx.receipt = await getTransactionReceipt(tx.hash);
            let decoded_logs = web3.eth.abi.decodeLog([
              {
                "indexed": true,
                "name": "from",
                "type": "address"
              },
              {
                "indexed": true,
                "name": "to",
                "type": "address"
              },
              {
                "indexed": false,
                "name": "value",
                "type": "uint256"
              }
            ], tx.receipt.logs[0].data, tx.receipt.logs[0].topics.slice(1));

            tx.logs = {
              from: decoded_logs.from,
              to: decoded_logs.to,
              value: decoded_logs.value
            };
          }
          return tx;
        }))
        resolve(transactions);
      }).catch((err) => {
        console.log('arbiscan getTransactions');
        console.log(err);
        reject(err);
      });
    });
  }
}

export const polygon = {
  getTransactions: (address: string) => {
    return new Promise((resolve, reject) => {
      axios.get(`https://api.polygonscan.com/api?module=account&action=txlist&address=${address}&offset=100&sort=desc&apikey=${POLYGONSCAN_API_KEY}`).then(async (result) => {
        let transactions = await Promise.all(result.data.result.map(async (tx: any) => {
          tx.chain = 'polygon';
          tx.symbol = 'MATIC';
          tx.is_erc20 = tx.methodId == '0xa9059cbb' ? true : false;
          if (tx.is_erc20) {
            setProvider(POLYGON_RPC);
            tx.token = await getTokenMetadata('polygon', tx.to);
            tx.receipt = await getTransactionReceipt(tx.hash);
            let decoded_logs = web3.eth.abi.decodeLog([
              {
                "indexed": true,
                "name": "from",
                "type": "address"
              },
              {
                "indexed": true,
                "name": "to",
                "type": "address"
              },
              {
                "indexed": false,
                "name": "value",
                "type": "uint256"
              }
            ], tx.receipt.logs[0].data, tx.receipt.logs[0].topics.slice(1));

            tx.logs = {
              from: decoded_logs.from,
              to: decoded_logs.to,
              value: decoded_logs.value
            };
          }
          return tx;
        }))
        resolve(transactions);
      }).catch((err) => {
        console.log('polygonscan getTransactions');
        console.log(err);
        reject(err);
      });
    });
  }
}

export const avalanche = {
  getTransactions: (address: string) => {
    return new Promise((resolve, reject) => {
      axios.get(`https://api.snowtrace.io/api?module=account&action=txlist&address=${address}&offset=100&sort=desc&apikey=${SNOWTRACE_API_KEY}`).then(async (result) => {
        let transactions = await Promise.all(result.data.result.map(async (tx: any) => {
          tx.chain = 'avalanche';
          tx.symbol = 'AVAX';
          tx.is_erc20 = tx.methodId == '0xa9059cbb' ? true : false;
          if (tx.is_erc20) {
            setProvider(AVALANCHE_RPC);
            tx.token = await getTokenMetadata('avalanche', tx.to);
            tx.receipt = await getTransactionReceipt(tx.hash);
            let decoded_logs = web3.eth.abi.decodeLog([
              {
                "indexed": true,
                "name": "from",
                "type": "address"
              },
              {
                "indexed": true,
                "name": "to",
                "type": "address"
              },
              {
                "indexed": false,
                "name": "value",
                "type": "uint256"
              }
            ], tx.receipt.logs[0].data, tx.receipt.logs[0].topics.slice(1));

            tx.logs = {
              from: decoded_logs.from,
              to: decoded_logs.to,
              value: decoded_logs.value
            };
          }
          return tx;
        }))
        resolve(transactions);
      }).catch((err) => {
        console.log('snowtrace getTransactions');
        console.log(err);
        reject(err);
      });
    });
  }
}

export const optimism = {
  getTransactions: (address: string) => {
    return new Promise((resolve, reject) => {
      axios.get(`https://api-optimistic.etherscan.io/api?module=account&action=txlist&address=${address}&offset=100&sort=desc&apikey=${OPTIMISM_API_KEY}`).then(async (result) => {
        let transactions = await Promise.all(result.data.result.map(async (tx: any) => {
          tx.chain = 'optimism';
          tx.symbol = 'OP';
          tx.is_erc20 = tx.methodId == '0xa9059cbb' ? true : false;
          if (tx.is_erc20) {
            setProvider(OPTIMISM_RPC);
            tx.token = await getTokenMetadata('optimism', tx.to);
            tx.receipt = await getTransactionReceipt(tx.hash);
            let decoded_logs = web3.eth.abi.decodeLog([
              {
                "indexed": true,
                "name": "from",
                "type": "address"
              },
              {
                "indexed": true,
                "name": "to",
                "type": "address"
              },
              {
                "indexed": false,
                "name": "value",
                "type": "uint256"
              }
            ], tx.receipt.logs[0].data, tx.receipt.logs[0].topics.slice(1));

            tx.logs = {
              from: decoded_logs.from,
              to: decoded_logs.to,
              value: decoded_logs.value
            };
          }
          return tx;
        }))
        resolve(transactions);
      }).catch((err) => {
        console.log('fantom getTransactions');
        console.log(err);
        reject(err);
      });
    });
  }
}

export const fantom = {
  getTransactions: (address: string) => {
    return new Promise((resolve, reject) => {
      axios.get(`https://api.ftmscan.com/api?module=account&action=txlist&address=${address}&offset=100&sort=desc&apikey=${FANTOMSCAN_API_KEY}`).then(async (result) => {
        let transactions = await Promise.all(result.data.result.map(async (tx: any) => {
          tx.chain = 'fantom';
          tx.symbol = 'FTM';
          tx.is_erc20 = tx.methodId == '0xa9059cbb' ? true : false;
          if (tx.is_erc20) {
            setProvider(FANTOM_RPC);
            tx.token = await getTokenMetadata('fantom', tx.to);
            tx.receipt = await getTransactionReceipt(tx.hash);
            let decoded_logs = web3.eth.abi.decodeLog([
              {
                "indexed": true,
                "name": "from",
                "type": "address"
              },
              {
                "indexed": true,
                "name": "to",
                "type": "address"
              },
              {
                "indexed": false,
                "name": "value",
                "type": "uint256"
              }
            ], tx.receipt.logs[0].data, tx.receipt.logs[0].topics.slice(1));

            tx.logs = {
              from: decoded_logs.from,
              to: decoded_logs.to,
              value: decoded_logs.value
            };
          }
          return tx;
        }))
        resolve(transactions);
      }).catch((err) => {
        console.log('fantom getTransactions');
        console.log(err);
        reject(err);
      });
    });
  }
}

export const cronos = {
  getTransactions: (address: string) => {
    return new Promise((resolve, reject) => {
      axios.get(`https://api.cronoscan.com/api?module=account&action=txlist&address=${address}&offset=100&sort=desc&apikey=${CRONOSSCAN_API_KEY}`).then(async (result) => {

        let transactions = await Promise.all(result.data.result.map(async (tx: any) => {
          tx.chain = 'cronos';
          tx.symbol = 'CRO';
          tx.is_erc20 = tx.methodId == '0xa9059cbb' ? true : false;
          if (tx.is_erc20) {
            setProvider(CRONOS_RPC);
            tx.token = await getTokenMetadata('cronos', tx.to);
            tx.receipt = await getTransactionReceipt(tx.hash);
            let decoded_logs = web3.eth.abi.decodeLog([
              {
                "indexed": true,
                "name": "from",
                "type": "address"
              },
              {
                "indexed": true,
                "name": "to",
                "type": "address"
              },
              {
                "indexed": false,
                "name": "value",
                "type": "uint256"
              }
            ], tx.receipt.logs[0].data, tx.receipt.logs[0].topics.slice(1));

            tx.logs = {
              from: decoded_logs.from,
              to: decoded_logs.to,
              value: decoded_logs.value
            };
          }
          return tx;
        }))
        resolve(transactions);
      }).catch((err) => {
        console.log('cronos getTransactions');
        console.log(err);
        reject(err);
      });
    });
  }
}

const getTokenMetadata = (chain: string, address: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(web3.currentProvider);
      let contract = new web3.eth.Contract(ERC20ABI, address);

      let token = {
        address: address,
        name: await contract.methods.name().call(),
        symbol: await contract.methods.symbol().call(),
        decimals: await contract.methods.decimals().call(),
      }
      console.log(token);
      resolve([token]);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}