import { providers } from 'ethers'
import { AddressTranslator } from 'nervos-godwoken-integration'
import Web3 from 'web3'

import { Networks } from '@utils/constants'
import { IConfigContext } from '@utils/hooks'
import { convertDecimalToIntegerDecimal } from '@utils/stringOperations'

import { ERC20__factory } from '../factories/ERC20__factory'
import { getBridgeRPCClient } from './client'

export const bridgeToken = async (
  amount: string,
  decimals: number,
  tokenAddress: string,
  provider: providers.Web3Provider,
  network: string,
  config?: IConfigContext['config'],
): Promise<void> => {
  console.log('Bridge Token', provider)
  try {
    const accounts = await provider?.listAccounts()
    if (!accounts || accounts.length === 0) throw Error('you are not logged in')
    const userAddress = accounts[0]
    const bridgeRpcClient = getBridgeRPCClient(config?.rpcBridgeUrl)
    const bridgeConfig = await bridgeRpcClient.getBridgeConfig()
    const value = convertDecimalToIntegerDecimal(amount, decimals)

    const addressTranslator = new AddressTranslator(config?.addressTranslator)
    const web3 = new Web3(Web3.givenProvider)

    const recipient = await addressTranslator.getLayer2DepositAddress(
      web3,
      userAddress,
    )

    if (network === Networks.Ethereum) {
      const payload = {
        asset: {
          network: network,
          ident: tokenAddress,
          amount: value.toString(),
        },
        recipient: recipient.addressString,
        sender: userAddress,
      }

      const signer = provider.getSigner()

      const tokenFactory = ERC20__factory.connect(tokenAddress, signer)

      const allowedAmount = await tokenFactory.allowance(
        userAddress,
        bridgeConfig.xchains.Ethereum.contractAddress,
      )

      if (!allowedAmount.gte(value)) {
        const tx = await tokenFactory.approve(
          bridgeConfig.xchains.Ethereum.contractAddress,
          value,
        )

        await tx.wait()
      }

      const result = await bridgeRpcClient.generateBridgeInNervosTransaction(
        payload,
      )

      await signer.sendTransaction(result.rawTransaction)
    }

    if (network === Networks.NervosL1) {
      // console.log('Nothing happending for now')
      // const web3 = new Web3(Web3.givenProvider)
      // const tx = await addressTranslator.transferFromLayer1ToLayer2(
      //   web3 as any,
      //   userAddress,
      //   tokenAddress,
      //   amount,
      // )
      // console.log(tx)
    }
  } catch (error) {
    console.error(error)
  }
}
