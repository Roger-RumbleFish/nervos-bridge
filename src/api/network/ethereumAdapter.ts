import { BigNumber, providers } from 'ethers'

import { TokensRegistry } from '@api/types'
import { NetworkName, Token } from '@interfaces/data'

import { ERC20__factory } from '../../factories/ERC20__factory'
import { registry } from '../registry/etherumRegistry'
import { INetworkAdapter } from './types'

const ETHEREUM_ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export class EthereumNetwork implements INetworkAdapter {
  public id: string
  public name: NetworkName

  private provider: providers.JsonRpcProvider

  private supportedTokens: TokensRegistry

  constructor(id: string, name: string, provider: providers.JsonRpcProvider) {
    this.id = id
    this.name = name
    this.provider = provider

    this.supportedTokens = registry
  }

  async _getBalanceNative(ethereumAddress: string): Promise<BigNumber> {
    return this.provider.getBalance(ethereumAddress)
  }

  async _getBalanceERC20(
    tokenAddress: string,
    accountAddress: string,
  ): Promise<BigNumber> {
    const erc20Contract = ERC20__factory.connect(tokenAddress, this.provider)

    const balance = await erc20Contract.balanceOf(accountAddress)

    return balance
  }

  async getBalance(
    tokenAddress: string,
    accountAddress: string,
  ): Promise<BigNumber> {
    if (tokenAddress !== ETHEREUM_ZERO_ADDRESS) {
      return this._getBalanceERC20(tokenAddress, accountAddress)
    }

    return this._getBalanceNative(accountAddress)
  }

  async registerToken(token: Token): Promise<void> {
    console.log('[network][ethereum] register token', token)
  }

  getTokens(): TokensRegistry {
    return this.supportedTokens
  }
}
