import React, { useReducer, useState, useEffect, useContext } from 'react'

import { BigNumber } from 'ethers'

import { CanonicalTokenSymbol } from '@api/types'
import Bridge from '@components/Bridge'
import Tabs from '@components/Tabs'
import { AccountBoundToken, Token } from '@interfaces/data'
import { Button, Paper, Theme, useMediaQuery } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { initialState, reducer } from '@state/reducer'
import { ConfigContext, useDebounce } from '@utils/hooks'

import { BridgeActions } from './BridgeContainer.actions'
import messages from './BridgeContainer.messages'
import { BridgeSelectors } from './BridgeContainer.selectors'

const DEFAULT_VALUE = '100.00'

const BridgeContainer: React.FC = () => {
  const isMobile = !useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

  const DEBOUNCE = 400

  const [selectedTab, setSelectedTab] = useState('Deposit')

  const bridgeReducer = useReducer(reducer, initialState)

  const { provider, bridge } = useContext(ConfigContext)

  const [value, setValue] = useState(DEFAULT_VALUE)
  const [quoteValue, setQuoteValue] = useState(DEFAULT_VALUE)

  const {
    setTokens,
    setTokensRequest,
    // setNetwork,
    setBaseToken,
    setQuoteToken,
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
    getExchangeResult,
    getQuoteToken,
    getQuoteTokens,
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
        if (selectedTab === 'Deposit') {
          const network = bridge.getDepositNetwork()

          const tokens = network.getTokens()
          const tokensSymbols = Object.keys(tokens) as CanonicalTokenSymbol[]

          console.log('[container][bridge][effect] get tokens', tokens)

          const accountAddress = await provider.getSigner().getAddress()

          const accountBoundTokens: AccountBoundToken[] = await Promise.all(
            tokensSymbols.map(async (tokenSymbol) => {
              const token = tokens[tokenSymbol]

              const balance = await network.getBalance(
                token.address,
                accountAddress,
              )

              console.log(
                '[container][bridge][effect] token, balance',
                token,
                balance.toString(),
              )
              return {
                ...token,
                balance,
              }
            }),
          )

          setTokens(accountBoundTokens)
        } else if (selectedTab === 'Withdraw') {
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
  }, [provider, bridge, selectedTab, setTokens, setTokensRequest])

  // const onNetworkChange = (newNetwork: string) => {
  //   if (newNetwork !== network) {
  //     setNetwork?.(newNetwork)
  //   }
  // }

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

  console.log('[container][bridge][tokens] base token', baseToken)
  console.log('[container][bridge][tokens] quote token', quoteToken)

  const baseTokens = getBaseTokens()
  const quoteTokens = getQuoteTokens()

  console.log('[container][bridge][tokens] base tokens', baseTokens)
  console.log('[container][bridge][tokens] quote tokens', quoteTokens)

  // const fee = getFee()

  const exchangeResult = getExchangeResult()
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
    // await bridgeToken(
    //   value,
    //   baseToken.decimals,
    //   baseToken.address,
    //   provider,
    //   network,
    //   config,
    // )
    // const bridgedPair = bridge.getBridgedPairByAddress(
    //   baseToken.address,
    //   Networks.CKB,
    // )
    console.log('[bridge][deposit] deposit token', baseToken)
    const depositAmount = BigNumber.from(Number(value.split('.')[0])).mul(
      BigNumber.from(10).pow(baseToken.decimals),
    )
    await bridge.deposit(depositAmount, baseToken)
  }

  const handleWithdrawRequest = async () => {
    console.log('[bridge][withdraw]', baseToken.address)
    const withdrawalAmount = BigNumber.from(Number(value.split('.')[0])).mul(
      BigNumber.from(10).pow(baseToken.decimals),
    )

    await bridge.withdraw(withdrawalAmount, {
      ...baseToken,
      address: baseToken.address,
    })
  }

  return (
    <>
      <Box marginY={1}>
        <Tabs<string>
          items={[
            { label: 'Deposit', value: 'Deposit' },
            { label: 'Withdraw', value: 'Withdraw' },
          ]}
          selectedValue={selectedTab}
          onChange={(val) => setSelectedTab(val)}
        />
      </Box>
      <Paper variant="outlined">
        <Box marginY={4} marginX={4}>
          <Bridge
            disableButton={provider === null}
            isFetchingTokens={isFetchingAllTokens}
            isCalculating={false}
            title={selectedTab}
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
          {selectedTab === 'Deposit' ? (
            <Box
              marginTop={4}
              width="100%"
              display="flex"
              justifyContent="flex-end"
            >
              <Button
                style={{ width: isMobile ? '100%' : 'auto', minWidth: '160px' }}
                disabled={provider === null}
                variant="contained"
                color="primary"
                onClick={handleDepositRequest}
              >
                Deposit
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
                disabled={provider === null}
                variant="contained"
                color="primary"
                onClick={handleWithdrawRequest}
              >
                Withdraw
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </>
  )
}

export default BridgeContainer
