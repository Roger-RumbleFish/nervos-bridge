import React, { ComponentProps } from 'react'

import { Box } from '@material-ui/core'
import { Story } from '@storybook/react/types-6-0'
import { tokens } from '@tests//tokens'

import SummaryCard from './SummaryCard.component'

export default {
  title: 'Components/SummaryCard',
  description: '',
  component: SummaryCard,
}

const Template: Story<ComponentProps<typeof SummaryCard>> = (args) => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    bgcolor="white"
    width={500}
    height={400}
  >
    <Box height={200}>
      <SummaryCard {...args} />
    </Box>
  </Box>
)

export const Basic = Template.bind({})

Basic.args = {
  label: 'You burn',
  additionalLabel: 'The maximum slippage for the operation is 0.5%.',
  tokens: [
    {
      id: tokens[0].id,
      symbol: tokens[0].symbol,
      displayValue: '10.52',
    },
    {
      id: tokens[1].id,
      symbol: tokens[1].symbol,
      displayValue: '321.12',
    },
  ],
}
