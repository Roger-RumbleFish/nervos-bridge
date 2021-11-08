import { AddressTranslator } from 'nervos-godwoken-integration'
import Web3 from 'web3'

import { ERC20__factory } from '../../../factories/ERC20__factory'
import { IBridgeTokenHandler } from '../types'
import { getBridgeRPCClient } from './client'
import { EthereumForceBridge } from './bridge'
import { BigNumber } from '@ethersproject/bignumber'

export const bridgeToken: IBridgeTokenHandler = async (
  amount,
  tokenAddress,
  ethereumAddress,
  provider,
  network,
  config,
) => {
  try {
    const numberAmount = BigNumber.from(
      Number(amount.split('.')[0])
    ).mul(BigNumber.from(10).pow(8))
    const web3 = new Web3(Web3.givenProvider)
    const bridge = await new EthereumForceBridge(web3, provider, {
        forceBridgeUrl: 'https://testnet.forcebridge.com/api/force-bridge/api/v1'
      }).init()
    

    const shadow = {
      address: tokenAddress,
      network: 'Ethereum'
    }
    const shadowNative = {
      network: 'Ethereum'
    }

    let balanceCKB = await bridge.getBalance(ethereumAddress, { shadow: shadowNative })
    console.log('balance ckb', balanceCKB.toString())
    let balanceSUDT = await bridge.getBalance(ethereumAddress, { shadow })
    console.log('balance sudt', balanceSUDT.toString())

    await bridge.deposit(
      numberAmount,
      { shadow },
    )

    balanceCKB = await bridge.getBalance(ethereumAddress, { shadow: shadowNative })
    console.log('balance ckb', balanceCKB.toString())
    balanceSUDT = await bridge.getBalance(ethereumAddress, { shadow })
    console.log('balance sudt', balanceSUDT.toString())
  } catch (error) {
    console.error(error)
  }
}
