import { providers } from 'ethers'

import { Token } from '@interfaces/data'
// import { AddressTranslator } from 'nervos-godwoken-integration'
// import Web3 from 'web3'
import { ApiNetworks, Networks } from '@utils/constants'
import { IConfigContext } from '@utils/hooks'

import { getBridgeRPCClient } from './client'

export const fetchBalances = async (
  provider: providers.Web3Provider,
  tokens: Token[],
  network: string,
  config?: IConfigContext['config'],
): Promise<void> => {
  try {
    const accounts = await provider?.listAccounts()
    if (!accounts || accounts.length === 0) {
      return null
    }

    const bridgeRpcClient = getBridgeRPCClient(config?.rpcBridgeUrl)

    console.log('network', network)
    if (network === Networks.Ethereum) {
    } else {
      const payload = tokens.map((tok) => ({
        network: ApiNetworks.Ethereum,
        userIdent: null,
        assetIdent: tok.address,
      }))

      const result = await bridgeRpcClient.getBalance(payload)

      console.log('result', result)
    }
  } catch (error) {
    console.error(error)
  }

  return
}
