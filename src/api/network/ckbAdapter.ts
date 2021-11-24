import { BigNumber } from 'ethers'
import { AddressTranslator } from 'nervos-godwoken-integration'
import Web3 from 'web3'

import { TokensRegistry } from '@api/types'
import { NetworkName } from '@interfaces/data'
import PWCore, {
  Address,
  AddressType,
  IndexerCollector,
  SUDT,
  Web3ModalProvider,
} from '@lay2/pw-core'

import { registry } from '../registry/ckbRegistry'
import { INetworkAdapter } from './types'

const ZERO_LOCK_HASH =
  '0x0000000000000000000000000000000000000000000000000000000000000000'
const IS_TESTNET = true

export class CkbNetwork implements INetworkAdapter {
  public id: string
  public name: NetworkName

  private provider: Web3ModalProvider
  private pwCore: PWCore

  private indexerCollector: IndexerCollector
  private addressTranslator: AddressTranslator

  private supportedTokens: TokensRegistry

  constructor(
    id: string,
    name: string,
    web3: Web3,
    indexerCollector: IndexerCollector,
    pwCoreClient: PWCore,
    addressTranslator: AddressTranslator,
  ) {
    this.id = id
    this.name = name

    this.provider = new Web3ModalProvider(web3)
    this.indexerCollector = indexerCollector
    this.pwCore = pwCoreClient
    this.addressTranslator = addressTranslator

    this.supportedTokens = registry
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
      IS_TESTNET,
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
}
