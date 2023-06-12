import { ChainId, Token } from '@sushiswap/core-sdk'

export const USDC = new Token(ChainId.MATIC_TESTNET, '0x92DAFBf64e40e4777Cb73b6f76356a75E4D6157F', 6, 'USDC', 'USDC Coin')
export const WETH = new Token(
  ChainId.MATIC_TESTNET,
  '0x2D513351f026521Dd90AFbd00781C436227F4632',
  18,
  'WETH',
  'Wrapped Ether'
)
export const XTWT_CALL = new Token(
  ChainId.MATIC_TESTNET,
  '0x32eC66bed5F45E1ED247752f2924A4D9FdFC4CBD',
  18,
  'xTWT',
  'TwinBar'
)