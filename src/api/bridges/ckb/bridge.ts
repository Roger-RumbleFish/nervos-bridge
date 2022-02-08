import { AddressTranslator } from 'nervos-godwoken-integration'

import { BigNumber } from '@ethersproject/bignumber'
import {
  BridgeFeature,
  IBridge,
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
} from '@lay2/pw-core'
import {
  Godwoken as GodwokenRpcHandler,
  GodwokenUtils as GodwokenMessageUtils,
  RawWithdrawalRequest,
  Uint32,
  WithdrawalRequest,
} from '@polyjuice-provider/godwoken'

import { INetworkAdapter } from '../../network/types'

const ZERO_LOCK_HASH =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

export class CkbBridge implements IBridge {
  public id: string
  public name: string

  public features = {
    [BridgeFeature.Deposit]: true,
    [BridgeFeature.Withdraw]: false,
  }

  public depositNetwork: INetworkAdapter
  public withdrawalNetwork: INetworkAdapter

  private pwCore: PWCore
  private web3CKBProvider: Provider
  private addressTranslator: AddressTranslator

  private godwokenRpcHandler: GodwokenRpcHandler

  constructor(
    id: string,
    name: string,
    depositNetwork: INetworkAdapter,
    withdrawalNetwork: INetworkAdapter,
    addressTranslator: AddressTranslator,
    web3CKBProvider: Web3ModalProvider,
    pwCoreClient: PWCore,
    godwokenRpcHandler: GodwokenRpcHandler,
  ) {
    this.id = id
    this.name = name

    this.depositNetwork = depositNetwork
    this.withdrawalNetwork = withdrawalNetwork

    this.pwCore = pwCoreClient
    this.web3CKBProvider = web3CKBProvider
    this.addressTranslator = addressTranslator

    this.godwokenRpcHandler = godwokenRpcHandler
  }

  toDescriptor(): IBridgeDescriptor {
    return {
      id: this.id,
      name: this.name,
      networks: [this.depositNetwork.name, this.withdrawalNetwork.name],
    }
  }

  getDepositNetwork(): INetworkAdapter {
    return this.depositNetwork
  }

  getWithdrawalNetwork(): INetworkAdapter {
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
      const accountAddress = this.web3CKBProvider.address
      const accountAddressString = accountAddress.addressString

      const sudtIssuerLockHash = token.address
      const sudt = new SUDT(sudtIssuerLockHash)

      const depositAmount = new Amount(amount.toString(), AmountUnit.shannon)

      const depositAddress = await this.addressTranslator.getLayer2DepositAddress(
        accountAddressString,
      )

      if (sudtIssuerLockHash !== ZERO_LOCK_HASH) {
        return this._depositSUDT(depositAmount, depositAddress, sudt)
      }

      return this._depositNative(depositAmount, depositAddress)
    }

    return 'deposit'
  }

  async withdraw(amount: BigNumber, token: Token): Promise<string> {
    if (this.features[BridgeFeature.Withdraw]) {
      const accountAddress = this.web3CKBProvider.address
      const accountAddressString = accountAddress.addressString

      const sudtIssuerLockHash = token.address

      const ckbAddress = this.addressTranslator.ethAddressToCkbAddress(
        accountAddressString,
      )
      const l2EthLockHash = this.addressTranslator.getLayer2EthLockHash(
        accountAddressString,
      )

      const accountId = await this.godwokenRpcHandler.getAccountIdByScriptHash(
        l2EthLockHash,
      )
      const depositTransactionNonce: Uint32 = await this.godwokenRpcHandler.getNonce(
        accountId,
      )

      const accountLock = this.addressTranslator.ckbAddressToLockScriptHash(
        ckbAddress,
      )

      const HARDCODED_CAPACITY = BigNumber.from(0).mul(
        BigNumber.from(10).pow(8),
      )

      const rawWithdrawalRequest: RawWithdrawalRequest = GodwokenMessageUtils.createRawWithdrawalRequest(
        depositTransactionNonce,
        amount.toBigInt(),
        HARDCODED_CAPACITY.toBigInt(),
        sudtIssuerLockHash,
        l2EthLockHash,
        BigInt(0),
        BigInt(100 * 10 ** 8),
        accountLock,
        '0x' + '0'.repeat(64),
      )
      const godwokenUtils = new GodwokenMessageUtils(
        '0x4cc2e6526204ae6a2e8fcf12f7ad472f41a1606d5b9624beebd215d780809f6a',
      )
      const message = godwokenUtils.generateWithdrawalMessageToSign(
        rawWithdrawalRequest,
      )

      const signature = await this.withdrawalNetwork.sign(message)

      const withdrawalRequest: WithdrawalRequest = {
        raw: rawWithdrawalRequest,
        signature: signature,
      }

      await this.godwokenRpcHandler.submitWithdrawalRequest(withdrawalRequest)
    }

    return 'withdraw'
  }
}
