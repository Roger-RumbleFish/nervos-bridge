import { BigNumber, providers } from 'ethers'

import { TokensRegistry } from '@api/types'
import { NetworkName, Network, Environment } from '@interfaces/data'

import { ERC20__factory } from '../../contracts/ERC20__factory'
import { registry } from '../registry/ethereum'
import { INetworkAdapter } from './types'

const ETHEREUM_ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
const ETHEREUM_NETWORK_ID = Network.Ethereum

export class EthereumNetwork implements INetworkAdapter {
  private _id: Network = ETHEREUM_NETWORK_ID
  public get id(): Network {
    return this._id
  }

  public name: NetworkName

  private provider: providers.JsonRpcProvider

  private supportedTokens: TokensRegistry

  constructor(environment: Environment, name: string) {
    this.name = name

    this.supportedTokens = registry(environment)
  }

  async init(provider: providers.JsonRpcProvider): Promise<void> {
    console.log('[bridge][ethereum network] init', provider)
    this.provider = provider
  }

  async _getBalanceNative(ethereumAddress: string): Promise<BigNumber> {
    console.log(
      '[bridge][ethereum network] get balance ethereum address',
      ethereumAddress,
    )
    console.log('[bridge][ethereum network] provider', this.provider)

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
