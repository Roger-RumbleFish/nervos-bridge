import React, { useReducer, useState, useEffect, useContext } from 'react'

import { BigNumber, providers } from 'ethers'

import { CanonicalTokenSymbol } from '@api/types'
import Bridge from '@components/Bridge'
import Tabs from '@components/Tabs'
import { AccountBoundToken, IBridge, Token } from '@interfaces/data'
import { Button, Paper, Theme, useMediaQuery } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { initialState, reducer } from '@state/reducer'
import {
  ConfigContext, // useDebounce,
} from '@utils/hooks'

import { BridgeActions } from './BridgeContainer.actions'
import messages from './BridgeContainer.messages'
import { BridgeSelectors } from './BridgeContainer.selectors'
import { BridgeAction } from './BridgeContainer.types'

export interface IBridgeContainerProps {
  bridge?: IBridge
  provider: providers.JsonRpcProvider
}

const BridgeContainer: React.FC<IBridgeContainerProps> = ({
  bridge,
  provider,
}) => {
  const isMobile = !useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

  // const DEBOUNCE = 400

  const [selectedAction, setSelectedAction] = useState(BridgeAction.Deposit)

  const bridgeReducer = useReducer(reducer, initialState)

  // const { provider, bridge } = useContext(ConfigContext)

  console.log('[containers][bridge] rerender bridge')
  const [externalValue, setExternalValue] = useState(BigNumber.from(0))
  const [value, setValue] = useState(BigNumber.from(0))

  useEffect(() => {
    console.log('[containers][bridge] effect value', externalValue.toString())
  }, [externalValue])
  const {
    setTokens,
    setTokensRequest,
    // setNetwork,
    setBaseToken,
    // setQuoteToken,
    // calculate,
    // calculatingRequest,
  } = BridgeActions(bridgeReducer)

  const {
    isFetchingTokens,
    // isCalculating,
    // getNetwork,
    // getFee,
    getBaseToken,
    getBaseTokens,
    // getExchangeResult,
    // getQuoteToken,
    // getQuoteTokens,
  } = BridgeSelectors(bridgeReducer)

  // const network = getNetwork()
  // useEffect(() => {
  //   ;(async (): Promise<void> => {
  //     setTokensRequest()
  //     const tokens = await fetchTokens(assetsWhitelist)
  //     console.log('Bridge Container: tokens', tokens)
  //     setTokens(tokens)
  //   })()
  // }, [])

  useEffect(() => {
    ;(async (): Promise<void> => {
      setTokensRequest()

      if (provider && bridge) {
        if (selectedAction === BridgeAction.Deposit) {
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
        } else if (selectedAction === BridgeAction.Withdraw) {
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
  }, [provider, bridge, selectedAction, setTokens, setTokensRequest])

  // const onNetworkChange = (newNetwork: string) => {
  //   if (newNetwork !== network) {
  //     setNetwork?.(newNetwork)
  //   }
  // }

  const onBaseTokenChange = async (token: Token) => {
    setBaseToken(token.symbol)
  }

  // const onQuoteTokenChange = async (token: Token) => {
  //   setQuoteToken(token.symbol)
  // }

  const onBaseTokenAmountChange = (value: BigNumber) => {
    console.log(
      '[containers][bridge] on base token amount change',
      value.toString(),
    )
    setValue(value)
  }

  const onExternalTokenAmountChange = (value: BigNumber) => {
    console.log(
      '[containers][bridge] on external token amount change',
      value.toString(),
    )
    setExternalValue(value)
  }
  // const onQuoteTokenAmountChange = (value: string) => {
  //   setQuoteValue(value)
  // }

  const baseToken = getBaseToken()
  // const quoteToken = getQuoteToken()

  const baseTokens = getBaseTokens()
  // const quoteTokens = getQuoteTokens()

  // const fee = getFee()

  // const exchangeResult = getExchangeResult()
  const isFetchingAllTokens = isFetchingTokens()

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
    console.log('[containers][bridge] deposit', value.toString())
    await bridge.deposit(value, baseToken)
  }

  const handleWithdrawRequest = async () => {
    console.log('[containers][bridge] withdraw', value.toString())
    await bridge.withdraw(value, baseToken)
  }

  return (
    <>
      <Box marginY={1}>
        <Tabs<string>
          items={[
            {
              label: messages.DEPOSIT_ACTION,
              value: BridgeAction.Deposit,
            },
            {
              label: messages.WITHDRAW_ACTION,
              value: BridgeAction.Withdraw,
            },
          ]}
          selectedValue={selectedAction}
          onChange={(bridgeAction) =>
            setSelectedAction(bridgeAction as BridgeAction)
          }
        />
      </Box>
      <Paper variant="outlined">
        <Box marginY={4} marginX={4}>
          <Box width="100%">
            <Bridge
              isFetchingTokens={isFetchingAllTokens}
              externalValue={externalValue}
              value={value}
              baseTokens={baseTokens}
              selectedBaseToken={baseToken}
              onBaseTokenChange={onBaseTokenChange}
              onBaseTokenAmountChange={onBaseTokenAmountChange}
              onExternalTokenAmountChange={onExternalTokenAmountChange}
            />
          </Box>
          {selectedAction === BridgeAction.Deposit ? (
            <Box
              marginTop={4}
              width="100%"
              display="flex"
              justifyContent="flex-end"
            >
              <Button
                style={{ width: isMobile ? '100%' : 'auto', minWidth: '160px' }}
                disabled={provider === null || !bridge?.config.deposit}
                variant="contained"
                color="primary"
                onClick={handleDepositRequest}
              >
                {messages.DEPOSIT_ACTION}
              </Button>
            </Box>
          ) : (
            <Box
              marginTop={4}
              width="100%"
              display="flex"
              justifyContent="flex-end"
            >
              <Button
                style={{ width: isMobile ? '100%' : 'auto', minWidth: '160px' }}
                disabled={provider === null || !bridge?.config.withdraw}
                variant="contained"
                color="primary"
                onClick={handleWithdrawRequest}
              >
                {messages.WITHDRAW_ACTION}
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </>
  )
}

export default BridgeContainer
