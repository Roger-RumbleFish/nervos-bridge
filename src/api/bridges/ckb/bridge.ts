import { AddressTranslator } from 'nervos-godwoken-integration'
import Web3 from 'web3'

import { BridgedTokensRegistry } from '@api/types'
import { utils } from '@ckb-lumos/base'
import { parseAddress } from '@ckb-lumos/helpers'
import { BigNumber } from '@ethersproject/bignumber'
import { IBridge, IBridgeDescriptor, Token } from '@interfaces/data'
import PWCore, {
  IndexerCollector,
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

// import { Godwoken } from './godwoken'

const ZERO_LOCK_HASH =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

export class CkbBridge implements IBridge {
  public id: string
  public name: string

  public fromNetwork: INetworkAdapter
  public toNetwork: INetworkAdapter

  private web3: Web3
  private pwCore: PWCore
  private web3CKBProvider: Provider
  private indexerCollector: IndexerCollector
  private addressTranslator: AddressTranslator

  private registeredTokens: BridgedTokensRegistry
  private godwokenRpcHandler: GodwokenRpcHandler

  constructor(
    id: string,
    name: string,
    fromNetwork: INetworkAdapter,
    toNetwork: INetworkAdapter,
    addressTranslator: AddressTranslator,
    web3: Web3,
    indexerCollector: IndexerCollector,
    pwCoreClient: PWCore,
    godwokenRpcHandler: GodwokenRpcHandler,
  ) {
    this.id = id
    this.name = name

    this.fromNetwork = fromNetwork
    this.toNetwork = toNetwork

    this.web3 = web3

    const web3CKBProvider = new Web3ModalProvider(web3)
    this.web3CKBProvider = web3CKBProvider

    this.indexerCollector = indexerCollector
    this.pwCore = pwCoreClient
    this.addressTranslator = addressTranslator
    this.godwokenRpcHandler = godwokenRpcHandler
  }

  async init(): Promise<CkbBridge> {
    await this.pwCore.init(this.web3CKBProvider, this.indexerCollector)

    return this
  }

  toDescriptor(): IBridgeDescriptor {
    return {
      id: this.id,
      name: this.name,
      networks: [this.fromNetwork.name, this.toNetwork.name],
    }
  }

  getDepositNetwork(): INetworkAdapter {
    return this.fromNetwork
  }

  getWithdrawalNetwork(): INetworkAdapter {
    return this.toNetwork
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
    const sudtIssuerLockHash = token.address
    const sudt = new SUDT(sudtIssuerLockHash)
    const depositAmount = new Amount(
      amount.div(BigNumber.from(10).pow(token.decimals)).toString(),
      token.decimals ?? AmountUnit.ckb,
    )
    const [accountAddress] = await this.web3.eth.getAccounts()

    const depositAddress = await this.addressTranslator.getLayer2DepositAddress(
      this.web3CKBProvider,
      accountAddress,
    )

    if (sudtIssuerLockHash !== ZERO_LOCK_HASH) {
      return this._depositSUDT(depositAmount, depositAddress, sudt)
    }

    return this._depositNative(depositAmount, depositAddress)
  }

  async withdraw(amount: BigNumber, token: Token): Promise<string> {
    const [accountAddress] = await this.web3.eth.getAccounts()

    const sudtIssuerLockHash = token.address
    // const sudt = new SUDT(sudtIssuerLockHash)

    // const ckbTokensRegistry = this.getDepositNetwork().getTokens()
    // const godwokenTokensRegistry = this.getWithdrawalNetwork().getTokens()

    // const [canonicalTokenSymbol] = Object.keys(godwokenTokensRegistry)
    //   .map((tokenSymbol) => tokenSymbol as CanonicalTokenSymbol)
    //   .filter(
    //     (tokenSymbol) =>
    //       godwokenTokensRegistry[tokenSymbol].address === token.address,
    //   )

    // const ckbToken = ckbTokensRegistry[canonicalTokenSymbol]

    const ckbAddress = this.addressTranslator.ethAddressToCkbAddress(
      accountAddress,
    )
    const l2EthLockHash = this.addressTranslator.getLayer2EthLockHash(
      accountAddress,
    )

    const accountId = await this.godwokenRpcHandler.getAccountIdByScriptHash(
      l2EthLockHash,
    )
    // const l2LockHash = await this.godwokenRpcHandler.getScriptHash(accountId)
    const depositTransactionNonce: Uint32 = await this.godwokenRpcHandler.getNonce(
      accountId,
    )

    const lock = parseAddress(ckbAddress)
    const accountLock = utils.computeScriptHash(lock)

    const HARDCODED_CAPACITY = BigNumber.from(0).mul(BigNumber.from(10).pow(8))

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

    const signature = await this.toNetwork.sign(message)

    const withdrawalRequest: WithdrawalRequest = {
      raw: rawWithdrawalRequest,
      signature: signature,
    }

    await this.godwokenRpcHandler.submitWithdrawalRequest(withdrawalRequest)

    return 'withdraw'
  }
}
