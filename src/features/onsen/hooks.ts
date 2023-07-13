import { Zero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import {
  ChainId,
  CurrencyAmount,
  JSBI,
  MASTERCHEF_ADDRESS,
  MASTERCHEF_V2_ADDRESS,
  MINICHEF_ADDRESS,
  SUSHI,
} from '@sushiswap/core-sdk'
import { OLD_FARMS } from 'app/config/farms'
import {
  useMasterChefContract,
  useMasterChefV2Contract,
  useMiniChefContract,
  useOldFarmsContract,
} from 'app/hooks/useContract'
import { useActiveWeb3React } from 'app/services/web3'
import { NEVER_RELOAD, useSingleCallResult, useSingleContractMultipleData } from 'app/state/multicall/hooks'
import concat from 'lodash/concat'
import zip from 'lodash/zip'
import { useCallback, useMemo } from 'react'

import { Chef } from './enum'

export function useChefContract(chef: Chef) {
  const masterChefContract = useMasterChefContract()
  const masterChefV2Contract = useMasterChefV2Contract()
  const miniChefContract = useMiniChefContract()
  const oldFarmsContract = useOldFarmsContract()
  const contracts = useMemo(
    () => ({
      [Chef.MASTERCHEF]: masterChefContract,
      [Chef.MASTERCHEF_V2]: masterChefV2Contract,
      [Chef.MINICHEF]: miniChefContract,
      [Chef.OLD_FARMS]: oldFarmsContract,
    }),
    [masterChefContract, masterChefV2Contract, miniChefContract, oldFarmsContract]
  )
  return useMemo(() => {
    return contracts[chef]
  }, [contracts, chef])
}

export function useChefContracts(chefs: Chef[]) {
  const masterChefContract = useMasterChefContract()
  const masterChefV2Contract = useMasterChefV2Contract()
  const miniChefContract = useMiniChefContract()
  const oldFarmsContract = useOldFarmsContract()
  const contracts = useMemo(
    () => ({
      [Chef.MASTERCHEF]: masterChefContract,
      [Chef.MASTERCHEF_V2]: masterChefV2Contract,
      [Chef.MINICHEF]: miniChefContract,
      [Chef.OLD_FARMS]: oldFarmsContract,
    }),
    [masterChefContract, masterChefV2Contract, miniChefContract, oldFarmsContract]
  )
  return chefs.map((chef) => contracts[chef])
}

// @ts-ignore TYPE NEEDS FIXING
export function useUserInfo(farm, token) {
  const { account } = useActiveWeb3React()

  const contract = useChefContract(farm.chef)

  const args = useMemo(() => {
    if (!account) {
      return
    }
    return [String(farm.id), String(account)]
  }, [farm, account])

  const result = useSingleCallResult(args ? contract : null, 'userInfo', args)?.result

  const value = result?.[0]

  const amount = value ? JSBI.BigInt(value.toString()) : undefined
  return amount ? CurrencyAmount?.fromRawAmount(token, amount) : undefined
}

// @ts-ignore TYPE NEEDS FIXING
export function usependingEnergyFi(farm) {
  const { account, chainId } = useActiveWeb3React()

  const contract = useChefContract(farm.chef)

  const args = useMemo(() => {
    if (!account) {
      return
    }
    return [String(farm.id), String(account)]
  }, [farm, account])

  const result = useSingleCallResult(args ? contract : null, 'pendingEnergyFi', args)?.result

  const value = result?.[0]

  const amount = value ? JSBI.BigInt(value.toString()) : undefined
 
  

  // @ts-ignore TYPE NEEDS FIXING
  return amount ? CurrencyAmount?.fromRawAmount(SUSHI[chainId], amount) : undefined
}

// @ts-ignore TYPE NEEDS FIXING
export function usePendingToken(farm, contract) {
  const { account } = useActiveWeb3React()

  const args = useMemo(() => {
    if (!account || !farm) {
      return
    }
    return [String(farm.pid), String(account)]
  }, [farm, account])

  const pendingTokens = useSingleContractMultipleData(
    args ? contract : null,
    'pendingTokens',
    // @ts-ignore TYPE NEEDS FIXING
    args.map((arg) => [...arg, '0'])
  )

  return useMemo(() => pendingTokens, [pendingTokens])
}

export function useChefPositions(contract?: Contract | null, rewarder?: Contract | null, chainId = undefined) {
  const { account } = useActiveWeb3React()

  const numberOfPools = useSingleCallResult(contract ? contract : null, 'poolLength', undefined, NEVER_RELOAD)
    ?.result?.[0]

  const args = useMemo(() => {
    if (!account || !numberOfPools) {
      return
    }
    return [...Array(numberOfPools.toNumber()).keys()].map((pid) => [String(pid), String(account)])
  }, [numberOfPools, account])

  // @ts-ignore TYPE NEEDS FIXING
  const pendingEnergyFi = useSingleContractMultipleData(args ? contract : null, 'pendingEnergyFi', args)

  // @ts-ignore TYPE NEEDS FIXING
  const userInfo = useSingleContractMultipleData(args ? contract : null, 'userInfo', args)

  // const pendingTokens = useSingleContractMultipleData(
  //     rewarder,
  //     'pendingTokens',
  //     args.map((arg) => [...arg, '0'])
  // )

  const getChef = useCallback(() => {
    // @ts-ignore TYPE NEEDS FIXING
    if (MASTERCHEF_ADDRESS[chainId] === contract.address) {
      return Chef.MASTERCHEF
      // @ts-ignore TYPE NEEDS FIXING
    } else if (MASTERCHEF_V2_ADDRESS[chainId] === contract.address) {
      return Chef.MASTERCHEF_V2
      // @ts-ignore TYPE NEEDS FIXING
    } else if (MINICHEF_ADDRESS[chainId] === contract.address) {
      return Chef.MINICHEF
      // @ts-ignore TYPE NEEDS FIXING
    } else if (OLD_FARMS[chainId] === contract.address) {
      return Chef.OLD_FARMS
    }
  }, [chainId, contract])

  return useMemo(() => {
    if (!pendingEnergyFi && !userInfo) {
      return []
    }
    return zip(pendingEnergyFi, userInfo)
      .map((data, i) => ({
        // @ts-ignore TYPE NEEDS FIXING
        id: args[i][0],
        // @ts-ignore TYPE NEEDS FIXING
        pendingEnergyFi: data[0].result?.[0] || Zero,
        // @ts-ignore TYPE NEEDS FIXING
        amount: data[1].result?.[0] || Zero,
        chef: getChef(),
        // pendingTokens: data?.[2]?.result,
      }))
      .filter(({ pendingEnergyFi, amount }) => {
        return (pendingEnergyFi && !pendingEnergyFi.isZero()) || (amount && !amount.isZero())
      })
  }, [args, getChef, pendingEnergyFi, userInfo])
}

export function usePositions(chainId: ChainId | undefined) {
  const [masterChefV1Positions, masterChefV2Positions, miniChefPositions] = [
    // @ts-ignore TYPE NEEDS FIXING
    useChefPositions(useMasterChefContract(), undefined, chainId),
    // @ts-ignore TYPE NEEDS FIXING
    useChefPositions(useMasterChefV2Contract(), undefined, chainId),
    // @ts-ignore TYPE NEEDS FIXING
    useChefPositions(useMiniChefContract(), undefined, chainId),
  ]
  return concat(masterChefV1Positions, masterChefV2Positions, miniChefPositions)
}
