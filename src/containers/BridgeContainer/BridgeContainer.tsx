import React, { useReducer, useState, useEffect, useContext } from 'react'

import { BigNumber } from 'ethers'

import { CanonicalTokenSymbol } from '@api/types'
import Bridge from '@components/Bridge'
import ErrorLabel from '@components/ErrorLabel'
import Toggle from '@components/Toggle'
import { AccountBoundToken, Token, BridgeFeature } from '@interfaces/data'
import { Button, Paper, Theme, useMediaQuery } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { initialState, reducer } from '@state/reducer'
import { ConfigContext } from '@utils/hooks'

import { BridgeActions } from './BridgeContainer.actions'
import { BRIDGE_FEATURES_LABELS } from './BridgeContainer.constants'
import { messages, errorMessages } from './BridgeContainer.messages'
import { BridgeSelectors } from './BridgeContainer.selectors'

const DEFAULT_VALUE = '100.00'

const BridgeContainer: React.FC = () => {
  const isMobile = !useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

  // const DEBOUNCE = 400

  const [selectedFeature, setSelectedFeature] = useState<BridgeFeature>(BridgeFeature.Deposit)

  const bridgeReducer = useReducer(reducer, initialState)

  const { provider, bridge } = useContext(ConfigContext)

  const [value, setValue] = useState(DEFAULT_VALUE)
  const [quoteValue, setQuoteValue] = useState(DEFAULT_VALUE)

  const {
    setTokens,
    setTokensRequest,
    setBaseToken,
    setQuoteToken,
    // calculate,
    // calculatingRequest,
  } = BridgeActions(bridgeReducer)

  const {
    isFetchingTokens: isFetchingTokensSelector,
    // isCalculating,
    // getFee,
    getBaseToken,
    getBaseTokens,
    // getExchangeResult,
    getQuoteToken,
    getQuoteTokens,
  } = BridgeSelectors(bridgeReducer)

  useEffect(() => {
    ;(async (): Promise<void> => {
      setTokensRequest()

      if (provider && bridge) {
        if (selectedFeature === BridgeFeature.Deposit) {
          const network = bridge.getDepositNetwork()

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
    })()
  }, [provider, bridge, selectedFeature, setTokens, setTokensRequest])

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

  // const fee = getFee()

  // const exchangeResult = getExchangeResult()
  const isFetchingTokens = isFetchingTokensSelector()

  // const calculating = isCalculating()

  // const debounceValue = useDebounce(value, DEBOUNCE)

  // useEffect(() => {
  //   ;(async (): Promise<void> => {
  //     if (baseToken?.address && quoteToken?.address) {
  //       calculatingRequest()
  //       const result = await calculateFee(
  //         provider,
  //         baseToken,
  //         quoteToken,
  //         value,
  //         network,
  //         config,
  //       )
  //       if (result) {
  //         calculate(result.fee, result.percentage)
  //       }
  //     }
  //   })()
  // }, [baseToken.address, debounceValue, calculate, network, provider])

  // useEffect(() => {
  //   if (exchangeResult?.displayValue) {
  //     setQuoteValue(exchangeResult?.displayValue)
  //   }
  // }, [exchangeResult?.value])

  const handleDepositRequest = async () => {
    const DISPLAY_DECIMALS = 2
    const depositAmount = BigNumber.from(
      Number(Number(value.split('.').join(''))),
    ).mul(BigNumber.from(10).pow(baseToken.decimals - DISPLAY_DECIMALS))
    await bridge.deposit(depositAmount, baseToken)
  }

  const handleWithdrawRequest = async () => {
    const DISPLAY_DECIMALS = 2
    const withdrawalAmount = BigNumber.from(
      Number(value.split('.').join('')),
    ).mul(BigNumber.from(10).pow(baseToken.decimals - DISPLAY_DECIMALS))

    await bridge.withdraw(withdrawalAmount, {
      ...baseToken,
      address: baseToken.address,
    })
  }

  const bridgeFeatureToggles = [
    {
      name: BRIDGE_FEATURES_LABELS[BridgeFeature.Deposit],
      id: BridgeFeature.Deposit,
    },
    {
      name: BRIDGE_FEATURES_LABELS[BridgeFeature.Withdraw],
      id: BridgeFeature.Withdraw,
    },
  ]

  
  return (
    <>
      <Box marginBottom={2}>
        <Toggle
          toggles={bridgeFeatureToggles}
          onToggleChange={(bridgeFeature: BridgeFeature) =>
            setSelectedFeature(bridgeFeature)
          }
        />
      </Box>
      <Paper variant="outlined">
        <Box marginY={4} marginX={4}>
          <Bridge
            disableButton={provider === null}
            isFetchingTokens={isFetchingTokens}
            isCalculating={false}
            title={BRIDGE_FEATURES_LABELS[selectedFeature as BridgeFeature]}
            description={messages.BRIDGE_DESCRIPTION}
            baseTokenAmount={value}
            quoteTokenAmount={quoteValue}
            baseTokens={baseTokens}
            quoteTokens={quoteTokens}
            selectedBaseToken={baseToken}
            selectedQuoteToken={quoteToken}
            onBaseTokenChange={onBaseTokenChange}
            onQuoteTokenChange={onQuoteTokenChange}
            onBaseTokenAmountChange={onBaseTokenAmountChange}
            onQuoteTokenAmountChange={onQuoteTokenAmountChange}
            onDepositRequest={handleDepositRequest}
          />
          {selectedFeature === BridgeFeature.Deposit ? (
            <Box
              marginTop={4}
              width="100%"
              display="flex"
              flexDirection="column"
              alignItems="flex-end"
            >
              <Button
                style={{ width: isMobile ? '100%' : 'auto', minWidth: '160px' }}
                disabled={
                  provider === null ||
                  isFetchingTokens ||
                  !bridge?.features[BridgeFeature.Deposit]
                }
                variant="contained"
                color="primary"
                onClick={handleDepositRequest}
              >
                {messages.DEPOSIT_LABEL}
              </Button>
              {bridge && !bridge.features[BridgeFeature.Deposit] && (
                <Box width="100%">
                  <ErrorLabel
                    message={errorMessages.transactionNotSupportedTemplate(
                      BridgeFeature.Deposit,
                      bridge.getDepositNetwork().name,
                      bridge.getWithdrawalNetwork().name,
                    )}
                  />
                </Box>
              )}
            </Box>
          ) : (
            <Box
              marginTop={4}
              width="100%"
              display="flex"
              flexDirection="column"
              alignItems="flex-end"
            >
              <Button
                style={{ width: isMobile ? '100%' : 'auto', minWidth: '160px' }}
                disabled={
                  provider === null ||
                  isFetchingTokens ||
                  !bridge?.features[BridgeFeature.Withdraw]
                }
                variant="contained"
                color="primary"
                onClick={handleWithdrawRequest}
              >
                {messages.WITHDRAW_LABEL}
              </Button>
              {bridge && !bridge.features[BridgeFeature.Withdraw] && (
                <Box width="100%">
                  <ErrorLabel
                    message={errorMessages.transactionNotSupportedTemplate(
                      BridgeFeature.Withdraw,
                      bridge.getWithdrawalNetwork().name,
                      bridge.getDepositNetwork().name,
                    )}
                  />
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </>
  )
}

export default BridgeContainer
