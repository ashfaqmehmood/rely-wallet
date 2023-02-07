import axios from 'axios';
import https from 'https';
import * as Sentry from '@sentry/react-native';
import { MORALIS_API_KEY, MORALIS_BASE_API } from '@/Utils/constants';

export const token_whitelist = [
  'ETH',
  'USDC',
  'USDT',
  'DAI',
  'USDC',
  'WBTC',
  'WETH',
  'LINK',
  'UNI',
  'AAVE',
  'WETH',
  'WBTC',
  'CRO',
  'MATIC',
  'BNB',
  'OP',
  'AVAX',
  'FTM',
  'PEFI',
  'CRV',
  'GULF',
  'DODO',
  'SUSHI',
  'YFI',
  'DOGE',
  'SHIB',
  'BUSD',
  'CAKE',
];

export const getERC20TokenBalances = (address: string, chainId: string) => {
  return new Promise((resolve, reject) => {
    const options = {
      params: {
        chain: chainId,
      },
      headers: {
        accept: 'application/json',
        'X-API-Key': MORALIS_API_KEY,
      }
    }
    axios.get(`${MORALIS_BASE_API}${address}/erc20`, options).then(async (result) => {
      let tokens = await Promise.all(result.data.map(async (token: any) => {
        try {
          token.balance = token.balance / 10 ** token.decimals;
          if (token_whitelist.includes(token.symbol)) {
            // todo: use pricequotes from redux
            const url = `https://api.coingecko.com/api/v3/coins/${coingecko_getChain(chainId)}/contract/${token.token_address}`;
            let usd_price_coin_gecko = await axios.get(url);
            token.usd_price = usd_price_coin_gecko.data.market_data.current_price.usd;
          } else {
            token.scam = true;
          }
        } catch (error) {
          console.log(error);
        }
        token.chainId = chainId;
        return token;
      }));
      resolve(tokens);
    }).catch((error) => {
      console.log(error);
      Sentry.captureException(error);
      reject(error);
    });
  });
}

export const getNFTs = (address: string, chainId: string) => {
  return new Promise((resolve, reject) => {
    const options = {
      params: {
        chain: chainId,
        normalizeMetadata: true,
      },
      headers: {
        accept: 'application/json',
        'X-API-Key': MORALIS_API_KEY,
      }
    }
    axios.get(`${MORALIS_BASE_API}${address}/nft`, options).then((result) => {
      const nfts = result.data.result.map((nft: any) => {
        nft.chainId = chainId;
        return nft;
      });
      console.log(nfts.length);
      resolve(nfts);
    }).catch((error) => {
      console.log(error);
      Sentry.captureException(error);
      reject(error);
    });
  });
}

const coingecko_getChain = (chain: string) => {
  switch (chain) {
    case 'ethereum':
      return 'ethereum'
      break;
    case 'polygon':
      return 'polygon-pos'
      break;
    case 'bsc':
      return 'binance-smart-chain'
      break;
    case 'optimism':
      return 'optimistic-ethereum'
      break;
    case 'arbitrum':
      return 'arbitrum-one'
      break;
    default:
      return chain;
      break;
  }
}