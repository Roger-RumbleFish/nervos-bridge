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
  bridge: godwokenBridge,
  provider,
  polyjuiceProvider,
}: {
  bridge: IBridge | null
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
  console.log('[bridge][use bridge] ****************************')
  console.log('[bridge][use bridge] used bridge', godwokenBridge?.name)
  console.log('[bridge][use bridge]', provider, polyjuiceProvider)
  const [initialized, setInitialized] = useState<boolean>(false)

  // const prevBridge = useRef<IBridge>()

  const [tokens, setTokens] = useState<AccountBoundToken[]>([])
  const [token, setToken] = useState<AccountBoundToken>(null)

  const [selectedFeature, setSelectedFeature] = useState<BridgeFeature>(
    BridgeFeature.Deposit,
  )
  const [value, setValue] = useState(DEFAULT_VALUE)

  useEffect(() => {
    //assign the ref's current value to the count Hook
    console.log('[bridge][use bridge] bridge changed', godwokenBridge?.name)
    // prevBridge.current = godwokenBridge
    setInitialized(false)
  }, [godwokenBridge])

  // useEffect(() => {
  // }, [godwokenBridge, selectedFeature])

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
      bridge: IBridge,
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
      console.log('[bridge][use bridge] fetch tokens', initialized, provider, polyjuiceProvider, godwokenBridge)
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
