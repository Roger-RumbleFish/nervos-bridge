import { AddressTranslator } from 'nervos-godwoken-integration'
import Web3 from 'web3'

import { BridgedTokensRegistry, CanonicalTokenSymbol } from '@api/types'
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

import { INetworkAdapter } from '../../network/types'
import { IBridgeConfig } from '../types'
import { Godwoken } from './godwoken'

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
  private godwoken: Godwoken

  public config: IBridgeConfig

  constructor(
    id: string,
    name: string,
    fromNetwork: INetworkAdapter,
    toNetwork: INetworkAdapter,
    addressTranslator: AddressTranslator,
    web3: Web3,
    indexerCollector: IndexerCollector,
    pwCoreClient: PWCore,
    godwoken: Godwoken,
    config: IBridgeConfig,
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
    this.godwoken = godwoken

    this.config = config
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
    if (this.config.deposit) {
      const sudtIssuerLockHash = token.address
      const sudt = new SUDT(sudtIssuerLockHash)
      console.log('[api][bridge][ckb] token', token)
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

    return 'not supported'
  }

  async withdraw(amount: BigNumber, token: Token): Promise<string> {
    if (this.config.withdraw) {
      const [accountAddress] = await this.web3.eth.getAccounts()

      const ckbTokensRegistry = this.getDepositNetwork().getTokens()
      const godwokenTokensRegistry = this.getWithdrawalNetwork().getTokens()

      const [canonicalTokenSymbol] = Object.keys(godwokenTokensRegistry)
        .map((tokenSymbol) => tokenSymbol as CanonicalTokenSymbol)
        .filter(
          (tokenSymbol) =>
            godwokenTokensRegistry[tokenSymbol].address === token.address,
        )

      const ckbToken = ckbTokensRegistry[canonicalTokenSymbol]

      this.godwoken.withdraw(amount, ckbToken.address, accountAddress)

      return 'withdraw'
    }

    return 'not supported'
  }
}
