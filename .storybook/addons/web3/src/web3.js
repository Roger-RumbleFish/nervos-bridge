import React from 'react';

import { useGlobals } from '@storybook/api';
import { Button } from '@storybook/components';
import { FORCE_RE_RENDER } from '@storybook/core-events';
import { addons } from '@storybook/addons';

export const EthereumActions = {
  requestAccounts: 'eth_accounts',
  requestWallet: 'wallet_requestPermissions',
  watchAsset: 'wallet_watchAsset',
}

export const TOOL_ID = 'Web3'
export const TOOL_TITLE = 'Metamask'


export const Web3 = () => {
  const [_, updateGlobals] = useGlobals();
  const [account, setAccount] = React.useState();

  const loginRequest = async () => {
    const ethereum = window?.ethereum

    if (ethereum) {
      await ethereum.request({
        method: EthereumActions.requestWallet,
        params: [{ eth_accounts: {} }],
      })

      const accounts = await ethereum.request({
        method: EthereumActions.requestAccounts,
      })

      setAccount(accounts[0])

      updateGlobals({
        web3: {
          provider: ethereum,
        }
      })

      addons.getChannel().emit(FORCE_RE_RENDER);
    }
  }

  return (
    <div style={{margin: 8}}>
      <div style={{marginTop: 16, marginBottom: 8}}>
        <Button
          outline
          small
          disabled={account}
          key={TOOL_ID}
          title={TOOL_TITLE}
          onClick={loginRequest}
        >
          Connect to Metamask
        </Button>
      </div>
      {account &&
        <div style={{marginTop: 16, fontSize: 18}}>
          <h4>Connected Account</h4>
          <b style={{fontSize: 24, lineHeight: 1.5}}>{account}</b>
        </div>
      }
    </div>
  )
}
