import { BigNumber, providers } from 'ethers'

import { TokensRegistry } from '@api/types'
import { Network } from '@interfaces/data'

import { ERC20__factory } from '../../contracts/ERC20__factory'
import { INetworkAdapter } from './types'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export class EthereumNetwork implements INetworkAdapter {
  private _id: Network
  public get id(): Network {
    return this._id
  }

  private _name: string
  public get name(): string {
    return this._name
  }

  private provider: providers.JsonRpcProvider

  private supportedTokens: TokensRegistry

  constructor(id: Network, name: string, tokensRegistry: TokensRegistry) {
    this._id = id
    this._name = name

    this.supportedTokens = tokensRegistry
  }

  async init(provider: providers.JsonRpcProvider): Promise<void> {
    console.log('[network] Ethereum provider', provider)
    this.provider = provider
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
    console.log('tokenAddress', tokenAddress)
    console.log('accountAddress', accountAddress)
    console.log('provider', this.provider)
    if (tokenAddress !== ZERO_ADDRESS) {
      return this._getBalanceERC20(tokenAddress, accountAddress)
    }

    return this._getBalanceNative(accountAddress)
  }

  getTokens(): TokensRegistry {
    return this.supportedTokens
  }

  async getSignerAddress(): Promise<string> {
    const signer = this.provider.getSigner()
    const signerAddress = await signer.getAddress()

    return signerAddress
  }

  async sign(_message: string): Promise<string> {
    return ''
  }
}
