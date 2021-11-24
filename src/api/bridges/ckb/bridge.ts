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
import { Godwoken } from './godwoken'

const ZERO_LOCK_HASH =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

export class CkbBridge implements IBridge {
  public id: string
  public name: string

  public fromNetwork: INetworkAdapter
  public toNetwork: INetworkAdapter

  private _web3: Web3
  private _pwCore: PWCore
  private _web3CKBProvider: Provider
  private _indexerCollector: IndexerCollector
  private _addressTranslator: AddressTranslator

  private registeredTokens: BridgedTokensRegistry
  private godwoken: Godwoken

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
  ) {
    this.id = id
    this.name = name

    this.fromNetwork = fromNetwork
    this.toNetwork = toNetwork

    this._web3 = web3

    const web3CKBProvider = new Web3ModalProvider(web3)
    this._web3CKBProvider = web3CKBProvider

    this._indexerCollector = indexerCollector
    this._pwCore = pwCoreClient
    this._addressTranslator = addressTranslator
    this.godwoken = godwoken
  }

  async init(): Promise<CkbBridge> {
    await this._pwCore.init(this._web3CKBProvider, this._indexerCollector)

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

    const depositNativeTx = await this._pwCore.send(
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

    const depositSUDTTxHash = await this._pwCore.sendSUDT(
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
    console.log('[api][bridge][ckb] token', token)
    const depositAmount = new Amount(
      amount.div(BigNumber.from(10).pow(token.decimals)).toString(),
      token.decimals ?? AmountUnit.ckb,
    )
    const [accountAddress] = await this._web3.eth.getAccounts()

    const depositAddress = await this._addressTranslator.getLayer2DepositAddress(
      this._web3CKBProvider,
      accountAddress,
    )

    if (sudtIssuerLockHash !== ZERO_LOCK_HASH) {
      return this._depositSUDT(depositAmount, depositAddress, sudt)
    }

    return this._depositNative(depositAmount, depositAddress)
  }

  async signMessageEthereum(message: string, address: string): Promise<string> {
    const result = await (window.ethereum as any).request({
      method: 'eth_sign',
      params: [address, message],
    })

    let v = Number.parseInt(result.slice(-2), 16)

    if (v >= 27) v -= 27

    return `0x${result.slice(2, -2)}${v.toString(16).padStart(2, '0')}`
  }

  async withdraw(amount: BigNumber, token: Token): Promise<string> {
    const [accountAddress] = await this._web3.eth.getAccounts()

    const sudtIssuerLockHash = token.address
    const sudt = new SUDT(sudtIssuerLockHash)

    const ckbTokensRegistry = this.getDepositNetwork().getTokens()
    const godwokenTokensRegistry = this.getWithdrawalNetwork().getTokens()

    const [canonicalTokenSymbol] = Object.keys(godwokenTokensRegistry)
      .map((tokenSymbol) => tokenSymbol as CanonicalTokenSymbol)
      .filter(
        (tokenSymbol) =>
          godwokenTokensRegistry[tokenSymbol].address === token.address,
      )

    const ckbToken = ckbTokensRegistry[canonicalTokenSymbol]
    console.log('[bridge][ckb][withdraw] props', amount, sudt.issuerLockHash)
    console.log('[bridge][ckb][withdraw] address', accountAddress)

    console.log('[bridge][ckb][withdraw] godwoken', this.godwoken)

    this.godwoken.withdraw(amount, ckbToken.address, accountAddress)

    return 'withdraw'
  }
}
