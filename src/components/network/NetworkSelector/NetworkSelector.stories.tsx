import React, { ComponentProps, useState } from 'react'

import { Box } from '@material-ui/core'
import { Story } from '@storybook/react/types-6-0'

import NetworkSelector from '.'
import { NETWORK_TRANSFER_ITEMS } from './NetworkSelector.constants'

export default {
  title: 'Components/NetworkSelector',
  description: '',
  component: NetworkSelector,
}

const Template: Story<ComponentProps<typeof NetworkSelector>> = () => {
  const [network, setNetwork] = useState(NETWORK_TRANSFER_ITEMS[1].id)
  return (
    <Box maxWidth={500}>
      <NetworkSelector
        onChange={(network) => {
          setNetwork(network)
        }}
        selectedNetwork={network}
      />
    </Box>
  )
}

export const Basic = Template.bind({})

Basic.args = {}
