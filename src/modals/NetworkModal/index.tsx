import React, { FC, useRef } from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId } from '@sushiswap/core-sdk'

import PopoverModal from 'app/components/Modal/PopoverModal'
import Typography from 'app/components/Typography'
import { NETWORK_ICON, NETWORK_LABEL } from 'app/config/networks'
import { classNames } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import { ApplicationModal } from 'app/state/application/actions'
import { useModalOpen, useNetworkModalToggle } from 'app/state/application/hooks'
// @ts-ignore TYPE NEEDS FIXING
import Image from 'next/image'
import { useClickAway } from 'react-use'

export const SUPPORTED_NETWORKS: {
  [key: number]: {
    chainId: string
    chainName: string
    nativeCurrency: {
      name: string
      symbol: string
      decimals: number
    }
    rpcUrls: string[]
    blockExplorerUrls: string[]
  }
} = {
  [ChainId.ETHEREUM]: {
    chainId: '0x1',
    chainName: 'Ethereum',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.infura.io/v3'],
    blockExplorerUrls: ['https://etherscan.com'],
  },
  [ChainId.FANTOM]: {
    chainId: '0xfa',
    chainName: 'Fantom',
    nativeCurrency: {
      name: 'Fantom',
      symbol: 'FTM',
      decimals: 18,
    },
    rpcUrls: ['https://rpcapi.fantom.network'],
    blockExplorerUrls: ['https://ftmscan.com'],
  },
  [ChainId.BSC]: {
    chainId: '0x38',
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    blockExplorerUrls: ['https://bscscan.com'],
  },
  [ChainId.MATIC]: {
    chainId: '0x89',
    chainName: 'Matic',
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://polygon-rpc.com'], // ['https://matic-mainnet.chainstacklabs.com/'],
    blockExplorerUrls: ['https://polygonscan.com'],
  },
  [ChainId.HECO]: {
    chainId: '0x80',
    chainName: 'Heco',
    nativeCurrency: {
      name: 'Heco Token',
      symbol: 'HT',
      decimals: 18,
    },
    rpcUrls: ['https://http-mainnet.hecochain.com'],
    blockExplorerUrls: ['https://hecoinfo.com'],
  },
  [ChainId.XDAI]: {
    chainId: '0x64',
    chainName: 'xDai',
    nativeCurrency: {
      name: 'xDai Token',
      symbol: 'xDai',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.xdaichain.com'],
    blockExplorerUrls: ['https://blockscout.com/poa/xdai'],
  },
  [ChainId.HARMONY]: {
    chainId: '0x63564C40',
    chainName: 'Harmony',
    nativeCurrency: {
      name: 'One Token',
      symbol: 'ONE',
      decimals: 18,
    },
    rpcUrls: [
      'https://api.harmony.one',
      'https://s1.api.harmony.one',
      'https://s2.api.harmony.one',
      'https://s3.api.harmony.one',
    ],
    blockExplorerUrls: ['https://explorer.harmony.one/'],
  },
  [ChainId.AVALANCHE]: {
    chainId: '0xA86A',
    chainName: 'Avalanche Mainnet C-Chain',
    nativeCurrency: {
      name: 'Avalanche Token',
      symbol: 'AVAX',
      decimals: 18,
    },
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://snowtrace.io'],
  },
  [ChainId.OKEX]: {
    chainId: '0x42',
    chainName: 'OKEx',
    nativeCurrency: {
      name: 'OKEx Token',
      symbol: 'OKT',
      decimals: 18,
    },
    rpcUrls: ['https://exchainrpc.okex.org'],
    blockExplorerUrls: ['https://www.oklink.com/okexchain'],
  },
  [ChainId.ARBITRUM]: {
    chainId: '0xA4B1',
    chainName: 'Arbitrum',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://arbiscan.io'],
  },
  [ChainId.CELO]: {
    chainId: '0xA4EC',
    chainName: 'Celo',
    nativeCurrency: {
      name: 'Celo',
      symbol: 'CELO',
      decimals: 18,
    },
    rpcUrls: ['https://forno.celo.org'],
    blockExplorerUrls: ['https://explorer.celo.org'],
  },
  [ChainId.MOONRIVER]: {
    chainId: '0x505',
    chainName: 'Moonriver',
    nativeCurrency: {
      name: 'Moonriver',
      symbol: 'MOVR',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.moonriver.moonbeam.network'],
    blockExplorerUrls: ['https://moonriver.moonscan.io'],
  },
  [ChainId.FUSE]: {
    chainId: '0x7A',
    chainName: 'Fuse',
    nativeCurrency: {
      name: 'Fuse',
      symbol: 'FUSE',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.fuse.io'],
    blockExplorerUrls: ['https://explorer.fuse.io'],
  },
  [ChainId.TELOS]: {
    chainId: '0x28',
    chainName: 'Telos',
    nativeCurrency: {
      name: 'Telos',
      symbol: 'TLOS',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.telos.net/evm'],
    blockExplorerUrls: ['https://rpc1.us.telos.net/v2/explore'],
  },
  [ChainId.PALM]: {
    chainId: '0x2A15C308D',
    chainName: 'Palm',
    nativeCurrency: {
      name: 'Palm',
      symbol: 'PALM',
      decimals: 18,
    },
    rpcUrls: ['https://palm-mainnet.infura.io/v3/da5fbfafcca14b109e2665290681e267'],
    blockExplorerUrls: ['https://explorer.palm.io'],
  },
  [ChainId.MOONBEAM]: {
    chainId: '0x504',
    chainName: 'Moonbeam',
    nativeCurrency: {
      name: 'Glimmer',
      symbol: 'GLMR',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.api.moonbeam.network'],
    blockExplorerUrls: ['https://moonbeam.moonscan.io'],
  },
  [ChainId.MOONBEAM_TESTNET]: {
    chainId: '0x507',
    chainName: 'Moonbase',
    nativeCurrency: {
      name: 'Dev',
      symbol: 'DEV',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.api.moonbase.moonbeam.network'],
    blockExplorerUrls: ['https://moonbase.moonscan.io'],
  },

  [ChainId.MATIC_TESTNET]: {
    chainId: '0x13881',
    chainName: 'matic-testnet',
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
  },
}

interface NetworkModalProps {
  popoverCss?: string
}

export const NetworkModal: FC<NetworkModalProps> = ({ popoverCss }) => {
  const { i18n } = useLingui()
  const { chainId, library, account } = useActiveWeb3React()
  const networkModalOpen = useModalOpen(ApplicationModal.NETWORK)
  const toggleNetworkModal = useNetworkModalToggle()

  if (!chainId) return null

  return (
    <PopoverModal.Controlled popoverPanelClass={classNames("w-[16rem] mt-4 absolute top-1.5 -ml-[.5rem]  maxLg:-ml-[10px] maxLg:-mt-[18rem]", popoverCss)} isOpen={networkModalOpen} onDismiss={toggleNetworkModal}>
      <div className="flex flex-col gap-4">
        <PopoverModal.Header header={i18n._(t`Select a network open`)} onClose={toggleNetworkModal} />
        <div className="grid gap-4 overflow-y-auto mx-1">
          {[
            // ChainId.ETHEREUM,
            // ChainId.MATIC,
            // ChainId.ARBITRUM,
            // ChainId.AVALANCHE,
          
            ChainId.MATIC_TESTNET,
            // ChainId.MOONRIVER,

            // ChainId.FANTOM,
            // ChainId.BSC,
            // ChainId.XDAI,
            // ChainId.HARMONY,
            // ChainId.TELOS,
            // ChainId.CELO,
            // ChainId.FUSE,
            // ChainId.OKEX,
            // ChainId.HECO,
            // ChainId.PALM,
          ].map((key: ChainId, i: number) => {
            if (chainId === key) {
              return (
                <div
                  key={i}
                  className="bg-[rgba(0,0,0,0.2)] focus:outline-none flex items-center gap-4 w-full px-3 py-2 rounded border border-purple cursor-default"
                >
                  <img
                    // @ts-ignore TYPE NEEDS FIXING
                    src={NETWORK_ICON[key]}
                    alt="Switch Network"
                    className="rounded-md w-[32px] h-[32px]"
                  />
                  <Typography weight={700} className="text-high-emphesis">
                    {NETWORK_LABEL[key]}
                  </Typography>
                </div>
              )
            }
            return (
              <button
                key={i}
                onClick={async () => {
                  console.debug(`Switching to chain ${key}`, SUPPORTED_NETWORKS[key])
                  toggleNetworkModal()
                  const params = SUPPORTED_NETWORKS[key]
                  try {
                    await library?.send('wallet_switchEthereumChain', [{ chainId: `0x${key.toString(16)}` }, account])
                  } catch (switchError) {
                    // This error code indicates that the chain has not been added to MetaMask.
                    // @ts-ignore TYPE NEEDS FIXING
                    if (switchError.code === 4902) {
                      try {
                        await library?.send('wallet_addEthereumChain', [params, account])
                      } catch (addError) {
                        // handle "add" error
                        console.error(`Add chain error ${addError}`)
                      }
                    }
                    console.error(`Switch chain error ${switchError}`)
                    // handle other "switch" errors
                  }
                }}
                className={classNames(
                  'bg-[rgba(0,0,0,0.2)] focus:outline-none flex items-center gap-4 w-full px-3 py-2 rounded border border-Gray hover:border-blue'
                )}
              >
                {/*@ts-ignore TYPE NEEDS FIXING*/}
                <img src={NETWORK_ICON[key]} alt="Switch Network" className="rounded-md w-[32px] h-[32px] " />
                <Typography weight={700} className="text-high-emphesis">
                  {NETWORK_LABEL[key]}
                </Typography>
              </button>
            )
          })}
        </div>
      </div>
    </PopoverModal.Controlled>
  )
}

export default NetworkModal
