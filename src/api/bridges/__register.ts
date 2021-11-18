import { providers } from 'ethers'

// import { AddressTranslator } from 'nervos-godwoken-integration'
// import Web3 from 'web3'
// import { Godwoken } from '@api/godwoken'
import { BridgedToken, IDisplayValue } from '@interfaces/data'
import { Networks } from '@utils/constants'
import { IConfigContext } from '@utils/hooks'

// import { convertDecimalToIntegerDecimal } from '@utils/stringOperations'
import { bridgeToken as L1L2bridgeToken } from './ckb/bridgeToken'
import { fetchBalances as fetchCkbBalances } from './ckb/fetchBalances'
import { getTokens as L1L2FeatchTokens } from './ckb/getTokens'
import { withdrawToken as withdrawToCkbToken } from './ckb/withdraw'
import { bridgeToken as ethL2bridgeToken } from './ethereum/bridgeToken'
import { withdrawToken as withdrawToEthToken } from './ethereum/withdrawToken'

export const fetchTokens = async (
  tokensWhitelist?: string[],
): Promise<BridgedToken[]> => {
  const ethL2Tokens: BridgedToken[] = []
  const l1l2Tokens = await L1L2FeatchTokens()
  console.log('[bridge][l1-l2]', l1l2Tokens)

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
    const [ethereumAccountAddress] = await provider?.listAccounts()

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
): Promise<IDisplayValue[]> => {
  try {
    if (network === Networks.Ethereum) {
      console.log('[balances][fetchBalances] network', network)
      const balances: IDisplayValue[] = []
      return balances
    } else if (network === Networks.NervosL1) {
      console.log('CKB Balances')
      const ckbTokens = await L1L2FeatchTokens()
      console.log('[bridge] ckb bridge tokens', ckbTokens)
      const balances = await fetchCkbBalances(ckbTokens, provider)
      return balances
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
    const [ethereumAccountAddress] = await provider?.listAccounts()

    if (network === Networks.Ethereum) {
      await withdrawToEthToken(
        amount,
        tokenAddress,
        ethereumAccountAddress,
        provider,
        network,
        config,
      )
    } else if (network === Networks.NervosL1) {
      await withdrawToCkbToken(
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
