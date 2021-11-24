import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'

import { providers } from 'ethers'

import { Box, Button, Typography } from '@material-ui/core'
import { PolyjuiceHttpProvider } from '@polyjuice-provider/web3'

import Bridge from './index'

export enum EthereumActions {
  requestAccounts = 'eth_accounts',
  requestWallet = 'wallet_requestPermissions',
  watchAsset = 'wallet_watchAsset',
}

const Index = () => {
  const [provider, setProvider] = React.useState<providers.Web3Provider | null>(
    null,
  )
  const [account, setAccount] = React.useState<string | null>(null)
  const [loginRequired, setLoginRequired] = React.useState<boolean>(false)

  const connectAccount = async () => {
    const ethereum = window?.ethereum
    if (ethereum) {
      const accounts = await ethereum.request({
        method: EthereumActions.requestAccounts,
      })
      const account = accounts[0]
      if (accounts.length > 0) {
        const web3EthereumProvider = new providers.Web3Provider(
          window?.ethereum as providers.ExternalProvider,
        )

        setProvider(web3EthereumProvider)
        setAccount(account)
        setLoginRequired(false)
      } else {
        setLoginRequired(true)
      }
    }
  }

  const onLoginRequest = async () => {
    const ethereum = window?.ethereum
    if (ethereum) {
      await ethereum.request({
        method: EthereumActions.requestWallet,
        params: [{ eth_accounts: {} }],
      })
    }

    await connectAccount()
  }

  useEffect(() => {
    connectAccount()
  }, [])

  return (
    <>
      <Box margin={2}>
        {loginRequired && (
          <Button variant="outlined" onClick={onLoginRequest}>
            Login
          </Button>
        )}
        {account && (
          <Typography variant="h5">
            <b>{account}</b>
          </Typography>
        )}
      </Box>
      <Bridge provider={provider} />
    </>
  )
}

ReactDOM.render(<Index />, document.querySelector('#root'))
