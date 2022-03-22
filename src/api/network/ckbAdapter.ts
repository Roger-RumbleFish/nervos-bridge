import { BigNumber, providers } from 'ethers'
import { AddressTranslator } from 'nervos-godwoken-integration'
import Web3 from 'web3'

import { TokensRegistry } from '@api/types'
import { NetworkName, Network, Environment } from '@interfaces/data'
import PWCore, {
  Address,
  AddressType,
  IndexerCollector,
  SUDT,
  Web3ModalProvider,
} from '@lay2/pw-core'

import { registry } from '../registry/ckb'
import { INetworkAdapter } from './types'

const ZERO_LOCK_HASH =
  '0x0000000000000000000000000000000000000000000000000000000000000000'
const CKB_NETWORK_ID = Network.CKB

export class CkbNetwork implements INetworkAdapter {
  private _id: Network = CKB_NETWORK_ID
  public get id(): Network {
    return this._id
  }

  public name: NetworkName

  private provider: Web3ModalProvider
  private pwCore: PWCore

  private indexerCollector: IndexerCollector
  private addressTranslator: AddressTranslator

  private supportedTokens: TokensRegistry

  constructor(
    environment: Environment,
    name: string,
    indexerCollector: IndexerCollector,
    pwCoreClient: PWCore,
    addressTranslator: AddressTranslator,
  ) {
    this.name = name

    this.indexerCollector = indexerCollector
    this.pwCore = pwCoreClient
    this.addressTranslator = addressTranslator

    this.supportedTokens = registry(environment)
  }

  async init(provider: providers.JsonRpcProvider): Promise<void> {
    const web3 = new Web3(Web3.givenProvider)
    this.provider = new Web3ModalProvider(web3)
  }

  async _getBalanceNative(ckbAddress: Address): Promise<BigNumber> {
    const balance = await this.indexerCollector.getBalance(ckbAddress)

    const balanceString: string = balance.toBigInt().toString()

    return BigNumber.from(balanceString)
  }

  async _getBalanceSUDT(
    sudtIssuerLockHash: string,
    ckbAddress: Address,
  ): Promise<BigNumber> {
    const sudt = new SUDT(sudtIssuerLockHash)

    const balance = await this.indexerCollector.getSUDTBalance(sudt, ckbAddress)
    const balanceString: string = balance.toBigInt().toString()

    return BigNumber.from(balanceString)
  }

  async getBalance(
    sudtIssuerLockHash: string,
    accountAddress: string,
  ): Promise<BigNumber> {
    const ckbAddressString = this.addressTranslator.ethAddressToCkbAddress(
      accountAddress,
    )
    const ckbAddress = new Address(ckbAddressString, AddressType.ckb)

    if (sudtIssuerLockHash !== ZERO_LOCK_HASH) {
      return this._getBalanceSUDT(sudtIssuerLockHash, ckbAddress)
    }

    return this._getBalanceNative(ckbAddress)
  }

  getTokens(): TokensRegistry {
    return this.supportedTokens
  }

  async getSignerAddress(): Promise<string> {
    const ethSignerAddress = this.provider.address.addressString
    const ckbSignerAddress = this.addressTranslator.ethAddressToCkbAddress(
      ethSignerAddress,
    )

    return ckbSignerAddress
  }

  async sign(_message: string): Promise<string> {
    return ''
  }
}
