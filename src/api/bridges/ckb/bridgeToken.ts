import Web3 from 'web3'

import { BigNumber } from '@ethersproject/bignumber'

import { IBridgeTokenHandler } from '../types'
import { CkbBridge } from './bridge'
import { Networks } from '@utils/constants'
import { registry as godwokenTokensRegistry } from '../../godwoken/registry'

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
    }).init(godwokenTokensRegistry)

    const bridgedPair = bridge.getBridgedPairByAddress(tokenAddress, Networks.CKB)

    const bridgedAmount = BigNumber.from(numberAmount).mul(
      BigNumber.from(10).pow(bridgedPair.decimals)
    )

    await bridge.deposit(
      bridgedAmount,
      bridgedPair,
    )

  } catch (error) {
    console.error(error)
  }
}
