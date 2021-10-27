import React, { useReducer, useState, useEffect, useContext } from 'react'

import { calculateFee } from '@api/calculateFee'
// import { bridgeToken } from '@api/bridgeToken'
import { fetchTokens, bridgeToken } from '@api/dataSource/register'
import Bridge from '@components/Bridge'
import Box from '@material-ui/core/Box'
import { initialState, reducer } from '@state/reducer'
import { Token } from '@state/types'
import { ConfigContext, useDebounce } from '@utils/hooks'

import { BridgeActions } from './BridgeContainer.actions'
import messages from './BridgeContainer.messages'
import { BridgeSelectors } from './BridgeContainer.selectors'

const BridgeContainer: React.FC = () => {
  const DEBOUNCE = 400

  const bridgeReducer = useReducer(reducer, initialState)
  const { getProvider, config, assetsWhitelist } = useContext(ConfigContext)

  const provider = getProvider()
  const [value, setValue] = useState('100.00')
  const [quoteValue, setQuoteValue] = useState('100.00')

  const {
    setTokens,
    setTokensRequest,
    setNetwork,
    setBaseToken,
    setQuoteToken,
    calculate,
    calculatingRequest,
  } = BridgeActions(bridgeReducer)

  const {
    isFetchingTokens,
    isCalculating,
    getNetwork,
    getFee,
    getBaseToken,
    getBaseTokens,
    getExchangeResult,
    getQuoteToken,
    getQuoteTokens,
  } = BridgeSelectors(bridgeReducer)

  const network = getNetwork()

  useEffect(() => {
    ;(async (): Promise<void> => {
      setTokensRequest()
      const tokens = await fetchTokens(assetsWhitelist)
      console.log('Bridge Container: tokens', tokens)
      setTokens(tokens)
    })()
  }, [])

  const onNetworkChange = (newNetwork: string) => {
    if (newNetwork !== network) {
      setNetwork?.(newNetwork)
    }
  }

  const onBaseTokenChange = async (token: Token) => {
    setBaseToken(token.symbol)
  }

  const onQuoteTokenChange = async (token: Token) => {
    setQuoteToken(token.symbol)
  }

  const onBaseTokenAmountChange = (value: string) => {
    setValue(value)
  }

  const onQuoteTokenAmountChange = (value: string) => {
    setQuoteValue(value)
  }

  const baseToken = getBaseToken()
  const quoteToken = getQuoteToken()

  const baseTokens = getBaseTokens()
  const quoteTokens = getQuoteTokens()

  const fee = getFee()

  const exchangeResult = getExchangeResult()
  const isFetchingAllTokens = isFetchingTokens()

  const calculating = isCalculating()

  const debounceValue = useDebounce(value, DEBOUNCE)

  useEffect(() => {
    ;(async (): Promise<void> => {
      if (baseToken?.address && quoteToken?.address) {
        calculatingRequest()
        const result = await calculateFee(
          provider,
          baseToken,
          quoteToken,
          value,
          network,
          config,
        )
        if (result) {
          calculate(result.fee, result.percentage)
        }
      }
    })()
  }, [baseToken.address, debounceValue, calculate, network, provider])

  useEffect(() => {
    if (exchangeResult?.displayValue) {
      setQuoteValue(exchangeResult?.displayValue)
    }
  }, [exchangeResult?.value])

  const onBridgeRequest = async () => {
    await bridgeToken(
      value,
      baseToken.decimals,
      baseToken.address,
      provider,
      network,
      config,
    )
  }
  console.log('bridge::BridgeContainer::value', value)
  console.log('bridge::BridgeContainer::baseToken', baseToken)
  console.log('bridge::BridgeContainer::baseTokens', baseTokens)
  console.log('bridge::BridgeContainer::quoteTokens', quoteTokens)

  return (
    <Box>
      <Bridge
        disableButton={provider === null}
        isFetchingTokens={isFetchingAllTokens}
        isCalculating={calculating}
        title={messages.BRIDGE_TITLE}
        description={messages.BRIDGE_DESCRIPTION}
        baseTokenAmount={value}
        quoteTokenAmount={quoteValue}
        baseTokens={baseTokens}
        quoteTokens={quoteTokens}
        selectedBaseToken={baseToken}
        selectedQuoteToken={quoteToken}
        fee={fee}
        network={network}
        onBaseTokenChange={onBaseTokenChange}
        onQuoteTokenChange={onQuoteTokenChange}
        onBaseTokenAmountChange={onBaseTokenAmountChange}
        onQuoteTokenAmountChange={onQuoteTokenAmountChange}
        onBridgeRequest={onBridgeRequest}
        onNetworkChange={onNetworkChange}
      />
    </Box>
  )
}

export default BridgeContainer
