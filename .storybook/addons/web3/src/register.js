import React from "react";

import { addons, types } from '@storybook/addons';

import { AddonPanel } from '@storybook/components';

import { Web3, TOOL_ID, TOOL_TITLE } from './web3';

const PANEL_ID = `${TOOL_ID}/panel`;

addons.register(TOOL_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: TOOL_TITLE,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <Web3 />
      </AddonPanel>
    ),
  });
});