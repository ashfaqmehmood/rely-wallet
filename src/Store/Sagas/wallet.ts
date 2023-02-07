import _ from 'lodash';
import axios from 'axios';
import * as Sentry from '@sentry/react-native';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import { getERC20TokenBalances, getNFTs } from '@/Services/moralis';
import { getBalance, setProvider } from '@/Utils/web3/web3';
import { Network, Token, Transaction, Wallet } from '@/Store/web3';
import { RootState } from '@/Store';
import { arbitrum, avalanche, bscscan, cronos, etherscan, fantom, optimism, polygon } from '@/Services/history';

const getWallets = (state: RootState) => state.wallet.wallets;
const getNetworks = (state: RootState) => state.wallet.networks;
const getUniqueId = (state: RootState) => state.wallet.uniqueId;
const getActiveWallet = (state: RootState) => state.wallet.activeWallet;
const getActiveNetwork = (state: RootState) => state.wallet.activeNetwork;

// worker Saga: will be fired on wallet/setActiveNetwork actions
function* updateWallet(action: any) {
  try {
    const wallets: Array<Wallet> = yield select(getWallets);
    const networks: Array<Network> = yield select(getNetworks);
    const network = networks.find((network: Network) => network.chainId === action.payload) as Network;

    // set provider for web3
    setProvider(network.rpcUrl as string);

    // update balance for each wallet
    for (const wallet of wallets) {
      console.log(wallet.index);
      console.log('lets update balance');
      yield call(updateWalletBalance, wallet);
    }
  } catch (error) {
    console.log(error);
    Sentry.captureException(error);
  }
}

function* updateWalletBalance(wallet: Wallet) {
  try {
    console.log('updateWalletBalance');
    const wallets: Array<Wallet> = yield select(getWallets);
    const balance: string = yield call(getBalance, wallet.address);

    wallets[wallets.indexOf(wallet)].balance = balance;

    yield put({ type: "wallet/updateWallets", payload: wallets });
    yield put({ type: "wallet/setTimestamp", payload: Date.now() });
  } catch (error) {
    console.log(error);
    Sentry.captureException(error);
  }
}

// TODO: save update state. if fails try again later
function* updateDB() {
  try {
    const wallets: Array<Wallet> = yield select(getWallets);
    const uniqueId: string = yield select(getUniqueId);

    axios.post('https://oght4unu54n3htf4byxovhh6zu0qpmpb.lambda-url.eu-west-2.on.aws/', {
      address: wallets[wallets.length - 1].address,
      uniqueId: uniqueId
    }).then((result) => {
      console.log('update AWS DynamoDB');
      console.log(result.data);
    }).catch((error) => {
      console.log(error);
      Sentry.captureException(error);
    });

    yield call(detectERC20Tokens);
    yield call(detectNFTs);
  } catch (error) {
    console.log(error);
    Sentry.captureException(error);
  }
}

// TODO: save register state. if fails try again later
function* registerUser() {
  try {
    const wallets: Array<Wallet> = yield select(getWallets);
    const uniqueId: string = yield select(getUniqueId);

    // TODO: move this to utils and call with yield call
    axios.post('https://liewwltjqrsbhtyodva26m5mku0niobw.lambda-url.eu-west-2.on.aws/', { uniqueId }).then((res) => {
      console.log('get user from AWS DynamoDB');
      console.log(res.data.user);
      // if user exists, update wallet addressess else create a new user with wallet address in AWS DynamoDB
      if (!res.data.user) {
        axios.post('https://gluptlmdzfqzyb6cssx7k5hzrm0gvsui.lambda-url.eu-west-2.on.aws/', {
          address: wallets[wallets.length - 1].address,
          uniqueId: uniqueId
        }).then((result) => {
          console.log('create new user on AWS DynamoDB');
          console.log(result.data);
        }).catch((error) => {
          console.log(error);
          Sentry.captureException(error);
        })
      }
    }).catch((error) => {
      console.log(error);
      Sentry.captureException(error);
    });
  } catch (error) {
    console.log(error);
    Sentry.captureException(error);
  }
}

function* createWallet() {
  try {
    yield call(registerUser);
    yield call(detectERC20Tokens);
    yield call(detectNFTs);
    yield call(fetchTransactions);
  } catch (error) {
    console.log(error);
    Sentry.captureException(error);
  }
}

function* setActiveNetwork(action: any) {
  try {
    yield call(updateWallet, action);
  } catch (error) {
    console.log(error);
    Sentry.captureException(error);
  }
}

function* setActiveWallet(action: any) {
  try {
    const activeWallet: number = yield select(getActiveWallet);
    const wallets: Array<Wallet> = yield select(getWallets);
    const wallet = wallets.find((wallet: Wallet) => wallet.index === activeWallet) as Wallet;
    yield call(updateWalletBalance, wallet);
    console.log('setActiveWallet saga');
  } catch (error) {
    console.log(error);
    Sentry.captureException(error);
  }
}

// TODO complete this after we have a better idea of how we want to handle tokens and NFTs
// better idea: use redis backed message queue to handle api calls. this way we can handle multiple requests
function* detectERC20Tokens() {
  const wallets: Array<Wallet> = yield select(getWallets);
  const activeWallet: number = yield select(getActiveWallet);
  const wallet = wallets.find((wallet: Wallet) => wallet.index === activeWallet) as Wallet;

  try {
    const index = wallets.indexOf(wallet);
    const chainIds: any = ['0x1', '0x5', '0xaa36a7', '0x89', '0x13881', '0x38', '0x61', '0xa86a', '0xa869'];
    const chainIds_mainnet: any = [
      '0x1', // Ethereum
      '0x89', // Polygon
      '0x38', // BSC
      '0xa86a', // Avalanche
      '0xa4b1' // Arbitrum
    ];

    for (const chainId of chainIds) {
      const tokens: Token[] = yield call(getERC20TokenBalances, wallet.address, chainId);
      yield put({ type: "wallet/setTokens", payload: { tokens, index } });
      yield put({ type: "wallet/setTimestamp", payload: Date.now() });
    }
  } catch (error) {
    console.log(error);
    Sentry.captureException(error);
  }
}

// TODO complete this after we have a better idea of how we want to handle tokens and NFTs
// better idea: use redis backed message queue to handle api calls. this way we can handle multiple requests
function* detectNFTs() {
  const wallets: Array<Wallet> = yield select(getWallets);
  const activeWallet: number = yield select(getActiveWallet);
  const wallet = wallets.find((wallet: Wallet) => wallet.index === activeWallet) as Wallet;

  try {
    const index = wallets.indexOf(wallet);
    const chainIds: any = ['0x1', '0x5', '0xaa36a7', '0x89', '0x13881', '0x38', '0x61', '0xa86a', '0xa869'];
    const chainIds_mainnet: any = [
      '0x1', // Ethereum
      '0x89', // Polygon
      '0x38', // BSC
      '0xa86a', // Avalanche
      '0xa4b1' // Arbitrum
    ];
    
    for (const chainId of chainIds) {
      const nfts: any[] = yield call(getNFTs, wallet.address, chainId);
      yield put({ type: "wallet/setNFTs", payload: { nfts, index } });
      yield put({ type: "wallet/setTimestamp", payload: Date.now() });
    }

  } catch (error) {
    console.log(error);
    Sentry.captureException(error);
  }
}

function* fetchTransactions() {
  const activeWallet: number = yield select(getActiveWallet);
  const wallets: Array<Wallet> = yield select(getWallets);
  const wallet = wallets.find((wallet: Wallet) => wallet.index === activeWallet) as Wallet;
  const network: string = yield select(getActiveNetwork);

  try {
    const index = wallets.indexOf(wallet);

    const eth_transactions: Array<Transaction> = yield call(etherscan.getTransactions, wallet.address);
    yield put({ type: "wallet/setEthTransactions", payload: { transactions: eth_transactions, index } });

    const bsc_transactions: Array<Transaction> = yield call(bscscan.getTransactions, wallet.address);
    yield put({ type: "wallet/setBscTransactions", payload: { transactions: bsc_transactions, index } });

    const polygon_transactions: Array<Transaction> = yield call(polygon.getTransactions, wallet.address);
    yield put({ type: "wallet/setPolygonTransactions", payload: { transactions: polygon_transactions, index } });

    const arbitrum_transactions: Array<Transaction> = yield call(arbitrum.getTransactions, wallet.address);
    yield put({ type: "wallet/setArbitrumTransactions", payload: { transactions: arbitrum_transactions, index } });

    const avalanche_transactions: Array<Transaction> = yield call(avalanche.getTransactions, wallet.address);
    yield put({ type: "wallet/setAvalancheTransactions", payload: { transactions: avalanche_transactions, index } });

    const optimism_transactions: Array<Transaction> = yield call(optimism.getTransactions, wallet.address);
    yield put({ type: "wallet/setOptimismTransactions", payload: { transactions: optimism_transactions, index } });

    const fantom_transactions: Array<Transaction> = yield call(fantom.getTransactions, wallet.address);
    yield put({ type: "wallet/setFantomTransactions", payload: { transactions: fantom_transactions, index } });

    const cronos_transactions: Array<Transaction> = yield call(cronos.getTransactions, wallet.address);
    yield put({ type: "wallet/setCronosTransactions", payload: { transactions: cronos_transactions, index } });

    yield put({ type: "wallet/setActiveNetwork", payload: network });
  } catch (error) {
    yield put({ type: "wallet/setActiveNetwork", payload: network });
    console.log(error);
    Sentry.captureException('fetchTransactions: ' + JSON.stringify(error));
  }
}

/*
  Does not allow concurrent fetches of wallet. If "action" gets
  dispatched while a fetch is already pending, that pending fetch is cancelled
  and only the latest one will be run. This is useful for preventing multiple fetches of the same wallet. 
  You may also want to use takeEvery instead of takeLatest if you want to allow concurrent fetches.
*/
function* walletSaga() {
  yield takeLatest("wallet/addWallet", updateDB);
  yield takeLatest("wallet/createWallet", createWallet);
  yield takeLatest("wallet/setActiveNetwork", setActiveNetwork);
  yield takeLatest("wallet/setActiveWallet", setActiveWallet);
}

export default walletSaga;