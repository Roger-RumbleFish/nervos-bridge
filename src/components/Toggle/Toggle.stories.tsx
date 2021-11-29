import React, { ComponentProps } from 'react'

import { Story } from '@storybook/react/types-6-0'

import Toggle from './Toggle.component'

export default {
  title: 'Components/Toggle',
  description: '',
  component: Toggle,
}

const Template: Story<ComponentProps<typeof Toggle>> = (args) => {
  return <Toggle {...args} />
}

export const Basic = Template.bind({})

Basic.args = {
  toggles: [
    {
      id: '1',
      name: 'In % of my stake',
    },
    {
      id: '2',
      name: 'Specify exact assets amounts',
    },
  ],
}
