export const getTokenIcon = (symbol: string) => {
    switch (symbol) {
        case 'ETH':
            return {
                url: require('../Assets/Images/coins/ethereum.png'),
                style: {}
            }
        case 'BNB':
            return {
                url: require('../Assets/Images/coins/binance.png'),
                style: {}
            }
        case 'USDT':
            return {
                url: require('../Assets/Images/coins/tether.png'),
                style: {}
            }
        case 'AVAX':
            return {
                url: require('../Assets/Images/coins/avalanche.png'),
                style: {}
            }
        case 'MATIC':
            return {
                url: require('../Assets/Images/coins/polygon.png'),
                style: {}
            }
        case '0X':
            return {
                url: require('../Assets/Images/coins/0x.png'),
                style: {}
            }
        case 'TRX':
            return {
                url: require('../Assets/Images/coins/tron.png'),
                style: {}
            }
        case 'DOGE':
            return {
                url: require('../Assets/Images/coins/doge.png'),
                style: {}
            }
        case 'BTC':
            return {
                url: require('../Assets/Images/coins/bitcoin.png'),
                style: {}
            }
        case 'LINK':
            return {
                url: require('../Assets/Images/coins/chainlink.png'),
                style: {}
            }
        case 'WBTC':
            return {
                url: require('../Assets/Images/coins/bitcoin.png'),
                style: {}
            }
        case 'WETH':
            return {
                url: require('../Assets/Images/coins/ethereum.png'),
                style: {}
            }
        case 'FTM':
            return {
                url: require('../Assets/Images/coins/fantom-3d.png'),
                style: {}
            }
        case 'OP':
            return {
                url: require('../Assets/Images/coins/optimism.png'),
                style: {
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    marginHorizontal: 8,
                    marginVertical: 8,
                }
            }
        case 'CRO':
            return {
                url: require('../Assets/Images/coins/cronos-badge.png'),
                style: {}
            }
        default:
            return {
                url: null,
                style: {}
            }
    }
}