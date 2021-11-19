import { BigNumber } from 'ethers'
import PWCore, {
  Address,
  AddressType,
  IndexerCollector,
  SUDT,
  Web3ModalProvider,
} from 'nervos-godwoken-integration/node_modules/@lay2/pw-core'
import Web3 from 'web3'

import { NetworkName } from '@interfaces/data'

import { INetworkAdapter } from './types'

const ZERO_LOCK_HASH =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

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

  constructor(id: string, name: string, config: CkbRpcConfig) {
    this.id = id
    this.name = name

    const web3 = new Web3(Web3.givenProvider)

    this.provider = new Web3ModalProvider(web3)
    this.indexerCollector = new IndexerCollector(config.indexerUrl)
    this.pwCore = new PWCore(config.ckbUrl)
  }

  async _getBalanceNative(ckbAddress: Address): Promise<BigNumber> {
    const balance = await this.indexerCollector.getBalance(ckbAddress)

    const balanceString: string = balance.toBigInt().toString()

    console.log('balance string', balanceString)
    return BigNumber.from(balanceString)
  }

  async _getBalanceSUDT(
    ckbAddress: Address,
    sudtIssuerLockHash: string,
  ): Promise<BigNumber> {
    const sudt = new SUDT(sudtIssuerLockHash)

    const balance = await this.indexerCollector.getSUDTBalance(sudt, ckbAddress)
    const balanceString: string = balance.toBigInt().toString()

    return BigNumber.from(balanceString)
  }

  async getBalance(
    accountAddress: string,
    sudtIssuerLockHash: string,
  ): Promise<BigNumber> {
    const ckbAddress = new Address(accountAddress, AddressType.ckb)

    if (sudtIssuerLockHash !== ZERO_LOCK_HASH) {
      return this._getBalanceSUDT(ckbAddress, sudtIssuerLockHash)
    }

    return this._getBalanceNative(ckbAddress)
  }
}
