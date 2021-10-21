import { providers } from 'ethers'

// import { AddressTranslator } from 'nervos-godwoken-integration'
// import Web3 from 'web3'
import { Token } from '@state/types'
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

    // const accounts = await provider?.listAccounts()
    // if (!accounts || accounts.length === 0) throw Error('you are not logged in')
    // const userAddress = accounts[0]

    // const value = convertDecimalToIntegerDecimal(amount, decimals)

    // const addressTranslator = new AddressTranslator(config?.addressTranslator)
    // const web3 = new Web3(Web3.givenProvider)

    // const recipient = await addressTranslator.getLayer2DepositAddress(
    //   web3,
    //   userAddress,
    // )

    // if (network === Networks.Ethereum) {
    //   const payload = {
    //     asset: {
    //       network: network,
    //       ident: tokenAddress,
    //       amount: value.toString(),
    //     },
    //     recipient: recipient.addressString,
    //     sender: userAddress,
    //   }

    //   const signer = provider.getSigner()

    //   const tokenFactory = ERC20__factory.connect(tokenAddress, signer)

    //   const allowedAmount = await tokenFactory.allowance(
    //     userAddress,
    //     bridgeConfig.xchains.Ethereum.contractAddress,
    //   )

    //   if (!allowedAmount.gte(value)) {
    //     const tx = await tokenFactory.approve(
    //       bridgeConfig.xchains.Ethereum.contractAddress,
    //       value,
    //     )

    //     await tx.wait()
    //   }

    //   await signer.sendTransaction(result.rawTransaction)
    // }

    // if (network === Networks.NervosL1) {
    //   // const web3 = new Web3(Web3.givenProvider)
    //   // const tx = await addressTranslator.transferFromLayer1ToLayer2(
    //   //   web3 as any,
    //   //   userAddress,
    //   //   tokenAddress,
    //   //   amount,
    //   // )
  } catch (error) {
    console.error(error)
  }

  return
}
