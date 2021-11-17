import React, { useState } from 'react'

import { Box } from '@material-ui/core'
import { Story } from '@storybook/react/types-6-0'

import Tabs from './Tabs.component'
import { ITabsProps } from './Tabs.types'

export default {
  title: 'Components/Tabs',
  description: '',
  component: Tabs,
}

type TabsProps = ITabsProps<string>

const Template: Story<TabsProps> = ({ items }) => {
  const [selectedTab, setSelectedTab] = useState('1')
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="white"
      height={150}
    >
      <Tabs<string>
        items={items}
        selectedValue={selectedTab}
        onChange={(val) => setSelectedTab(val)}
      />
    </Box>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  items: [
    { label: 'first', value: '1' },
    { label: 'second', value: '2' },
  ],
}
