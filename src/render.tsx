import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'

import { providers } from 'ethers'

import { Box, Button, Typography } from '@material-ui/core'
import PolyjuiceHttpProvider from '@polyjuice-provider/web3'

import Bridge from './component'
import Config from './config'

export enum EthereumActions {
  requestAccounts = 'eth_accounts',
  requestWallet = 'wallet_requestPermissions',
  watchAsset = 'wallet_watchAsset',
}

const Index = () => {
  const [provider, setProvider] = React.useState<providers.Web3Provider | null>(
    null,
  )
  const [
    polyjuiceProvider,
    setPolyjuiceProvider,
  ] = React.useState<providers.Web3Provider | null>(null)

  const [account, setAccount] = React.useState<string | null>(null)
  const [loginRequired, setLoginRequired] = React.useState<boolean>(false)

  const connectAccount = async () => {
    const ethereum = window?.ethereum as providers.ExternalProvider
    if (ethereum) {
      const accounts = await ethereum.request({
        method: EthereumActions.requestAccounts,
      })
      const account = accounts[0]
      if (accounts.length > 0) {
        const web3EthereumProvider = new providers.Web3Provider(ethereum)

        const providerConfig = {
          rollupTypeHash: Config.nervos.rollupTypeHash,
          ethAccountLockCodeHash: Config.nervos.ethAccountLockCodeHash,
          web3Url: Config.nervos.godwoken.rpcUrl,
        }

        const httpPolyjuiceProvider = new PolyjuiceHttpProvider(
          Config.nervos.godwoken.rpcUrl,
          providerConfig,
        )
        const web3PolyjuiceProvider = new providers.Web3Provider(
          httpPolyjuiceProvider,
        )

        setProvider(web3EthereumProvider)
        setPolyjuiceProvider(web3PolyjuiceProvider)

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
      <Bridge provider={provider} polyjuiceProvider={polyjuiceProvider} />
    </>
  )
}

ReactDOM.render(<Index />, document.querySelector('#root'))
