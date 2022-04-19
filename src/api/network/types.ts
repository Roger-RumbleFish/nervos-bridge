import { BigNumber, providers } from 'ethers'

import { TokensRegistry } from '@api/types'
import { Network, NetworkName } from '@interfaces/data'

export interface INetworkAdapter<T> {
  id: Network
  name: NetworkName
  init(provider?: T): void
  getBalance(tokenAddress: string, accountAddress: string): Promise<BigNumber>
  getTokens(): TokensRegistry
  getSignerAddress(): Promise<string>
  sign(message: string): Promise<string>
  getProvider(): T
}

export interface IGodwokenAdapter
  extends INetworkAdapter<providers.JsonRpcProvider> {
  getDepositAddress(address: string): Promise<string>
}
