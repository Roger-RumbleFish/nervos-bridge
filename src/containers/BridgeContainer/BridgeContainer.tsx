import React, { useReducer, useState, useEffect, useContext } from 'react'

import { bridgeToken } from '@api/bridgeToken'
import { calculateFee } from '@api/calculateFee'
import { fetchSupportedTokens } from '@api/fetchSupportedTokens'
import Bridge from '@components/Bridge'
import Box from '@material-ui/core/Box'
import { initialState, reducer } from '@state/reducer'
import { Token } from '@state/types'
import { Networks } from '@utils/constants'
import { ConfigContext, useDebounce } from '@utils/hooks'

import { BridgeActions } from './BridgeContainer.actions'
import { BridgeSelectors } from './BridgeContainer.selectors'

const BridgeContainer: React.FC = () => {
  const DEBOUNCE = 400
  const BRIDGE_TITLE = 'Hadouken Bridge'
  const BRIDGE_DESCRIPTION =
    'Only use personal wallets. Depositing from an exchange may cause loss of funds'

  const bridgeReducer = useReducer(reducer, initialState)
  const context = useContext(ConfigContext)
  const [value, setValue] = useState('100.00')
  const [network, setNetwork] = useState(Networks.Ethereum)

  const {
    setTokens,
    setTokensRequest,
    setBaseToken,
    setQuoteToken,
    calculate,
    calculatingRequest,
  } = BridgeActions(bridgeReducer)

  const {
    isFetchingTokens,
    isCalculating,
    getFee,
    getBaseToken,
    getBaseTokensTokens,
    getExchangeResult,
    getQuoteToken,
    getQuoteTokens,
  } = BridgeSelectors(bridgeReducer)

  useEffect(() => {
    ;(async (): Promise<void> => {
      setTokensRequest()
      const tokens = await fetchSupportedTokens(context.assetsBlacklist)
      setTokens(tokens)
    })()
  }, [])

  const onNetworkChange = (network: string) => {
    setNetwork(network as Networks)
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

  const baseToken = getBaseToken()
  const quoteToken = getQuoteToken()

  const ethereumTokens = getBaseTokensTokens()
  const ckbTokens = getQuoteTokens()

  const fee = getFee()

  const exchangeResult = getExchangeResult()
  const isFetchingAllTokens = isFetchingTokens()

  const calculating = isCalculating()

  const debounceValue = useDebounce(value, DEBOUNCE)

  useEffect(() => {
    ;(async (): Promise<void> => {
      if (baseToken?.address) {
        calculatingRequest()
        const result = await calculateFee(
          baseToken.address,
          value,
          baseToken.decimals,
          network,
          context.config,
        )
        if (result) {
          calculate(result.exchangeResult, result.percentageFee)
        }
      }
    })()
  }, [baseToken.address, debounceValue, calculate, network])

  const onBridgeRequest = async () => {
    await bridgeToken(
      value,
      baseToken.decimals,
      baseToken.address,
      context.provider,
      network,
      context.config,
    )
  }

  return (
    <Box>
      <Bridge
        disableButton={context.provider === null}
        isFetchingTokens={isFetchingAllTokens}
        isCalculating={calculating}
        title={BRIDGE_TITLE}
        description={BRIDGE_DESCRIPTION}
        baseTokenAmount={value}
        quoteTokenAmount={exchangeResult?.displayValue}
        baseTokens={ethereumTokens}
        quoteTokens={ckbTokens}
        selectedBaseToken={baseToken}
        selectedQuoteToken={quoteToken}
        fee={fee}
        network={network}
        onBaseTokenChange={onBaseTokenChange}
        onQuoteTokenChange={onQuoteTokenChange}
        onBaseTokenAmountChange={onBaseTokenAmountChange}
        onBridgeRequest={onBridgeRequest}
        onNetworkChange={onNetworkChange}
      />
    </Box>
  )
}

export default BridgeContainer
