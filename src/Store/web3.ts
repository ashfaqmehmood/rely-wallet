import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WalletSliceState {
  initialized: boolean;
  onboarding: boolean;
  uniqueId: string;
  mnemonic: string;
  password: string;
  biometrics: boolean;
  activeWallet: number;
  activeNetwork: string;
  wallets: Array<Wallet>;
  networks: Array<Network>;
  timestamp: number;
  tabs: Array<Tab>;
  bookmarks: Array<Tab>;
  priceQuotes: Array<PriceQuote>;
}

export interface PriceQuote {
  ath: number;
  ath_change_percentage: number;
  ath_date: Date;
  atl: number;
  atl_change_percentage: number;
  atl_date: Date;
  circulating_supply: number;
  current_price: number;
  id: string;
  image: string;
  last_updated: Date;
  low_24h: number;
  market_cap: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  market_cap_rank: number;
  max_supply: number;
  name: string;
  price_change_24h: number;
  price_change_percentage_24h: number;
  roi: null;
  symbol: string;
  total_supply: number;
  total_volume: number;
}

export interface Transaction {
  confirmed: boolean;
  chainId: string;
  chain: string;
  symbol: string;
  nonce: number;
  from: string;
  to: string;
  value: string;
  abi: any[];
  streamId: string;
  tag: string;
  retries: number;
  timeStamp: number;
  is_erc20: boolean;
  functionName: string;
  block: Block;
  logs: any;
  txs: Tx[];
  token: Token[];
  txsInternal: any[];
  erc20Transfers: Erc20Transfer[];
  erc20Approvals: any[];
  nftTokenApprovals: any[];
  nftApprovals: any;
  nftTransfers: any[];
  nativeBalances: any[];
}

export interface Tx {
  hash: string;
  gas: string;
  gasPrice: string;
  nonce: string;
  input: string;
  transactionIndex: string;
  fromAddress: string;
  toAddress: string;
  value: string;
  type: string;
  v: string;
  r: string;
  s: string;
  receiptCumulativeGasUsed: string;
  receiptGasUsed: string;
  receiptContractAddress: any;
  receiptRoot: any;
  receiptStatus: string;
}

export interface Erc20Transfer {
  transactionHash: string;
  logIndex: string;
  contract: string;
  from: string;
  to: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimals: string;
  valueWithDecimals: string;
}

export interface Block {
  number: string;
  hash: string;
  timestamp: string;
}

export interface Tab {
  id: string;
  title: string;
  url: string;
}

export interface Wallet {
  index: number;
  address: string;
  privateKey: string;
  balance: string;
  name: string;
  solana: SolWallet;
  tokens: Array<Token>;
  nfts: Array<NFT>;
  transactions: {
    ethereum: Array<Transaction>;
    bsc: Array<Transaction>;
    arbitrum: Array<Transaction>;
    polygon: Array<Transaction>;
    avalanche: Array<Transaction>;
    optimism: Array<Transaction>;
    fantom: Array<Transaction>;
    cronos: Array<Transaction>;
  };
}

export interface SolWallet {
  publicKey: string;
  secretKey: string;
  balance: string;
  name: string;
}

export interface Token {
  name: string;
  symbol: string;
  token_address: string;
  decimals: number;
  balance: number;
  chainId: string;
}

export interface NFT {
  amount: string;
  block_number: string;
  block_number_minted: string;
  contract_type: string;
  last_metadata_sync: Date;
  last_token_uri_sync: Date;
  metadata: string;
  minter_address: string;
  name: string;
  normalized_metadata: NormalizedMetadata;
  owner_of: string;
  symbol: string;
  token_address: string;
  token_hash: string;
  token_id: string;
  token_uri: string;
}

export interface NormalizedMetadata {
  animation_url: null;
  attributes: string[];
  description: string;
  external_link: null;
  image: string;
  name: string;
}

export interface Network {
  name: string;
  slug: string;
  chainId: string;
  networkVersion: string;
  rpcUrl: string;
  blockExplorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

// Define the initial state using that type
const initialState: WalletSliceState = {
  initialized: false,
  onboarding: false,
  uniqueId: '',
  mnemonic: '',
  password: '',
  biometrics: false,
  activeWallet: 0,
  activeNetwork: '0x1',
  priceQuotes: [],
  wallets: [
    {
      index: 0,
      address: '0x0000000000000000000000000000000000000000',
      privateKey: '',
      balance: '0',
      name: 'Account 1',
      solana: {
        publicKey: '',
        secretKey: '',
        balance: '0',
        name: 'Account 1',
      },
      tokens: [],
      nfts: [],
      // TODO: Save transaction in realm database and filter by wallet adress, token, network, status (pending, confirmed, failed) and amount and type (sent, received) and add pagination and sorting and filtering by date and in-out
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
    },
  ],
  networks: [
    {
      name: 'Ethereum Mainnet',
      slug: 'ethereum',
      chainId: '0x1',
      networkVersion: '1',
      rpcUrl: 'https://mainnet.infura.io/v3/c5a142b1eeef4108b01b3d3344ef8f3c',
      blockExplorerUrl: 'https://etherscan.io',
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
      },
    },
    {
      name: 'Polygon',
      slug: 'polygon',
      networkVersion: '137',
      chainId: '0x89',
      rpcUrl: 'https://polygon-mainnet.infura.io/v3/c5a142b1eeef4108b01b3d3344ef8f3c',
      blockExplorerUrl: 'https://polygonscan.com',
      nativeCurrency: {
        name: 'Matic',
        symbol: 'MATIC',
        decimals: 18,
      },
    },
    {
      name: 'BNB Smart Chain',
      slug: 'bsc',
      chainId: '0x38',
      networkVersion: '56',
      rpcUrl: 'https://bsc-dataseed.binance.org/',
      blockExplorerUrl: 'https://bscscan.com',
      nativeCurrency: {
        name: 'Binance Coin',
        symbol: 'BNB',
        decimals: 18,
      },
    },
    {
      name: 'Arbitrum',
      slug: 'arbitrum',
      networkVersion: '42161',
      chainId: '0xa4b1',
      rpcUrl: 'https://arb1.arbitrum.io/rpc',
      blockExplorerUrl: 'https://arbiscan.io',
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
      },
    },
    {
      name: 'Avalanche',
      slug: 'avalanche',
      networkVersion: '43114',
      chainId: '0xa86a',
      rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
      blockExplorerUrl: 'https://cchain.explorer.avax.network/',
      nativeCurrency: {
        name: 'Avalanche',
        symbol: 'AVAX',
        decimals: 18,
      },
    },
    {
      name: 'Fantom',
      slug: 'fantom',
      networkVersion: '250',
      chainId: '0xfa',
      rpcUrl: 'https://rpcapi.fantom.network',
      blockExplorerUrl: 'https://ftmscan.com',
      nativeCurrency: {
        name: 'Fantom',
        symbol: 'FTM',
        decimals: 18,
      },
    },
    {
      name: 'Optimism',
      slug: 'optimism',
      networkVersion: '10',
      chainId: '0xa',
      rpcUrl: 'https://mainnet.optimism.io',
      blockExplorerUrl: 'https://optimistic.etherscan.io',
      nativeCurrency: {
        name: 'Optimism',
        symbol: 'OP',
        decimals: 18,
      },
    },
    {
      name: 'Cronos',
      slug: 'cronos',
      networkVersion: '10',
      chainId: '0xa',
      rpcUrl: 'https://evm.cronos.org',
      blockExplorerUrl: 'https://cronoscan.com',
      nativeCurrency: {
        name: 'Cronos',
        symbol: 'CRO',
        decimals: 18,
      },
    },
    {
      name: 'Goerli',
      slug: 'goerli',
      networkVersion: '5',
      chainId: '0x5',
      rpcUrl: 'https://goerli.infura.io/v3/c5a142b1eeef4108b01b3d3344ef8f3c',
      blockExplorerUrl: 'https://goerli.etherscan.io',
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
      },
    },
    {
      name: 'Sepolia',
      slug: 'sepolia',
      networkVersion: '11155111',
      chainId: 'aa36a7',
      rpcUrl: 'https://sepolia.infura.io/v3/c5a142b1eeef4108b01b3d3344ef8f3c',
      blockExplorerUrl: 'https://explorer.sepolia.io',
      nativeCurrency: {
        name: 'Sepolia',
        symbol: 'ETH',
        decimals: 18,
      },
    },
    {
      name: 'Polygon Mumbai Testnet',
      slug: 'mumbai',
      networkVersion: '80001',
      chainId: '0x13881',
      rpcUrl: 'https://polygon-mumbai.infura.io/v3/c5a142b1eeef4108b01b3d3344ef8f3c',
      blockExplorerUrl: 'https://mumbai.polygonscan.com',
      nativeCurrency: {
        name: 'Matic',
        symbol: 'MATIC',
        decimals: 18,
      },
    },
    {
      name: 'BNB Smart Chain Testnet',
      slug: 'bsc_testnet',
      networkVersion: '97',
      chainId: '0x61',
      rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      blockExplorerUrl: 'https://testnet.bscscan.com',
      nativeCurrency: {
        name: 'Binance Coin',
        symbol: 'BNB',
        decimals: 18,
      },
    },
    {
      name: 'Arbitrum Goerli Testnet',
      slug: 'arbitrum_goerli',
      networkVersion: '421613',
      chainId: '0x66eed',
      rpcUrl: 'https://goerli-rollup.arbitrum.io/rpc',
      blockExplorerUrl: 'https://goerli-explorer.arbitrum.io',
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
      },
    },
    {
      name: 'Avalanche Fuji Testnet',
      slug: 'avalanche_testnet',
      networkVersion: '43113',
      chainId: '0xa869',
      rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
      blockExplorerUrl: 'https://cchain.explorer.avax-test.network/',
      nativeCurrency: {
        name: 'Avalanche',
        symbol: 'AVAX',
        decimals: 18,
      },
    },
    {
      name: 'Cronos Testnet',
      slug: 'cronos_testnet',
      networkVersion: '338',
      chainId: '0x152',
      rpcUrl: 'https://evm-t3.cronos.org',
      blockExplorerUrl: 'https://testnet.cronoscan.com',
      nativeCurrency: {
        name: 'Cronos',
        symbol: 'CRO',
        decimals: 18,
      },
    },
  ],
  tabs: [
    {
      id: '1',
      title: 'Home',
      url: 'https://dappradar.com',
    },
    {
      id: '2',
      title: 'OpenSea',
      url: 'https://opensea.io/',
    },
    {
      id: '3',
      title: 'Rarible',
      url: 'https://rarible.com/',
    },
    {
      id: '4',
      title: 'Portfolio',
      url: 'https://portfolio.metamask.io/',
    },
    {
      id: '5',
      title: 'Test Dapp',
      url: 'https://hsyndeniz.github.io/test-dapp-vconsole/',
    },
    {
      id: '6',
      title: 'Test Dapp 2',
      url: 'https://web3-react-mu.vercel.app/',
    },
    {
      id: '7',
      title: 'Discover Dapps',
      url: 'https://dap.ps/',
    },
    {
      id: '8',
      title: 'Magic Eden',
      url: 'https://magiceden.io',
    },
    {
      id: '9',
      title: 'Solana Test Dapp',
      url: 'https://r3byv.csb.app',
    },
  ],
  bookmarks: [
    {
      id: '1',
      title: 'Etherscan',
      url: 'https://etherscan.io/',
    },
    {
      id: '2',
      title: 'Bscscan',
      url: 'https://bscscan.com/',
    },
    {
      id: '3',
      title: 'Polygonscan',
      url: 'https://polygonscan.com/',
    },
    {
      id: '4',
      title: 'Snowtrace',
      url: 'https://snowtrace.io/',
    },
    {
      id: '5',
      title: 'Test Dapp',
      url: 'https://hsyndeniz.github.io/test-dapp-vconsole/',
    },
  ],
  timestamp: Date.now(),
};

const walletSlice = createSlice({
  name: 'wallet',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUniqueId: (state, action: PayloadAction<string>) => {
      state.uniqueId = action.payload;
    },
    createWallet: (state, action: PayloadAction<Wallet>) => {
      state.wallets = [action.payload];
    },
    addWallet: (state, action: PayloadAction<Wallet>) => {
      state.wallets.push(action.payload);
    },
    updateWallets: (state, action: PayloadAction<any>) => {
      state.wallets = action.payload;
    },
    setActiveWallet: (state, action: PayloadAction<number>) => {
      state.activeWallet = action.payload;
    },
    updateTokens: (state, action: PayloadAction<Wallet>) => {
      state.wallets.push(action.payload);
    },
    updateTransactions: (state, action: PayloadAction<Wallet>) => {
      state.wallets.push(action.payload);
    },
    setMnemonic: (state, action: PayloadAction<string>) => {
      state.mnemonic = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setBiometrics: (state, action: PayloadAction<boolean>) => {
      state.biometrics = action.payload;
    },
    setActiveNetwork: (state, action: PayloadAction<string>) => {
      state.activeNetwork = action.payload;
    },
    setTimestamp: (state, action: PayloadAction<number>) => {
      state.timestamp = action.payload;
    },
    setInitialised: (state, action: PayloadAction<boolean>) => {
      state.initialized = action.payload;
    },
    setOnboarding: (state, action: PayloadAction<boolean>) => {
      state.onboarding = action.payload;
    },
    setTabs: (state, action: PayloadAction<Tab[]>) => {
      state.tabs = action.payload;
    },
    setBookmarks: (state, action: PayloadAction<Tab[]>) => {
      state.bookmarks = action.payload;
    },
    updateNetworks: (state, action: PayloadAction<Network[]>) => {
      state.networks = action.payload;
    },
    setTokens: (state, action: PayloadAction<{ tokens: Token[]; index: number }>) => {
      state.wallets[action.payload.index].tokens.push(...action.payload.tokens);
    },
    setNFTs: (state, action: PayloadAction<{ nfts: NFT[]; index: number }>) => {
      state.wallets[action.payload.index].nfts.push(...action.payload.nfts);
    },
    setPriceQuotes: (state, action: PayloadAction<PriceQuote[]>) => {
      state.priceQuotes = action.payload;
    },
    setEthTransactions: (state, action: PayloadAction<{ transactions: Transaction[]; index: number }>) => {
      state.wallets[action.payload.index].transactions.ethereum = action.payload.transactions;
    },
    setBscTransactions: (state, action: PayloadAction<{ transactions: Transaction[]; index: number }>) => {
      state.wallets[action.payload.index].transactions.bsc = action.payload.transactions;
    },
    setArbitrumTransactions: (state, action: PayloadAction<{ transactions: Transaction[]; index: number }>) => {
      state.wallets[action.payload.index].transactions.arbitrum = action.payload.transactions;
    },
    setPolygonTransactions: (state, action: PayloadAction<{ transactions: Transaction[]; index: number }>) => {
      state.wallets[action.payload.index].transactions.polygon = action.payload.transactions;
    },
    setAvalancheTransactions: (state, action: PayloadAction<{ transactions: Transaction[]; index: number }>) => {
      state.wallets[action.payload.index].transactions.avalanche = action.payload.transactions;
    },
    setOptimismTransactions: (state, action: PayloadAction<{ transactions: Transaction[]; index: number }>) => {
      state.wallets[action.payload.index].transactions.optimism = action.payload.transactions;
    },
    setFantomTransactions: (state, action: PayloadAction<{ transactions: Transaction[]; index: number }>) => {
      state.wallets[action.payload.index].transactions.fantom = action.payload.transactions;
    },
    setCronosTransactions: (state, action: PayloadAction<{ transactions: Transaction[]; index: number }>) => {
      state.wallets[action.payload.index].transactions.cronos = action.payload.transactions;
    },
    resetState: state => {
      state = initialState;
    },
  },
});

export default walletSlice;

export const {
  setInitialised,
  setOnboarding,
  setUniqueId,
  setMnemonic,
  setPassword,
  setBiometrics,
  createWallet,
  addWallet,
  updateWallets,
  setActiveWallet,
  setActiveNetwork,
  setTimestamp,
  updateTokens,
  updateTransactions,
  resetState,
  setTabs,
  setBookmarks,
  updateNetworks,
  setPriceQuotes,
  setEthTransactions,
  setBscTransactions,
  setArbitrumTransactions,
  setPolygonTransactions,
  setAvalancheTransactions,
  setOptimismTransactions,
  setFantomTransactions,
  setCronosTransactions,
  setTokens,
  setNFTs,
} = walletSlice.actions;
