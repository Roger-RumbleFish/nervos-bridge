import { providers } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'
import {
  Bridge,
  BridgeFeature,
  IGodwokenBridge,
  IBridgeDescriptor,
  Token,
} from '@interfaces/data'
import PWCore, {
  Provider,
  Web3ModalProvider,
  SUDT,
  Amount,
  SimpleSUDTBuilderOptions,
  BuilderOption,
  AmountUnit,
  Address,
  AddressType,
} from '@lay2/pw-core'

import { IGodwokenAdapter, INetworkAdapter } from '../../network/types'

const ZERO_LOCK_HASH =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

export class CkbBridge implements IGodwokenBridge<Provider> {
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

  public depositNetwork: INetworkAdapter<Provider>
  public withdrawalNetwork: IGodwokenAdapter

  private pwCore: PWCore
  private web3CKBProvider: Provider

  constructor({
    name,
    bridgeNetwork,
    godwokenNetwork,
    pwCore,
    web3CKBProvider,
  }: {
    name: string
    bridgeNetwork: INetworkAdapter<Provider>
    godwokenNetwork: IGodwokenAdapter
    pwCore: PWCore
    web3CKBProvider: Web3ModalProvider
  }) {
    this._id = Bridge.CkbBridge
    this._name = name

    this.depositNetwork = bridgeNetwork
    this.withdrawalNetwork = godwokenNetwork

    this.pwCore = pwCore
    this.web3CKBProvider = web3CKBProvider
  }

  async init(
    _depositProvider: providers.JsonRpcProvider,
    withdrawalProvider: providers.JsonRpcProvider,
  ): Promise<IGodwokenBridge<Provider>> {
    this.withdrawalNetwork.init(withdrawalProvider)
    this.depositNetwork.init(this.web3CKBProvider)

    return this
  }

  toDescriptor(): IBridgeDescriptor {
    return {
      id: Bridge.CkbBridge,
      name: this.name,
      networks: [this.depositNetwork.name, this.withdrawalNetwork.name],
    }
  }

  getDepositNetwork(): INetworkAdapter<Provider> {
    return this.depositNetwork
  }

  getWithdrawalNetwork(): IGodwokenAdapter {
    return this.withdrawalNetwork
  }

  async _depositNative(
    amount: Amount,
    depositAdress: Address,
  ): Promise<string> {
    const options: BuilderOption = {
      feeRate: 2000,
    }

    const depositNativeTx = await this.pwCore.send(
      depositAdress,
      amount,
      options,
    )
    return depositNativeTx
  }

  async _depositSUDT(
    amount: Amount,
    depositAdress: Address,
    sudt: SUDT,
  ): Promise<string> {
    const options: SimpleSUDTBuilderOptions = {
      feeRate: 2000,
      autoCalculateCapacity: true,
      minimumOutputCellCapacity: new Amount('400', AmountUnit.ckb),
    }

    const depositSUDTTxHash = await this.pwCore.sendSUDT(
      sudt,
      depositAdress,
      amount,
      true,
      null,
      options,
    )
    return depositSUDTTxHash
  }

  async deposit(amount: BigNumber, token: Token): Promise<string> {
    if (this.features[BridgeFeature.Deposit]) {
      const depositProvider = this.depositNetwork.getProvider()
      const address = depositProvider.address
      const accountAddressString = address.addressString

      const sudtIssuerLockHash = token.address
      const sudt = new SUDT(sudtIssuerLockHash)

      const depositAmount = new Amount(amount.toString(), AmountUnit.shannon)

      const depositAddressString = await this.withdrawalNetwork.getDepositAddress(
        accountAddressString,
      )
      const depositAddress = new Address(depositAddressString, AddressType.ckb)

      if (sudtIssuerLockHash !== ZERO_LOCK_HASH) {
        return this._depositSUDT(depositAmount, depositAddress, sudt)
      }

      return this._depositNative(depositAmount, depositAddress)
    }

    return 'deposit'
  }

  async withdraw(_amount: BigNumber, _token: Token): Promise<string> {
    return 'withdraw'
  }
}
