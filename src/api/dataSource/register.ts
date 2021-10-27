import { providers } from 'ethers'
import { AddressTranslator } from 'nervos-godwoken-integration'
import Web3 from 'web3'

import { BridgeToken } from '@interfaces/data'
import { Networks } from '@utils/constants'
import { IConfigContext } from '@utils/hooks'
import { convertDecimalToIntegerDecimal } from '@utils/stringOperations'

import { bridgeToken as ethL2bridgeToken } from './eth-l2/bridgeToken'
import { fetchTokens as ethL2FeatchTokens } from './eth-l2/tokens'
import { bridgeToken as L1L2bridgeToken } from './l1-l2/bridgeToken'
import { fetchTokens as L1L2FeatchTokens } from './l1-l2/tokens'

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
    const accounts = await provider?.listAccounts()
    const userAddress = accounts[0]

    const addressTranslator = new AddressTranslator(config?.addressTranslator)
    const web3 = new Web3(Web3.givenProvider)

    const recipient = await addressTranslator.getLayer2DepositAddress(
      web3,
      userAddress,
    )

    if (network === Networks.Ethereum) {
      const amountRaw = convertDecimalToIntegerDecimal(
        amount,
        decimals,
      ).toString()

      await ethL2bridgeToken(
        amountRaw,
        tokenAddress,
        userAddress,
        provider,
        network,
        config,
      )
    } else if (network === Networks.NervosL1) {
      const amountRaw = convertDecimalToIntegerDecimal(
        amount,
        decimals,
      ).toString()
      await L1L2bridgeToken(
        amount,
        tokenAddress,
        userAddress,
        provider,
        network,
        config,
      )
    }
    console.log(recipient)
  } catch (error) {
    console.error(error)
  }
}
