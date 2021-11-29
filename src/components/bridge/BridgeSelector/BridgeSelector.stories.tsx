import React, { ComponentProps, useState } from 'react'

import { IBridgeDescriptor } from '@interfaces/data'
import { Box } from '@material-ui/core'
import { Story } from '@storybook/react/types-6-0'

import BridgeSelector from '.'

export default {
  title: 'Components/BridgeSelector',
  description: '',
  component: BridgeSelector,
}

const Template: Story<ComponentProps<typeof BridgeSelector>> = () => {
  const bridgeDescriptor: IBridgeDescriptor = {
    id: 'force bridge',
    name: 'ethereum/godwoken',
    networks: ['ethereum', 'godwoken'],
  }
  const [bridgeId, setBridgeId] = useState('godwoken')
  return (
    <Box maxWidth={500}>
      <BridgeSelector
        onSelect={(bridgeId) => {
          setBridgeId(bridgeId)
        }}
        selectedBridgeId={bridgeId}
        bridgeDescriptors={[bridgeDescriptor]}
      />
    </Box>
  )
}

export const Basic = Template.bind({})

Basic.args = {}
