import React, { useState, ComponentProps } from 'react'

import { IDisplayValue } from '@interfaces/data'
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
  const onBaseTokenAmountChange = (value: IDisplayValue) => {
    setValue(value.displayValue)
    setQuoteToken(value.displayValue)
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

const tokens = [
  {
    address: '1',
    decimals: 2,
    network: 'Ethereum',
    symbol: 'USDC',
  },
  {
    address: '2',
    decimals: 2,
    network: 'Ethereum',
    symbol: 'USDT',
  },
  {
    address: '3',
    decimals: 2,
    network: 'Ethereum',
    symbol: 'DAI',
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
