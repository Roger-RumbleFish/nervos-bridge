import React, { ComponentProps, useState } from 'react'

import { providers } from 'ethers'

import LoginToMetaMask from '@components/LoginToMetaMask/LoginToMetaMask.component'
import { Box, Typography } from '@material-ui/core'
import { Story } from '@storybook/react/types-6-0'
import { ConfigContext } from '@utils/hooks'

import BridgeContainer from './BridgeContainer'

export default {
  title: 'Components/BridgeContainer',
  description: '',
  component: BridgeContainer,
}

const Template: Story<ComponentProps<typeof BridgeContainer>> = () => {
  const [provider, setProvider] = useState<providers.Web3Provider | null>(null)
  const [accounts, setAccounts] = useState<string[]>([])
  const afterLogin = async (provider: providers.Web3Provider) => {
    setProvider(provider)
    const acc = await provider?.listAccounts()
    setAccounts(acc)
  }

  return (
    <Box>
      <LoginToMetaMask afterLogin={afterLogin} />
      {provider === null && <Typography>PROVIDER IS NULL, LOG IN</Typography>}
      <ConfigContext.Provider
        value={{
          provider: provider,
          assetsBlacklist: ['eth'],
        }}
      >
        <BridgeContainer />
      </ConfigContext.Provider>
    </Box>
  )
}

export const Basic = Template.bind({})

Basic.args = {}
