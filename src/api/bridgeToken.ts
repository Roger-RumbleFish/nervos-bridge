import { providers } from 'ethers'
import { AddressTranslator } from 'nervos-godwoken-integration'
import Web3 from 'web3'

import { convertDecimalToIntegerDecimal } from '@utils/stringOperations'

import { ERC20__factory } from '../factories/ERC20__factory'
import { bridgeRpcClient } from './client'

export const bridgeToken = async (
  amount: string,
  decimals: number,
  tokenAddress: string,
  userAddress: string,
  provider: providers.Web3Provider,
  network: string,
): Promise<void> => {
  try {
    const config = await bridgeRpcClient.getBridgeConfig()
    const value = convertDecimalToIntegerDecimal(amount, decimals)
    const addressTranslator = new AddressTranslator()
    const web3 = new Web3(Web3.givenProvider)
    const recipient = await addressTranslator.getLayer2DepositAddress(
      web3,
      userAddress,
    )

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

    const tokenFactory = await ERC20__factory.connect(tokenAddress, signer)

    const allowedAmount = await tokenFactory.allowance(
      userAddress,
      config.xchains.Ethereum.contractAddress,
    )

    if (!allowedAmount.gte(value)) {
      const tx = await tokenFactory.approve(
        config.xchains.Ethereum.contractAddress,
        value,
      )

      await tx.wait()
    }

    const result = await bridgeRpcClient.generateBridgeInNervosTransaction(
      payload,
    )

    // const signer = provider.getSigner()

    await signer.sendTransaction(result.rawTransaction)
  } catch (error) {
    console.error(error)
  }
}
