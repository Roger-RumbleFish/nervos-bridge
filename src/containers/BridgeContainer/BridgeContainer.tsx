import React, { useReducer, useState, useEffect, useContext } from 'react'

import { calculateFee } from '@api/calculateFee'
import { fetchTokens, bridgeToken, fetchBalances } from '@api/bridges/__register'
import Bridge from '@components/Bridge'
import NetworkSelector from '@components/network/NetworkSelector'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { initialState, reducer } from '@state/reducer'
import { AccountBoundToken, Token } from '@state/types'
import { ConfigContext, useDebounce } from '@utils/hooks'

import { BridgeActions } from './BridgeContainer.actions'
import messages from './BridgeContainer.messages'
import { BridgeSelectors } from './BridgeContainer.selectors'
import { BigNumber } from '@ethersproject/bignumber'
import { Button, Theme, useMediaQuery } from '@material-ui/core'

const BridgeContainer: React.FC = () => {
  const isMobile = !useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

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
    ; (async (): Promise<void> => {
      setTokensRequest()
      const tokens = await fetchTokens(assetsWhitelist)
      console.log('Bridge Container: tokens', tokens)
      setTokens(tokens)
    })()
  }, [])

  useEffect(() => {
    ;(async (): Promise<void> => {
      console.log('Bridge Container: balances effect')
      if (provider) {
        await fetchBalances(network, provider)
        console.log('Bridge Container: balances')
      }
    })()
  }, [provider, network])

  const bindAccountBalanceToToken = (token: Token): AccountBoundToken => ({
    ...token,
    balance: BigNumber.from(0)
  })
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
    ; (async (): Promise<void> => {
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
    <Box padding={{ xs: 2, sm: 10 }} bgcolor="white" borderRadius={8}>
      <Box display={{ xs: 'block', sm: 'flex' }} justifyContent="space-between">
        <Box>
          <Typography variant="h4">{messages.BRIDGE_TITLE}</Typography>
          <Typography variant="body1">{messages.BRIDGE_DESCRIPTION}</Typography>
        </Box>
        <Box
          maxWidth={500}
          minWidth={{ xs: 250, sm: 320 }}
          py={{ xs: 2, sm: 0 }}
        >
          <NetworkSelector
            selectedNetwork={network}
            onChange={onNetworkChange}
          />
        </Box>
      </Box>

      <Bridge
        disableButton={provider === null}
        isFetchingTokens={isFetchingAllTokens}
        isCalculating={calculating}
        title={messages.BRIDGE_TITLE}
        description={messages.BRIDGE_DESCRIPTION}
        baseTokenAmount={value}
        quoteTokenAmount={quoteValue}
        baseTokens={baseTokens.map(bindAccountBalanceToToken)}
        quoteTokens={quoteTokens.map(bindAccountBalanceToToken)}
        selectedBaseToken={bindAccountBalanceToToken(baseToken)}
        selectedQuoteToken={bindAccountBalanceToToken(quoteToken)}
        fee={fee}
        network={network}
        onBaseTokenChange={onBaseTokenChange}
        onQuoteTokenChange={onQuoteTokenChange}
        onBaseTokenAmountChange={onBaseTokenAmountChange}
        onQuoteTokenAmountChange={onQuoteTokenAmountChange}
        onDepositRequest={onBridgeRequest}
        onNetworkChange={onNetworkChange}
      />
      <Box mt={2} width={{ xs: '100%', sm: 'auto' }}>
        <Button
          style={{ width: isMobile ? '100%' : 'auto' }}
          disabled={provider === null}
          variant="contained"
          color="primary"
          onClick={onBridgeRequest}
        >
          Bridge
        </Button>
      </Box>
    </Box>
  )
}

export default BridgeContainer
