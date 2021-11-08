import { providers } from 'ethers'
import { AddressTranslator } from 'nervos-godwoken-integration'
import Web3 from 'web3'

import { BridgeToken } from '@interfaces/data'
import { Networks } from '@utils/constants'
import { IConfigContext } from '@utils/hooks'
import { convertDecimalToIntegerDecimal } from '@utils/stringOperations'

import { fetchBalances as fetchCkbBalances } from './ckb/fetchBalances'
import { fetchBalances as fetchEthereumBalances } from './ckb/fetchBalances'
import { bridgeToken as ethL2bridgeToken } from './ethereum/bridgeToken'
import { fetchTokens as ethL2FeatchTokens } from './ethereum/tokens'
import { bridgeToken as L1L2bridgeToken } from './ckb/bridgeToken'
import { getTokens as L1L2FeatchTokens } from './ckb/getTokens'

export const fetchTokens = async (
  tokensWhitelist?: string[],
): Promise<BridgeToken[]> => {
  const ethL2Tokens = await ethL2FeatchTokens(tokensWhitelist)
  const l1l2Tokens = await L1L2FeatchTokens()

  return [...ethL2Tokens, ...l1l2Tokens]
}

export const bridgeToken = async (
  amount: string,
  decimals: number,
  tokenAddress: string,
  provider: providers.Web3Provider,
  network: string,
  config?: IConfigContext['config'],
): Promise<void> => {
  try {
    const [ ethereumAccountAddress] = await provider?.listAccounts()

    if (network === Networks.Ethereum) {
      await ethL2bridgeToken(
        amount,
        tokenAddress,
        ethereumAccountAddress,
        provider,
        network,
        config,
      )
    } else if (network === Networks.NervosL1) {
      await L1L2bridgeToken(
        amount,
        tokenAddress,
        ethereumAccountAddress,
        provider,
        network,
        config,
      )
    }
  } catch (error) {
    console.error(error)
  }
}

export const fetchBalances = async (
  network: string,
  provider: providers.Web3Provider,
  tokensWhitelist?: string[],
): Promise<void> => {
  try {
    if (network === Networks.Ethereum) {
      console.log("Ethereum Balances")
      const ethTokens = await ethL2FeatchTokens(tokensWhitelist)
      await fetchEthereumBalances(ethTokens, provider)
    } else if (network === Networks.NervosL1) {
      console.log("CKB Balances")
      const ckbTokens = await L1L2FeatchTokens()
      await fetchCkbBalances(
        ckbTokens,
        provider,
      )
    }
  } catch (error) {
    console.error(error)
  }
}

export const withdrawToken = async (
  amount: string,
  decimals: number,
  tokenAddress: string,
  provider: providers.Web3Provider,
  network: string,
  config?: IConfigContext['config'],
): Promise<void> => {
  try {
    const [ ethereumAccountAddress] = await provider?.listAccounts()

    if (network === Networks.Ethereum) {
      await ethL2bridgeToken(
        amount,
        tokenAddress,
        ethereumAccountAddress,
        provider,
        network,
        config,
      )
    } else if (network === Networks.NervosL1) {
      console.log('not yet implemented')
    }
  } catch (error) {
    console.error(error)
  }
}