import React, { ComponentProps, useState } from 'react'

import { providers } from 'ethers'

import LoginToMetaMask from '@components/LoginToMetaMask/LoginToMetaMask.component'
import { Box, Typography } from '@material-ui/core'
import { Story } from '@storybook/react/types-6-0'

import BridgeContainer from './BridgeContainer'

export default {
  title: 'Components/BridgeContainer',
  description: '',
  component: BridgeContainer,
}

const Template: Story<ComponentProps<typeof BridgeContainer>> = (args) => {
  const [provider, setProvider] = useState<providers.Web3Provider | null>(null)
  const afterLogin = (provider: providers.Web3Provider) => {
    setProvider(provider)
  }

  return (
    <Box>
      <LoginToMetaMask afterLogin={afterLogin} />
      {provider === null && <Typography>PROVIDER IS NULL, LOG IN</Typography>}
      <BridgeContainer
        blacklist={['eth']}
        provider={provider}
        accountAddress="0x742971ac86E36152B9aac7090cF0B5C0acaa90F4"
      />
    </Box>
  )
}

export const Basic = Template.bind({})

Basic.args = {}
