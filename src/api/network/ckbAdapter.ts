import { BigNumber } from 'ethers'
import { AddressTranslator } from 'nervos-godwoken-integration'
import Web3 from 'web3'

import { NetworkName } from '@interfaces/data'
import PWCore, {
  Address,
  AddressType,
  IndexerCollector,
  SUDT,
  Web3ModalProvider,
} from '@lay2/pw-core'

import { INetworkAdapter } from './types'

const ZERO_LOCK_HASH =
  '0x0000000000000000000000000000000000000000000000000000000000000000'
const IS_TESTNET = true

interface CkbRpcConfig {
  ckbUrl: string
  indexerUrl: string
}

export class CkbNetwork implements INetworkAdapter {
  public id: string
  public name: NetworkName

  private provider: Web3ModalProvider

  private indexerCollector: IndexerCollector
  private pwCore: PWCore
  private addressTranslator: AddressTranslator

  constructor(
    id: string,
    name: string,
    config: CkbRpcConfig,
    addressTranslator: AddressTranslator,
  ) {
    this.id = id
    this.name = name

    const web3 = new Web3(Web3.givenProvider)

    this.provider = new Web3ModalProvider(web3)
    this.indexerCollector = new IndexerCollector(config.indexerUrl)

    this.pwCore = new PWCore(config.ckbUrl)

    this.addressTranslator = addressTranslator
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
}
