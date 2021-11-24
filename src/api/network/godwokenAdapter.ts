import { BigNumber, providers } from 'ethers'
import { AddressTranslator } from 'nervos-godwoken-integration'

import { TokensRegistry } from '@api/types'
import { NetworkName } from '@interfaces/data'

import { ERC20__factory } from '../../factories/ERC20__factory'
import { registry } from '../registry/godwokenRegistry'
import { INetworkAdapter } from './types'

const GODWOKEN_ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export class GodwokenNetwork implements INetworkAdapter {
  public id: string
  public name: NetworkName

  private provider: providers.JsonRpcProvider
  private addressTranslator: AddressTranslator

  private supportedTokens: TokensRegistry

  constructor(
    id: string,
    name: string,
    provider: providers.JsonRpcProvider,
    addressTranslator: AddressTranslator,
  ) {
    this.id = id
    this.name = name
    this.provider = provider
    this.addressTranslator = addressTranslator

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

    const balance = await erc20Contract.balanceOf(accountAddress, {
      gasLimit: 6000000,
      gasPrice: 0,
    })

    return balance
  }

  async getBalance(
    tokenAddress: string,
    accountAddress: string,
  ): Promise<BigNumber> {
    const godwokenAddress = this.addressTranslator.ethAddressToGodwokenShortAddress(
      accountAddress,
    )
    if (tokenAddress !== GODWOKEN_ZERO_ADDRESS) {
      return this._getBalanceERC20(tokenAddress, godwokenAddress)
    }

    return this._getBalanceNative(godwokenAddress)
  }

  getTokens(): TokensRegistry {
    return this.supportedTokens
  }
}
