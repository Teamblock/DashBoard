// import { ChainId } from './enums/ChainId'
// import { ChainId } from '@sushiswap/core-sdk'

import { AbstractConnector } from '@web3-react/abstract-connector'
import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from 'app/entities/connectors'

import RPC from './rpc'

const ChainId = {
  80001: "MATIC_TESTNET",
  MATIC_TESTNET: 80001,
}
const supportedChainIds = Object.values(ChainId) as number[]



export const network = new NetworkConnector({
  defaultChainId: 80001,
  urls: RPC,
})

export const injected = new InjectedConnector({
  supportedChainIds,
})

export interface WalletInfo {
  connector?: (() => Promise<AbstractConnector>) | AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'injected.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true,
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
  },
  METAMASK_MOBILE: {
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Open in MetaMask app.',
    href: 'https://metamask.app.link/dapp/test.energyfi.app',
    color: '#E8831D',
    mobile: true,
    mobileOnly: true,
  },
  WALLET_CONNECT: {
    connector: async () => {
      const WalletConnectConnector = (await import('@web3-react/walletconnect-connector')).WalletConnectConnector
      return new WalletConnectConnector({
        rpc: RPC,
        bridge: 'https://bridge.walletconnect.org',
        qrcode: true,
        supportedChainIds,
      })
    },
    name: 'WalletConnect',
    iconName: 'wallet-connect.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true,
  },
}
