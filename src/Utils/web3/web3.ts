import Web3 from 'web3';
import * as solanaWeb3 from '@solana/web3.js';
import * as bip39 from 'bip39';
import { hdkey } from 'ethereumjs-wallet';
import * as ed25519 from 'ed25519-hd-key';
import nacl from 'tweetnacl';
import { ethers } from 'ethers';
import { ETHEREUM_RPC } from '@/Utils/constants';
import { ERC20ABI } from '@/Utils/ABI';
import { base58 } from 'ethers/lib/utils';
import { Wallet } from '@/Store/web3';

// TODO: change it on chain change (setProvider?)
const web3 = new Web3(ETHEREUM_RPC);
const ethersProvider = new ethers.providers.JsonRpcProvider(ETHEREUM_RPC);

export const getWeb3Instance = () => {
  return web3;
};

export const setProvider = (provider: string) => {
  web3.setProvider(provider);
};

export const validateMnemonic = (mnemonic: string) => {
  return bip39.validateMnemonic(mnemonic);
};

export const importWallet = (mnemonic: string) => {
  try {
    const index = 0;
    const eth_path = `m/44'/60'/0'/0/${index}`;
    const sol_path = `m/44'/501'/${index}'/0'`;

    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const hd_wallet = hdkey.fromMasterSeed(seed);
    const wallet = hd_wallet.derivePath(eth_path).getWallet();

    const address = wallet.getAddressString();
    const publicKey = wallet.getPublicKeyString();
    const privateKey = wallet.getPrivateKeyString();

    let derivedPrivateKey = ed25519.derivePath(sol_path, seed.toString('hex'));
    let keyPair = nacl.sign.keyPair.fromSeed(derivedPrivateKey.key);

    const solana = {
      publicKey: base58.encode(keyPair.publicKey),
      secretKey: base58.encode(keyPair.secretKey),
    };

    return {
      address,
      publicKey,
      privateKey,
      solana,
    };
  } catch (error) {
    console.log(error);
  }
};

export const getHDWallet = (index: number, mnemonic: string) => {
  try {
    const eth_path = `m/44'/60'/0'/0/${index}`;
    const sol_path = `m/44'/501'/${index}'/0'`;

    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const hd_wallet = hdkey.fromMasterSeed(seed);
    const wallet = hd_wallet.derivePath(eth_path).getWallet();

    const address = wallet.getAddressString();
    const publicKey = wallet.getPublicKeyString();
    const privateKey = wallet.getPrivateKeyString();

    let derivedPrivateKey = ed25519.derivePath(sol_path, seed.toString('hex'));
    let keyPair = nacl.sign.keyPair.fromSeed(derivedPrivateKey.key);

    const solana = {
      publicKey: base58.encode(keyPair.publicKey),
      secretKey: base58.encode(keyPair.secretKey),
    };

    return {
      address,
      publicKey,
      privateKey,
      solana,
    };
  } catch (error) {
    console.log(error);
  }
};

export const setDefaultAccount = (privateKey: any) => {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;
  return web3;
};

export const getAccounts = () => {
  return new Promise((resolve, reject) => {
    web3.eth
      .getAccounts()
      .then(accounts => {
        resolve(accounts);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

export const getBalance = (address: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    web3.eth
      .getBalance(address)
      .then(balance => {
        resolve(web3.utils.fromWei(balance, 'ether'));
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

export const getERC20Balance = (address: string, contractAddress: string) => {
  return new Promise((resolve, reject) => {
    const contract = new web3.eth.Contract(ERC20ABI, contractAddress);
    contract.methods
      .balanceOf(address)
      .call()
      .then((balance: any) => {
        resolve(balance);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

export const signTransaction = (transaction: any) => {
  return new Promise((resolve, reject) => {
    web3.eth.accounts
      .signTransaction(transaction, '0x0')
      .then((signedTransaction: any) => {
        resolve(signedTransaction);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

export const sendSignedTransaction = (signedTransaction: any) => {
  return new Promise((resolve, reject) => {
    web3.eth
      .sendSignedTransaction(signedTransaction.rawTransaction)
      .then((receipt: any) => {
        resolve(receipt);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

export const getTransactionReceipt = (transactionHash: string) => {
  return new Promise((resolve, reject) => {
    web3.eth
      .getTransactionReceipt(transactionHash)
      .then((receipt: any) => {
        resolve(receipt);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

export const getTransaction = (transactionHash: string) => {
  return new Promise((resolve, reject) => {
    web3.eth
      .getTransaction(transactionHash)
      .then((transaction: any) => {
        resolve(transaction);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

export const getTransactionCount = (address: string) => {
  return new Promise((resolve, reject) => {
    web3.eth
      .getTransactionCount(address)
      .then((count: any) => {
        resolve(count);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

export const getGasPrice = () => {
  return new Promise((resolve, reject) => {
    web3.eth
      .getGasPrice()
      .then((gasPrice: any) => {
        resolve(gasPrice);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

export const getBlockNumber = () => {
  return new Promise((resolve, reject) => {
    web3.eth
      .getBlockNumber()
      .then((blockNumber: any) => {
        resolve(blockNumber);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

export const getBlock = (blockNumber: any, returnTransactionObjects: boolean) => {
  return new Promise((resolve, reject) => {
    web3.eth
      .getBlock(blockNumber, returnTransactionObjects as any)
      .then((block: any) => {
        resolve(block);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

export const getBlockTransactionCount = (blockNumber: number) => {
  return new Promise((resolve, reject) => {
    web3.eth
      .getBlockTransactionCount(blockNumber)
      .then((count: any) => {
        resolve(count);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

export const getTransactionFromBlock = (blockNumber: number, index: number) => {
  return new Promise((resolve, reject) => {
    web3.eth
      .getTransactionFromBlock(blockNumber, index)
      .then((transaction: any) => {
        resolve(transaction);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

export const getTransactionInBlock = (blockNumber: number, index: number) => {
  return new Promise((resolve, reject) => {
    web3.eth
      .getTransactionFromBlock(blockNumber, index)
      .then((transaction: any) => {
        resolve(transaction);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

export const signMessage = (message: string, privateKey: string) => {
  return new Promise((resolve, reject) => {
    let httpProvider = new ethers.providers.JsonRpcProvider(ETHEREUM_RPC);
    const wallet = new ethers.Wallet(privateKey, httpProvider);
    wallet
      .signMessage(message)
      .then((signature: any) => {
        resolve(signature);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

export const recoverPersonalSignature = (message: string, signature: string) => {
  try {
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    console.log(recoveredAddress);
    return recoveredAddress;
  } catch (error) {
    console.log(error);
  }
};

export const createAccount = async (name: string, index: number, mnemonic: string) => {
  try {
    let HDWallet = getHDWallet(index, mnemonic);
    let web3 = setDefaultAccount(HDWallet?.privateKey);
    const connection = new solanaWeb3.Connection('https://api.devnet.solana.com');
    const balance = await web3.eth.getBalance(HDWallet?.address as string);
    const solBalance = await connection.getBalance(new solanaWeb3.PublicKey(HDWallet?.solana.publicKey as any));

    const account: Wallet = {
      index: index,
      balance: `${web3.utils.fromWei(balance, 'ether')}`,
      // @ts-ignore
      address: HDWallet?.address,
      // @ts-ignore
      privateKey: HDWallet?.privateKey,
      name: name,
      solana: {
        publicKey: HDWallet?.solana.publicKey as string,
        secretKey: HDWallet?.solana.secretKey as string,
        balance: `${solBalance}`,
        name: name,
      },
      tokens: [],
      nfts: [],
      transactions: {
        ethereum: [],
        bsc: [],
        arbitrum: [],
        polygon: [],
        avalanche: [],
        optimism: [],
        fantom: [],
        cronos: [],
      },
    };
    return account;
  } catch (error) {
    console.log(error);
  }
};

// NON-WEB3
export const toAscii = (hex: string) => {
  return web3.utils.toAscii(hex);
};

// TODO: ENS ethereum name service
export const addressAbbreviate = (address: string) => {
  return `${address.slice(0, 5)}...${address.slice(-4)}`;
};

export const abbreviateTokenID = (tokenID: string) => {
  return tokenID.length > 8 ? `${tokenID.slice(0, 5)}...${tokenID.slice(-4)}` : tokenID;
};

export const renderBalance = (balance: string, symbol: string) => {
  const _balance = parseFloat(balance);
  if (_balance === 0) {
    return `0 ${symbol}`;
  }
  return `${_balance.toFixed(4)} ${symbol}`;
};

export const utils = web3.utils;
