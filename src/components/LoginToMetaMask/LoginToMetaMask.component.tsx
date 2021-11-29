import React from 'react'

import { providers } from 'ethers'

import { Button } from '@material-ui/core'

export enum EthereumActions {
  requestAccounts = 'eth_accounts',
  requestWallet = 'wallet_requestPermissions',
  watchAsset = 'wallet_watchAsset',
}

const LoginToMetaMask: React.FC<{
  afterLogin: (provider: providers.Web3Provider) => void
}> = ({ afterLogin }) => {
  const onLoginRequest = async (): Promise<void> => {
    const ethereum = window?.ethereum as providers.ExternalProvider
    if (ethereum) {
      await ethereum.request({
        method: EthereumActions.requestWallet,
        params: [{ eth_accounts: {} }],
      })

      const web3Provider = new providers.Web3Provider(
        window?.ethereum as providers.ExternalProvider,
      )
      afterLogin(web3Provider)
    }
  }

  return <Button onClick={onLoginRequest}>Login</Button>
}

export default LoginToMetaMask
