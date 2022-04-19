import { BigNumber, providers } from 'ethers'

import { TokensRegistry } from '@api/types'
import { Network, NetworkName } from '@interfaces/data'

export interface INetworkAdapter {
  id: Network
  name: NetworkName
  init(provider: providers.JsonRpcProvider): void
  getBalance(tokenAddress: string, accountAddress: string): Promise<BigNumber>
  getTokens(): TokensRegistry
  getSignerAddress(): Promise<string>
  sign(message: string): Promise<string>
}

export interface IGodwokenAdapter extends INetworkAdapter {
  getDepositAddress(address: string): Promise<string>
}
