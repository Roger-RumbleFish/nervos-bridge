import Web3 from 'web3'

import { Godwoken } from '@api/godwoken'
import { BigNumber } from '@ethersproject/bignumber'
import { Networks } from '@utils/constants'

import { registry as godwokenTokensRegistry } from '../../godwoken/registry'
import { IBridgeTokenHandler } from '../types'
import { CkbBridge } from './bridge'

export const withdrawToken: IBridgeTokenHandler = async (
  amount,
  tokenAddress,
  ethereumAddress,
  provider,
) => {
  try {
    const numberAmount = Number(amount.split('.')[0])
    const web3provider = new Web3(Web3.givenProvider)

    const bridge = await new CkbBridge(web3provider, {
      ckbUrl: 'https://testnet.ckb.dev',
      indexerUrl: 'https://testnet.ckb.dev/indexer',
    }).init(godwokenTokensRegistry)

    const bridgedPair = bridge.getBridgedPairByAddress(
      tokenAddress,
      Networks.CKB,
    )

    const withdrawAmount = BigNumber.from(numberAmount).mul(
      BigNumber.from(10).pow(bridgedPair.decimals),
    )
    const godwoken = new Godwoken(provider)
    await godwoken.withdraw(withdrawAmount, tokenAddress, ethereumAddress)
  } catch (error) {
    console.error(error)
  }
}
