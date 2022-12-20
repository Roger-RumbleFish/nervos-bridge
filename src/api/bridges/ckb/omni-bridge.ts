import { providers } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'
import {
  Bridge,
  BridgeFeature,
  IGodwokenBridge,
  IBridgeDescriptor,
  Token,
  BridgeTransactionResponse,
  BridgedToken,
} from '@interfaces/data'

import { IGodwokenAdapter, INetworkAdapter } from '../../network/types'
import { AddressTranslator } from 'nervos-godwoken-integration'
import { convertIntegerDecimalToDecimal } from '@utils/stringOperations'
import { delay } from "@utils/time";

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
  ): Promise<BridgeTransactionResponse> {
    try {
      const result = await this.addressTranslator.sendCKB(
        amount.toString(),
        depositAddress,
      )

      await delay(60000)

      return { result }
    } catch (error) {
      return { error }
    }
  }

  async _depositSUDT(
    amount: BigNumber,
    depositAddress: string,
    sudtAddress: string,
  ): Promise<BridgeTransactionResponse> {
    try {
      const result = await this.addressTranslator.sendSUDT(
        amount.toString(),
        depositAddress,
        sudtAddress,
        (85 * 10 ** 8).toString(),
      )
      await delay(60000)

      return { result }
    } catch (error) {
      return { error }
    }
  }

  async deposit(
    amount: BigNumber,
    token: BridgedToken,
  ): Promise<BridgeTransactionResponse> {
    const ethAddress = this.addressTranslator.getConnectedWalletAddress()
    const depositAddress = await this.addressTranslator.getLayer2DepositAddress(
      ethAddress,
    )

    if (token?.minimalBridgeAmount?.gt(amount)) {
      return {
        error: `Please enter an amount greater than ${convertIntegerDecimalToDecimal(
          token.minimalBridgeAmount,
          token.decimals,
        )} to ensure your bridge deposit goes through.`,
      }
    }

    if (token.address !== ZERO_ADDRESS) {
      return this._depositSUDT(amount, depositAddress, token.address)
    }

    return this._depositNative(amount, depositAddress)
  }

  async withdraw(
    _amount: BigNumber,
    _token: BridgedToken,
  ): Promise<BridgeTransactionResponse> {
    throw new Error('not implemented')
    return { error: 'Withdraw not supported' }
  }
}
