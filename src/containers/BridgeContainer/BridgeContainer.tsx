import React, { useReducer, useState, useEffect } from 'react'

import { BigNumber } from 'ethers'

import { calculateFee } from '@api/calculateFee'
import { fetchSupportedTokens } from '@api/fetchSupportedTokens'
import Bridge from '@components/Bridge'
import { IDisplayValue } from '@interfaces/data'
import Box from '@material-ui/core/Box'
import { initialState, reducer } from '@state/reducer'
import { Token } from '@state/types'
import { useDebounce } from '@utils/hooks'

import { BridgeActions } from './BridgeContainer.actions'
import { BridgeSelectors } from './BridgeContainer.selectors'
import { IBridgeContainerProps } from './BridgeContainer.types'

const BridgeContainer: React.FC<IBridgeContainerProps> = ({ blacklist }) => {
  const DEBOUNCE = 400
  const BRIDGE_TITLE = 'Hadouken Bridge'
  const BRIDGE_DESCRIPTION =
    'Only use personal wallets. Depositing from an exchange may cause loss of funds'

  const bridgeReducer = useReducer(reducer, initialState)

  const { setTokens, setBaseToken, setQuoteToken, calculate } = BridgeActions(
    bridgeReducer,
  )

  const {
    getFee,
    getBaseToken,
    getBaseTokensTokens,
    getExchangeResult,
    getQuoteToken,
    getQuoteTokens,
  } = BridgeSelectors(bridgeReducer)

  useEffect(() => {
    ;(async (): Promise<void> => {
      const tokens = await fetchSupportedTokens(blacklist)
      setTokens(tokens)
    })()
  }, [])

  const onBaseTokenChange = async (token: Token) => {
    setBaseToken(token.symbol)
  }

  const onQuoteTokenChange = async (token: Token) => {
    setQuoteToken(token.symbol)
  }

  const onBaseTokenAmountChange = (value: any) => {
    setValue(value)
  }

  const baseToken = getBaseToken()
  const quoteToken = getQuoteToken()

  const ethereumTokens = getBaseTokensTokens()
  const ckbTokens = getQuoteTokens()

  const exchangeResult = getExchangeResult()

  console.log({ bridgeReducer })

  const [value, setValue] = useState<IDisplayValue>({
    displayValue: '100.00',
    value: BigNumber.from(100),
  })

  const debounceValue = useDebounce(value, DEBOUNCE)

  useEffect(() => {
    ;(async (): Promise<void> => {
      if (baseToken?.address) {
        const result = await calculateFee(
          baseToken.address,
          {
            displayValue: debounceValue.displayValue,
            value: debounceValue.value,
            decimals: baseToken.decimals,
          },
          'Ethereum',
        )
        if (result) {
          calculate(result.exchangeResult, result.percentageFee)
        }
      }
    })()
  }, [baseToken.address, debounceValue, calculate])

  return (
    <Box>
      <Bridge
        title={BRIDGE_TITLE}
        description={BRIDGE_DESCRIPTION}
        baseTokenAmount={value?.displayValue}
        quoteTokenAmount={exchangeResult?.displayValue}
        baseTokens={ethereumTokens}
        quoteTokens={ckbTokens}
        selectedBaseToken={baseToken}
        selectedQuoteToken={quoteToken}
        onBaseTokenChange={onBaseTokenChange}
        onQuoteTokenChange={onQuoteTokenChange}
        onBaseTokenAmountChange={onBaseTokenAmountChange}
      />
    </Box>
  )
}

export default BridgeContainer
