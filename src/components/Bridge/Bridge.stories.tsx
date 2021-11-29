import React, { useState, ComponentProps } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { AccountBoundToken } from '@interfaces/data'
import { Story } from '@storybook/react/types-6-0'

import Bridge from './Bridge.component'

export default {
  title: 'Components/Bridge',
  description: '',
  component: Bridge,
}

const Template: Story<ComponentProps<typeof Bridge>> = (args) => {
  const [value, setValue] = useState(args.baseTokenAmount)
  const [quoteValue, setQuoteToken] = useState(args.quoteTokenAmount)
  const onBaseTokenAmountChange = (value: string) => {
    setValue(value)
    setQuoteToken(value)
  }

  return (
    <Bridge
      {...args}
      baseTokenAmount={value}
      quoteTokenAmount={quoteValue}
      onBaseTokenAmountChange={onBaseTokenAmountChange}
    />
  )
}

export const Basic = Template.bind({})

const TOKEN_DECIMALS = 2

const tokens: AccountBoundToken[] = [
  {
    address: '1',
    decimals: TOKEN_DECIMALS,
    network: 'Ethereum',
    symbol: 'USDC',
    balance: BigNumber.from(100).mul(BigNumber.from(10).pow(TOKEN_DECIMALS)),
  },
  {
    address: '2',
    decimals: TOKEN_DECIMALS,
    network: 'Ethereum',
    symbol: 'USDT',
    balance: BigNumber.from(80).mul(BigNumber.from(10).pow(TOKEN_DECIMALS)),
  },
  {
    address: '3',
    decimals: TOKEN_DECIMALS,
    network: 'Ethereum',
    symbol: 'DAI',
    balance: BigNumber.from(1300).mul(BigNumber.from(10).pow(TOKEN_DECIMALS)),
  },
]

Basic.args = {
  baseTokenAmount: '0.00',
  quoteTokenAmount: '0.00',
  baseTokens: [tokens[0]],
  quoteTokens: [tokens[1], tokens[2]],
  title: 'Hadouken Bridge',
  description:
    'Only use personal wallets. Depositing from an exchange may cause loss of funds',
  selectedBaseToken: tokens[0],
  selectedQuoteToken: tokens[1],
}
