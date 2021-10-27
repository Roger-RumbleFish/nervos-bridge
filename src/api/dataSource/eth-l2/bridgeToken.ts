import { AddressTranslator } from 'nervos-godwoken-integration'
import Web3 from 'web3'

import { ERC20__factory } from '../../../factories/ERC20__factory'
import { IBridgeTokenHandler } from '../types'
import { getBridgeRPCClient } from './client'

export const bridgeToken: IBridgeTokenHandler = async (
  amount,
  tokenAddress,
  userAddress,
  provider,
  network,
  config,
) => {
  try {
    const bridgeRpcClient = getBridgeRPCClient(config?.rpcBridgeUrl)
    const bridgeConfig = await bridgeRpcClient.getBridgeConfig()

    const addressTranslator = new AddressTranslator(config?.addressTranslator)
    const web3 = new Web3(Web3.givenProvider)

    const recipient = await addressTranslator.getLayer2DepositAddress(
      web3,
      userAddress,
    )

    const payload = {
      asset: {
        network: network,
        ident: tokenAddress,
        amount: amount,
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

    if (!allowedAmount.gte(amount)) {
      const tx = await tokenFactory.approve(
        bridgeConfig.xchains.Ethereum.contractAddress,
        amount,
      )

      await tx.wait()
    }

    const result = await bridgeRpcClient.generateBridgeInNervosTransaction(
      payload,
    )

    await signer.sendTransaction(result.rawTransaction)
  } catch (error) {
    console.error(error)
  }
}
