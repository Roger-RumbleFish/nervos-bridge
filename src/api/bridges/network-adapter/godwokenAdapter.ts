import { BigNumber } from 'ethers'

import { NetworkName } from '@interfaces/data'
import PolyjuiceHttpProvider from '@polyjuice-provider/web3'

import { INetworkAdapter } from './types'

export class GodwokenNetwork implements INetworkAdapter {
  public id: string
  public name: NetworkName

  private provider: PolyjuiceHttpProvider

  constructor(id: string, name: string, provider: PolyjuiceHttpProvider) {
    this.id = id
    this.name = name
    this.provider = provider
  }

  async getBalance(
    tokenAddress: string,
    accountAddress: string,
  ): Promise<BigNumber> {
    console.log('[network][adapter][godwoken] token address', tokenAddress)
    console.log('[network][adapter][godwoken] account address', accountAddress)

    return BigNumber.from(0)
  }
}
