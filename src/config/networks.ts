import { ChainId } from '@sushiswap/core-sdk';

const Arbitrum = 'https://raw.githubusercontent.com/sushiswap/icons/master/network/arbitrum.jpg'
const Avalanche = 'https://raw.githubusercontent.com/sushiswap/icons/master/network/avalanche.jpg'
const Bsc = 'https://raw.githubusercontent.com/sushiswap/icons/master/network/bsc.jpg'
const Fantom = 'https://raw.githubusercontent.com/sushiswap/icons/master/network/fantom.jpg'
const Goerli = 'https://raw.githubusercontent.com/sushiswap/icons/master/network/goerli.jpg'
const Harmony = 'https://raw.githubusercontent.com/sushiswap/icons/master/network/harmonyone.jpg'
const Heco = 'https://raw.githubusercontent.com/sushiswap/icons/master/network/heco.jpg'
const Kovan = 'https://raw.githubusercontent.com/sushiswap/icons/master/network/kovan.jpg'
const Mainnet = 'https://raw.githubusercontent.com/sushiswap/icons/master/network/mainnet.jpg'
const Matic = 'https://res.cloudinary.com/sushi-cdn/image/fetch/f_auto,c_limit,w_32,q_auto/https://raw.githubusercontent.com/sushiswap/icons/master/network/polygon.jpg'
const Moonbeam = 'https://res.cloudinary.com/sushi-cdn/image/fetch/f_auto,c_limit,w_48,q_auto/https://raw.githubusercontent.com/ujjwalsahayatwork/icons/main/tokens/moonbeam-logo.png?token=GHSAT0AAAAAAB3RFFNOMFRLPRXP56L4KE7SY7XAV2A'
const Moonbase = 'https://res.cloudinary.com/sushi-cdn/image/fetch/f_auto,c_limit,w_48,q_auto/https://raw.githubusercontent.com/ujjwalsahayatwork/icons/main/tokens/moonbeam-logo.png?token=GHSAT0AAAAAAB3RFFNOMFRLPRXP56L4KE7SY7XAV2A'
const OKEx = 'https://raw.githubusercontent.com/sushiswap/icons/master/network/okex.jpg'
const Polygon = 'https://raw.githubusercontent.com/sushiswap/icons/master/network/polygon.jpg'
const Rinkeby = 'https://raw.githubusercontent.com/sushiswap/icons/master/network/rinkeby.jpg'
const Ropsten = 'https://raw.githubusercontent.com/sushiswap/icons/master/network/ropsten.jpg'
const xDai = 'https://raw.githubusercontent.com/sushiswap/icons/master/network/gnosis.jpg'
const Celo = 'https://raw.githubusercontent.com/sushiswap/icons/master/network/celo.jpg'
const Palm = 'https://raw.githubusercontent.com/sushiswap/icons/master/network/palm.jpg'
const Moonriver = 'https://res.cloudinary.com/sushi-cdn/image/fetch/f_auto,c_limit,w_48,q_auto/https://raw.githubusercontent.com/ujjwalsahayatwork/icons/main/tokens/movr.jpg?token=GHSAT0AAAAAAB3RFFNORD57MV55F4AFKGVKY7XAXBA'
const Fuse = 'https://raw.githubusercontent.com/sushiswap/icons/master/network/fuse.jpg'
const Telos = 'https://raw.githubusercontent.com/sushiswap/icons/master/network/telos.jpg'

export const NETWORK_ICON = {
  [ChainId.ETHEREUM]: Mainnet,
  [ChainId.ROPSTEN]: Ropsten,
  [ChainId.RINKEBY]: Rinkeby,
  [ChainId.GÖRLI]: Goerli,
  [ChainId.KOVAN]: Kovan,
  [ChainId.FANTOM]: Fantom,
  [ChainId.FANTOM_TESTNET]: Fantom,
  [ChainId.BSC]: Bsc,
  [ChainId.BSC_TESTNET]: Bsc,
  [ChainId.MATIC]: Polygon,
  [ChainId.MATIC_TESTNET]: Matic,
  [ChainId.XDAI]: xDai,
  [ChainId.ARBITRUM]: Arbitrum,
  [ChainId.ARBITRUM_TESTNET]: Arbitrum,
  [ChainId.MOONBEAM_TESTNET]: Moonbase,
  [ChainId.AVALANCHE]: Avalanche,
  [ChainId.AVALANCHE_TESTNET]: Avalanche,
  [ChainId.HECO]: Heco,
  [ChainId.HECO_TESTNET]: Heco,
  [ChainId.HARMONY]: Harmony,
  [ChainId.HARMONY_TESTNET]: Harmony,
  [ChainId.OKEX]: OKEx,
  [ChainId.OKEX_TESTNET]: OKEx,
  [ChainId.CELO]: Celo,
  [ChainId.PALM]: Palm,
  [ChainId.MOONRIVER]: Moonriver,
  [ChainId.FUSE]: Fuse,
  [ChainId.TELOS]: Telos,
  [ChainId.MOONBEAM]: Moonbeam,
}

export const NETWORK_LABEL: { [chainId in ChainId]?: string } = {
  [ChainId.ETHEREUM]: 'Ethereum',
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.GÖRLI]: 'Görli',
  [ChainId.KOVAN]: 'Kovan',
  [ChainId.FANTOM]: 'Fantom',
  [ChainId.FANTOM_TESTNET]: 'Fantom Testnet',
  [ChainId.MATIC]: 'Polygon',
  [ChainId.MATIC_TESTNET]: 'Mumbai',
  [ChainId.XDAI]: 'Gnosis',
  [ChainId.ARBITRUM]: 'Arbitrum',
  [ChainId.ARBITRUM_TESTNET]: 'Arbitrum Testnet',
  [ChainId.BSC]: 'BSC',
  [ChainId.BSC_TESTNET]: 'BSC Testnet',
  [ChainId.MOONBEAM_TESTNET]: 'Moonbase',
  [ChainId.AVALANCHE]: 'Avalanche',
  [ChainId.AVALANCHE_TESTNET]: 'Fuji',
  [ChainId.HECO]: 'HECO',
  [ChainId.HECO_TESTNET]: 'HECO Testnet',
  [ChainId.HARMONY]: 'Harmony',
  [ChainId.HARMONY_TESTNET]: 'Harmony Testnet',
  [ChainId.OKEX]: 'OKEx',
  [ChainId.OKEX_TESTNET]: 'OKEx',
  [ChainId.CELO]: 'Celo',
  [ChainId.PALM]: 'Palm',
  [ChainId.MOONRIVER]: 'Moonriver',
  [ChainId.FUSE]: 'Fuse',
  [ChainId.TELOS]: 'Telos EVM',
  [ChainId.MOONBEAM]: 'Moonbeam',
}
