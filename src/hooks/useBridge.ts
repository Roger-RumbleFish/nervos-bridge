import { useEffect, useState } from 'react'

import { BigNumber, providers } from 'ethers'

import { CanonicalTokenSymbol } from '@api/types'
import {
  IDisplayValue,
  AccountBoundToken,
  BridgeFeature,
  IGodwokenBridge,
} from '@interfaces/data'
import { getDisplayValue } from '@utils/stringOperations'

const DEFAULT_VALUE = getDisplayValue(BigNumber.from(0), 2, 0)

export const useBridge = ({
  bridge: godwokenBridge,
  provider,
  polyjuiceProvider,
}: {
  bridge: IGodwokenBridge | null
  provider: providers.JsonRpcProvider | null
  polyjuiceProvider: providers.JsonRpcProvider | null
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
  const [initialized, setInitialized] = useState<boolean>(false)

  const [tokens, setTokens] = useState<AccountBoundToken[]>([])
  const [token, setToken] = useState<AccountBoundToken>(null)

  const [selectedFeature, setSelectedFeature] = useState<BridgeFeature>(
    BridgeFeature.Deposit,
  )
  const [value, setValue] = useState(DEFAULT_VALUE)

  useEffect(() => {
    setInitialized(false)
  }, [godwokenBridge])

  useEffect(() => {
    const init = async (): Promise<void> => {
      await godwokenBridge.init(provider, polyjuiceProvider)
      setInitialized(true)
    }

    if (!initialized && provider && polyjuiceProvider && godwokenBridge) {
      init()
    }
  }, [initialized, provider, polyjuiceProvider, godwokenBridge])

  useEffect(() => {
    let didCancel = false

    const cleanTokens = () => setTokens([])
    const fetchTokens = async (
      bridge: IGodwokenBridge,
      provider: providers.JsonRpcProvider,
    ): Promise<void> => {
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

        if (!didCancel) {
          setTokens(accountBoundTokens)
        }
      } else if (selectedFeature === BridgeFeature.Withdraw) {
        const network = godwokenBridge.getWithdrawalNetwork()

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

        if (!didCancel) {
          setTokens(accountBoundTokens)
        }
      }
    }

    if (initialized && provider && polyjuiceProvider && godwokenBridge) {
      fetchTokens(godwokenBridge, provider)
    }

    return () => {
      didCancel = true

      cleanTokens()
    }
  }, [
    initialized,
    provider,
    polyjuiceProvider,
    selectedFeature,
    godwokenBridge,
    setTokens,
  ])

  useEffect(() => {
    function setDefaultToken(token: AccountBoundToken) {
      setToken(token)
    }

    if (tokens) {
      const defaultToken = tokens[0]
      setDefaultToken(defaultToken)
    }
  }, [selectedFeature, godwokenBridge, setToken, tokens])

  const deposit = async () => {
    const depositAmount = value.value

    await godwokenBridge.deposit(depositAmount, token)
  }

  const withdraw = async () => {
    const withdrawalAmount = value.value

    await godwokenBridge.withdraw(withdrawalAmount, {
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
