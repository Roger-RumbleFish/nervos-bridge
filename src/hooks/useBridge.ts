import { useEffect, useState } from 'react'

import { BigNumber, providers } from 'ethers'

import { CanonicalTokenSymbol } from '@api/types'
import {
  AccountBoundToken,
  BridgeFeature,
  IGodwokenBridge,
} from '@interfaces/data'
import { convertIntegerDecimalToDecimal } from '@utils/stringOperations'

export const useBridge = ({
  bridge: godwokenBridge,
  provider,
}: {
  bridge: IGodwokenBridge | null
  provider: providers.JsonRpcProvider | null
}): {
  tokens: AccountBoundToken[]
  token: AccountBoundToken
  setToken: (token: AccountBoundToken) => void
  deposit: () => void
  withdraw: () => void
  value: BigNumber
  setValue: (value: BigNumber) => void
  selectedFeature: BridgeFeature
  setSelectedFeature: (feature: BridgeFeature) => void
  transactionInProgress: boolean
  error?: string
} => {
  const [initialized, setInitialized] = useState<boolean>(false)

  const [error, setError] = useState<string | undefined>()
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(
    false,
  )

  const [tokens, setTokens] = useState<AccountBoundToken[]>([])
  const [token, setToken] = useState<AccountBoundToken>(null)

  const [selectedFeature, setSelectedFeature] = useState<BridgeFeature>(
    BridgeFeature.Deposit,
  )
  const [value, setValue] = useState<BigNumber | undefined>()

  useEffect(() => {
    setInitialized(false)
  }, [godwokenBridge])

  useEffect(() => {
    const init = async (): Promise<void> => {
      await godwokenBridge.init(provider, provider)
      setInitialized(true)
    }

    if (!initialized && provider && godwokenBridge) {
      init()
    }
  }, [initialized, provider, godwokenBridge])

  useEffect(() => {
    let didCancel = false

    const cleanTokens = () => setTokens([])
    const cleanValue = () => setValue(undefined)
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
            let balance = BigNumber.from(0)
            try {
              balance = await network.getBalance(token.address, accountAddress)
            } catch (error) {
              console.error(error)
            }
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

    if (initialized && provider && godwokenBridge) {
      try {
        fetchTokens(godwokenBridge, provider)
      } catch (error) {
        console.error(error)
      }
    }

    return () => {
      didCancel = true

      cleanTokens()
      cleanValue()
    }
  }, [
    initialized,
    provider,
    selectedFeature,
    godwokenBridge,
    setTokens,
    setValue,
    transactionInProgress,
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
    const depositAmount = value

    setTransactionInProgress(true)
    await godwokenBridge.deposit(depositAmount, token)
    setTransactionInProgress(false)
  }

  const withdraw = async () => {
    const withdrawalAmount = value

    setTransactionInProgress(true)
    await godwokenBridge.withdraw(withdrawalAmount, {
      ...token,
      address: token.address,
    })
    setTransactionInProgress(false)
  }

  const setValueHandler = (value: BigNumber) => {
    if (value && token?.minimalBridgeAmount?.gt(value)) {
      setError('Below minimum threshold')
    } else {
      setError(undefined)
    }
    setValue(value)
  }

  return {
    tokens,
    token,
    setToken,
    value,
    setValue: setValueHandler,
    deposit,
    withdraw,
    selectedFeature,
    setSelectedFeature,
    transactionInProgress,
    error,
  }
}
