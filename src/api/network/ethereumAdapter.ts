import { BigNumber, providers } from 'ethers'

import { TokensRegistry } from '@api/types'
import { NetworkName, Network } from '@interfaces/data'

import { ERC20__factory } from '../../factories/ERC20__factory'
import { registry } from '../registry/ethereum'
import { INetworkAdapter } from './types'

const ETHEREUM_ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export class EthereumNetwork implements INetworkAdapter {
  public id: string
  public name: NetworkName

  private provider: providers.JsonRpcProvider

  private supportedTokens: TokensRegistry

  constructor(
    network: Network,
    id: string,
    name: string,
    provider: providers.JsonRpcProvider,
  ) {
    this.id = id
    this.name = name
    this.provider = provider

    this.supportedTokens = registry(network)
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
