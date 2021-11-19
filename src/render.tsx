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
        const godwokenWeb3Url = 'https://godwoken-testnet-web3-rpc.ckbapp.dev'
        const providerConfig = {
          rollupTypeHash:
            '0x4cc2e6526204ae6a2e8fcf12f7ad472f41a1606d5b9624beebd215d780809f6a',
          ethAccountLockCodeHash:
            '0xdeec13a7b8e100579541384ccaf4b5223733e4a5483c3aec95ddc4c1d5ea5b22',
          web3Url: godwokenWeb3Url,
        }

        const httpPolyjuiceProvider = new PolyjuiceHttpProvider(
          godwokenWeb3Url,
          providerConfig,
        )
        const web3PolyjuiceProvider = new providers.Web3Provider(
          httpPolyjuiceProvider,
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
