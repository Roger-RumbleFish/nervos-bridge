import { useEffect, useState } from 'react'

import { BigNumber, providers } from 'ethers'

import { CanonicalTokenSymbol } from '@api/types'
import { getDisplayValue } from '@components/BigNumberInput/BigNumberInput.utils'
import {
  IDisplayValue,
  AccountBoundToken,
  BridgeFeature,
  IBridge,
} from '@interfaces/data'

const DEFAULT_VALUE = getDisplayValue(BigNumber.from(0), 2, 0)

export const useBridge = ({
  bridge,
  provider,
}: {
  bridge: IBridge
  provider: providers.JsonRpcProvider
}): {
  tokens: AccountBoundToken[]
  token: AccountBoundToken
  setToken: (token: AccountBoundToken) => void
  deposit: () => void
  withdraw: () => void
  value: IDisplayValue
  setValue: (value: IDisplayValue) => void
  selectedFeature: BridgeFeature
  setSelectedFeature: (feature: BridgeFeature) => void
} => {
  const [tokens, setTokens] = useState<AccountBoundToken[]>([])
  const [token, setToken] = useState<AccountBoundToken>(null)

  const [selectedFeature, setSelectedFeature] = useState<BridgeFeature>(
    BridgeFeature.Deposit,
  )
  const [value, setValue] = useState(DEFAULT_VALUE)

  const cleanTokens = () => setTokens([])
  
  useEffect(() => {

    async function fetchTokens(): Promise<void> {
      const network = bridge.getDepositNetwork()
      const tokensRegistry = network.getTokens()

      if (selectedFeature === BridgeFeature.Deposit) {
        const tokensSymbols = Object.keys(
          tokensRegistry,
        ) as CanonicalTokenSymbol[]

        const accountAddress = await provider.getSigner().getAddress()

        const accountBoundTokens: AccountBoundToken[] = await Promise.all(
          tokensSymbols.map(async (tokenSymbol) => {
            const token = tokensRegistry[tokenSymbol]

            const balance = await network.getBalance(
              token.address,
              accountAddress,
            )
            return {
              ...token,
              balance,
            }
          }),
        )

        setTokens(accountBoundTokens)
      } else if (selectedFeature === BridgeFeature.Withdraw) {
        const network = bridge.getWithdrawalNetwork()

        const tokens = network.getTokens()
        const tokensSymbols = Object.keys(tokens) as CanonicalTokenSymbol[]

        const accountAddress = await provider.getSigner().getAddress()

        const accountBoundTokens: AccountBoundToken[] = await Promise.all(
          tokensSymbols.map(async (tokenSymbol) => {
            const token = tokens[tokenSymbol]

            const balance = await network.getBalance(
              token.address,
              accountAddress,
            )

            return {
              ...token,
              balance,
            }
          }),
        )

        setTokens(accountBoundTokens)
      }
    }

    if (provider && bridge) {
      fetchTokens()
    }
  }, [provider, bridge, selectedFeature, setTokens])

  useEffect(() => {
    cleanTokens()
  }, [selectedFeature])

  useEffect(() => {
    function setDefaultToken(token: AccountBoundToken) {
      setToken(token)
    }

    if (tokens) {
      const defaultToken = tokens[0]
      setDefaultToken(defaultToken)
    }
  }, [tokens])

  const deposit = async () => {
    const depositAmount = value.value

    await bridge.deposit(depositAmount, token)
  }

  const withdraw = async () => {
    const withdrawalAmount = value.value

    await bridge.withdraw(withdrawalAmount, {
      ...token,
      address: token.address,
    })
  }

  return {
    tokens,
    token,
    setToken,
    value,
    setValue,
    deposit,
    withdraw,
    selectedFeature,
    setSelectedFeature,
  }
}
