import Web3 from 'web3'

import { BigNumber } from '@ethersproject/bignumber'

import { IBridgeTokenHandler } from '../types'
import { CkbBridge } from './bridge'
import { Networks } from '@utils/constants'

export const bridgeToken: IBridgeTokenHandler = async (
  amount,
  tokenAddress,
  ethereumAddress,
) => {
  try {
    const numberAmount = Number(amount.split('.')[0])
    const web3provider = new Web3(Web3.givenProvider)

    const bridge = await new CkbBridge(web3provider, {
      ckbUrl: 'https://testnet.ckb.dev',
      indexerUrl: 'https://testnet.ckb.dev/indexer',
    }).init()

    const shadow = {
      address: tokenAddress,
      network: Networks.NervosL1
    }
    const shadowNative = {
      network: Networks.NervosL1
    }

    let balanceCKB = await bridge.getBalance(ethereumAddress, { shadow: shadowNative })
    console.log('balance ckb', balanceCKB.toString())
    let balanceSUDT = await bridge.getBalance(ethereumAddress, { shadow })
    console.log('balance sudt', balanceSUDT.toString())

    await bridge.deposit(
      BigNumber.from(numberAmount).mul(BigNumber.from(10).pow(8)),
      { shadow },
    )

    balanceCKB = await bridge.getBalance(ethereumAddress, { shadow: shadowNative })
    console.log('balance ckb', balanceCKB.toString())
    balanceSUDT = await bridge.getBalance(ethereumAddress, { shadow })
    console.log('balance sudt', balanceSUDT.toString())

    console.log('tx')
  } catch (error) {
    console.error(error)
  }
}
