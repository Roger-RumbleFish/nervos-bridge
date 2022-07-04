import { BigNumber, providers } from 'ethers'
import { AddressTranslator } from 'nervos-godwoken-integration'

import { TokensRegistry } from '@api/types'
import { Network, Environment } from '@interfaces/data'
import { Address, AddressType, SUDT } from '@lay2/pw-core'

import { registry } from '../registry/ckb'
import { INetworkAdapter } from './types'

const ZERO_ADDRESS =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

export class CkbNetwork implements INetworkAdapter<providers.JsonRpcProvider> {
  private _id: Network
  public get id(): Network {
    return this._id
  }

  private _name: string
  public get name(): string {
    return this._name
  }
  private provider: providers.JsonRpcProvider

  private addressTranslator: AddressTranslator

  private supportedTokens: TokensRegistry

  constructor(
    id: Network,
    name: string,
    addressTranslator: AddressTranslator,
    environment: Environment,
  ) {
    this._id = id
    this._name = name

    this.addressTranslator = addressTranslator

    this.supportedTokens = registry(environment)
  }

  async init(provider: providers.JsonRpcProvider): Promise<void> {
    this.provider = provider
  }

  async _getBalanceNative(ckbAddress: Address): Promise<BigNumber> {
    const balance = await this.addressTranslator.getCKBBalance(
      ckbAddress.addressString,
    )

    return BigNumber.from(balance)
  }

  async _getBalanceSUDT(
    sudtIssuerLockHash: string,
    ckbAddress: Address,
  ): Promise<BigNumber> {
    const sudt = new SUDT(sudtIssuerLockHash)

    const balance = await this.addressTranslator.getSUDTBalance(
      ckbAddress.addressString,
      sudt.issuerLockHash,
    )

    return BigNumber.from(balance)
  }

  async getBalance(
    sudtIssuerLockHash: string,
    accountAddress: string,
  ): Promise<BigNumber> {
    const ckbAddressString = this.addressTranslator.ethAddressToCkbAddress(
      accountAddress,
    )
    const ckbAddress = new Address(ckbAddressString, AddressType.ckb)

    if (sudtIssuerLockHash !== ZERO_ADDRESS) {
      return this._getBalanceSUDT(sudtIssuerLockHash, ckbAddress)
    }

    return this._getBalanceNative(ckbAddress)
  }

  getTokens(): TokensRegistry {
    return this.supportedTokens
  }

  async getSignerAddress(): Promise<string> {
    const ethSignerAddress = this.addressTranslator.getConnectedWalletAddress()
    const ckbSignerAddress = this.addressTranslator.ethAddressToCkbAddress(
      ethSignerAddress,
    )

    return ckbSignerAddress
  }

  async sign(_message: string): Promise<string> {
    return ''
  }

  getProvider(): providers.JsonRpcProvider {
    return this.provider
  }
}
