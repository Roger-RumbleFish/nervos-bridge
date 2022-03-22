import { BigNumber, providers } from 'ethers'
import { AddressTranslator } from 'nervos-godwoken-integration'

import { TokensRegistry } from '@api/types'
import { NetworkName, Network, Environment } from '@interfaces/data'

import { ERC20__factory } from '../../contracts/ERC20__factory'
import { registry } from '../registry/godwoken'
import { INetworkAdapter } from './types'

const GODWOKEN_ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
const GODWOKEN_NETWORK_ID = Network.Godwoken

export class GodwokenNetwork implements INetworkAdapter {
  private _id: Network = GODWOKEN_NETWORK_ID
  public get id(): Network {
    return this._id
  }
  public name: NetworkName

  private provider: providers.JsonRpcProvider
  private addressTranslator: AddressTranslator

  private supportedTokens: TokensRegistry

  constructor(
    environment: Environment,
    name: string,
    addressTranslator: AddressTranslator,
  ) {
    this.name = name
    this.addressTranslator = addressTranslator

    this.supportedTokens = registry(environment)
  }

  async init(provider: providers.JsonRpcProvider): Promise<void> {
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

  async _signMessageEthereum(
    message: string,
    address: string,
  ): Promise<string> {
    const ethereum = window?.ethereum as providers.ExternalProvider
    const result = await ethereum.request({
      method: 'eth_sign',
      params: [address, message],
    })

    let v = Number.parseInt(result.slice(-2), 16)

    if (v >= 27) v -= 27

    return `0x${result.slice(2, -2)}${v.toString(16).padStart(2, '0')}`
  }

  async getSignerAddress(): Promise<string> {
    const signer = this.provider.getSigner()
    const signerAddress = await signer.getAddress()

    return signerAddress
  }

  async sign(message: string): Promise<string> {
    const signerAddress = await this.getSignerAddress()

    return this._signMessageEthereum(message, signerAddress)
  }
}
