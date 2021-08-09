import React, { ComponentProps } from 'react'

import { Story } from '@storybook/react/types-6-0'

import BridgeContainer from './BridgeContainer'

export default {
  title: 'Components/BridgeContainer',
  description: '',
  component: BridgeContainer,
}

const Template: Story<ComponentProps<typeof BridgeContainer>> = (args) => {
  return <BridgeContainer blacklist={[]} />
}

export const Basic = Template.bind({})

Basic.args = {}
