import { providers } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'
import {
  Bridge,
  BridgeFeature,
  IGodwokenBridge,
  IBridgeDescriptor,
  Token,
} from '@interfaces/data'

import { IGodwokenAdapter, INetworkAdapter } from '../../network/types'
import { AddressTranslator } from 'nervos-godwoken-integration'

const ZERO_ADDRESS =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

export class OmniBridge implements IGodwokenBridge<providers.JsonRpcProvider> {
  private _id: Bridge
  public get id(): Bridge {
    return this._id
  }

  private _name: string
  public get name(): string {
    return this._name
  }

  public features = {
    [BridgeFeature.Deposit]: true,
    [BridgeFeature.Withdraw]: false,
  }

  public depositNetwork: INetworkAdapter<providers.JsonRpcProvider>
  public withdrawalNetwork: IGodwokenAdapter
  public addressTranslator: AddressTranslator

  constructor({
    name,
    bridgeNetwork,
    godwokenNetwork,
    addressTranslator,
  }: {
    name: string
    bridgeNetwork: INetworkAdapter<providers.JsonRpcProvider>
    godwokenNetwork: IGodwokenAdapter
    addressTranslator: AddressTranslator
  }) {
    this._id = Bridge.OmniBridge
    this._name = name

    this.depositNetwork = bridgeNetwork
    this.withdrawalNetwork = godwokenNetwork
    this.addressTranslator = addressTranslator
  }

  async init(
    depositProvider: providers.JsonRpcProvider,
    withdrawalProvider: providers.JsonRpcProvider,
  ): Promise<IGodwokenBridge<providers.JsonRpcProvider>> {
    this.withdrawalNetwork.init(withdrawalProvider)
    this.depositNetwork.init(depositProvider)
    await this.addressTranslator.connectWallet()

    return this
  }

  toDescriptor(): IBridgeDescriptor {
    return {
      id: Bridge.OmniBridge,
      name: this.name,
      networks: [this.depositNetwork.name, this.withdrawalNetwork.name],
    }
  }

  getDepositNetwork(): INetworkAdapter<providers.JsonRpcProvider> {
    return this.depositNetwork
  }

  getWithdrawalNetwork(): IGodwokenAdapter {
    return this.withdrawalNetwork
  }

  async _depositNative(
    amount: BigNumber,
    depositAddress: string,
  ): Promise<string> {
    return this.addressTranslator.sendCKB(amount.toString(), depositAddress)
  }

  async _depositSUDT(
    amount: BigNumber,
    depositAddress: string,
    sudtAddress: string,
  ): Promise<string> {
    return this.addressTranslator.sendSUDT(
      amount.toString(),
      depositAddress,
      sudtAddress,
      (85 * 10 ** 8).toString(),
    )
  }

  async deposit(amount: BigNumber, token: Token): Promise<string> {
    const ethAddress = this.addressTranslator.getConnectedWalletAddress()
    const depositAddress = await this.addressTranslator.getLayer2DepositAddress(
      ethAddress,
    )
    if (token.address !== ZERO_ADDRESS) {
      return this._depositSUDT(amount, depositAddress, token.address)
    }

    return this._depositNative(amount, depositAddress)
  }

  async withdraw(_amount: BigNumber, _token: Token): Promise<string> {
    throw new Error('not implemented')
    return 'withdraw'
  }
}
