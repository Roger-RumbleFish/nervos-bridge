import { AddressTranslator } from 'nervos-godwoken-integration'
import Web3 from 'web3'

import { IBridgeTokenHandler } from '../types'

export const bridgeToken: IBridgeTokenHandler = async (
  amount,
  tokenAddress,
  userAddress,
  provider,
  network,
  config,
) => {
  try {
    console.log('L1 -> L2 bridge')
    console.log('L1 -> L2 bridge::token address', tokenAddress)
    console.log('L1 -> L2 bridge::amount', amount)

    const addressTranslator = new AddressTranslator(config?.addressTranslator)
    const web3 = new Web3(Web3.givenProvider)

    const tx = await addressTranslator.transferFromLayer1ToLayer2(
      web3,
      userAddress,
      tokenAddress,
      amount,
    )
    console.log(tx)
  } catch (error) {
    console.error(error)
  }
}
