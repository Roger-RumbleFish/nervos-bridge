import React, { useReducer, useState, useEffect, useContext } from 'react'

import { BigNumber } from 'ethers'

import {
  fetchTokens,
  bridgeToken,
  withdrawToken,
} from '@api/bridges/__register'
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

const BridgeContainer: React.FC = () => {
  const isMobile = !useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

  const DEBOUNCE = 400

  const [selectedTab, setSelectedTab] = useState('Deposit')
  const bridgeReducer = useReducer(reducer, initialState)
  const { provider, config, bridge } = useContext(ConfigContext)

  console.log('[containers][bridge] bridge', bridge)

  console.log('[containers][bridge][provider] get provider', provider)
  const [value, setValue] = useState('100.00')
  const [quoteValue, setQuoteValue] = useState('100.00')

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
        // console.log('[bridge][container][balances] network', network)
        // const balancesF = await fetchBalances(network, provider)
        // console.log('[bridge][container][balances] balances', balancesF)

        const tokens =
          selectedTab === 'Deposit'
            ? await bridge.getTokens()
            : await bridge.getShadowTokens()

        const accountAddress = await provider.getSigner().getAddress()

        const accountBoundTokens: AccountBoundToken[] = []
        for (let i = 0; i < tokens.length; i++) {
          console.log(
            `[bridge][container][tokens] token ${tokens[i].symbol}`,
            tokens[i],
          )
          let balance
          if (selectedTab === 'Deposit') {
            console.log(
              `[bridge][container][tokens][address] token deposit ${tokens[i].symbol}`,
              tokens[i].shadow.address,
            )
            balance = await bridge
              .getDepositNetwork()
              .getBalance(tokens[i].shadow.address, accountAddress)
            console.log(
              `[bridge][container][tokens] token deposit ${tokens[i].symbol}`,
              balance,
            )
          } else {
            console.log(
              `[bridge][container][tokens][address] token withdraw ${tokens[i].symbol}`,
              tokens[i].shadow.address,
            )
            balance = await bridge
              .getWithdrawalNetwork()
              .getBalance(tokens[i].address, accountAddress)
            console.log(
              `[bridge][container][tokens] token withdraw ${tokens[i].symbol}`,
              balance,
            )
          }
          console.log(
            `[bridge][container][balances] balance ${tokens[i].symbol}`,
            balance.toString(),
          )
          accountBoundTokens.push({
            ...tokens[i],
            balance: balance,
          })
        }
        console.log(
          '[bridge][container][balances] balances',
          accountBoundTokens,
        )

        setTokens(accountBoundTokens)
      }
    })()
  }, [provider, bridge, selectedTab])

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

  useEffect(() => {
    if (exchangeResult?.displayValue) {
      setQuoteValue(exchangeResult?.displayValue)
    }
  }, [exchangeResult?.value])

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
    // const bridgedAmount = BigNumber.from(value).mul(
    //   BigNumber.from(10).pow(bridgedPair.decimals),
    // )
    // await bridge.deposit(bridgedAmount, bridgedAmount)
  }

  const handleWithdrawRequest = async () => {
    const numberAmount = BigNumber.from(Number(value.split('.')[0])).mul(
      BigNumber.from(10).pow(8),
    )
    // const shadow = {
    //   address: quoteToken.address,
    //   network: Networks.Ethereum,
    // }
    // const bridgedPair = {
    //   shadow,
    //   address: tokenAddress,
    // }
    // await bridge.withdraw(numberAmount, bridgedPair)
    // await withdrawToken(
    //   value,
    //   baseToken.decimals,
    //   baseToken.address,
    //   provider,
    //   network,
    //   config,
    // )
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
                onClick={handleWithdrawRequest}
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
