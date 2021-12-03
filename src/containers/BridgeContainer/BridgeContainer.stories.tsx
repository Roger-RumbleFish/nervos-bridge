import React, { ComponentProps } from 'react'

import { providers } from 'ethers'

import { Story } from '@storybook/react/types-6-0'
import { ConfigContext } from '@utils/hooks'

import BridgeContainer from './BridgeContainer'

export default {
  title: 'Components/BridgeContainer',
  description: '',
  component: BridgeContainer,
}

const Template: Story<ComponentProps<typeof BridgeContainer>> = (
  _,
  { globals: { web3 } },
) => {
  if (!web3) {
    return <b>Please connect to Metamask with addon</b>
  }
  const { provider } = web3
  const web3Provider = new providers.Web3Provider(provider)

  return (
    <>
      {!provider && <b>Please connect to Metamask with addon</b>}
      <ConfigContext.Provider
        value={{
          provider: web3Provider,
        }}
      >
        <BridgeContainer />
      </ConfigContext.Provider>
    </>
  )
}

export const Basic = Template.bind({})

Basic.args = {}
