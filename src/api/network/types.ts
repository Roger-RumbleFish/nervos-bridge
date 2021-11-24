import { BigNumber } from 'ethers'

import { TokensRegistry } from '@api/types'
import { NetworkName } from '@interfaces/data'

export interface INetworkAdapter {
  id: string
  name: NetworkName
  getBalance(tokenAddress: string, accountAddress: string): Promise<BigNumber>
  getTokens(): TokensRegistry
}
