import { AddressTranslator } from 'nervos-godwoken-integration'
import Web3 from 'web3'

import { BigNumber } from '@ethersproject/bignumber'
import PWCore, {
  Address,
  AddressType,
  IndexerCollector,
  Provider,
  Web3ModalProvider,
  SUDT,
  Amount,
  SimpleSUDTBuilderOptions,
  AmountUnit,
} from '@lay2/pw-core'

import { IBridgeTokenHandler } from '../types'

interface Bridge {
  init(): Promise<Bridge>
  deposit(
    amount: BigNumber,
    accountAddress: string,
    tokenAddress: string,
  ): Promise<string>
  getBalance(accountAddress: string, tokenAddress?: string): Promise<BigNumber>
}

interface L1L2BridgeConfig {
  ckbUrl: string
  indexerUrl: string
}

export class L1L2Bridge implements Bridge {
  private _web3Provider: Web3
  private _pwCore: PWCore
  private _web3CKBProvider: Provider
  private _indexerCollector: IndexerCollector
  private _addressTranslator: AddressTranslator

  constructor(web3Provider: Web3, config: L1L2BridgeConfig) {
    this._web3Provider = web3Provider

    const web3CKBProvider = new Web3ModalProvider(web3Provider)
    this._web3CKBProvider = web3CKBProvider

    const indexerCollector = new IndexerCollector(config.indexerUrl)
    this._indexerCollector = indexerCollector

    const pwCore = new PWCore(config.ckbUrl)
    this._pwCore = pwCore

    const addressTranslator = new AddressTranslator()
    this._addressTranslator = addressTranslator
  }

  async init(): Promise<Bridge> {
    await this._pwCore.init(this._web3CKBProvider, this._indexerCollector)

    return this as Bridge
  }

  async _getBalance(ethereumAccountAddress: string): Promise<BigNumber> {
    const ckbAddressString = await this._addressTranslator.ethAddressToCkbAddress(
      ethereumAccountAddress,
      true,
    )

    const ckbAddress = new Address(ckbAddressString, AddressType.ckb)

    const balance = await this._indexerCollector.getBalance(ckbAddress)

    const balanceString: string = balance.toBigInt().toString()

    console.log('balance string', balanceString)
    return BigNumber.from(balanceString)
  }

  async _getBalanceSUDT(
    ethereumAccountAddress: string,
    sudtIssuerLockHash: string,
  ): Promise<BigNumber> {
    const sudt = new SUDT(sudtIssuerLockHash)
    const ckbAddressString = await this._addressTranslator.ethAddressToCkbAddress(
      ethereumAccountAddress,
      true,
    )

    const ckbAddress = new Address(ckbAddressString, AddressType.ckb)

    const balance = await this._indexerCollector.getSUDTBalance(
      sudt,
      ckbAddress,
    )
    const balanceString: string = balance.toBigInt().toString()

    return BigNumber.from(balanceString)
  }

  async getBalance(
    ethereumAccountAddress: string,
    sudtIssuerLockHash: string,
  ): Promise<BigNumber> {
    if (sudtIssuerLockHash) {
      return this._getBalanceSUDT(ethereumAccountAddress, sudtIssuerLockHash)
    }

    return this._getBalance(ethereumAccountAddress)
  }

  async deposit(
    amount: BigNumber,
    ethereumAccountAddress: string,
    sudtIssuerLockHash: string,
  ): Promise<string> {
    console.log(ethereumAccountAddress, sudtIssuerLockHash)
    const layer2depositAddress = await this._addressTranslator.getLayer2DepositAddress(
      this._web3CKBProvider,
      ethereumAccountAddress,
    )

    const sudt = new SUDT(sudtIssuerLockHash)
    const sudtAmount = new Amount(
      amount
        .div(BigNumber.from(10).pow(sudt.info?.decimals ?? AmountUnit.ckb))
        .toString(),
      sudt.info?.decimals,
    )

    console.log('amount big number', sudtAmount.toString())
    console.log('amount pw core', sudtAmount.toString())
    console.log('amount big int pw core', sudtAmount.toBigInt().toString())

    const options: SimpleSUDTBuilderOptions = {
      feeRate: 2000,
      autoCalculateCapacity: true,
      minimumOutputCellCapacity: new Amount('400', AmountUnit.ckb),
    }

    const layer1TxHash = await this._pwCore.sendSUDT(
      sudt,
      layer2depositAddress,
      sudtAmount,
      true,
      undefined,
      options,
    )
    return layer1TxHash
  }
}

export const bridgeToken: IBridgeTokenHandler = async (
  amount,
  tokenAddress,
  ethereumAddress,
  provider,
  network,
  config,
) => {
  try {
    const numberAmount = Number(amount.split('.')[0])
    console.log('L1 -> L2 bridge')
    console.log('L1 -> L2 bridge::token address', tokenAddress)
    console.log('L1 -> L2 bridge::amount', numberAmount)

    const web3provider = new Web3(Web3.givenProvider)
    const bridge = await new L1L2Bridge(web3provider, {
      ckbUrl: 'https://testnet.ckb.dev',
      indexerUrl: 'https://testnet.ckb.dev/indexer',
    }).init()

    let balanceCKB = await bridge.getBalance(ethereumAddress)
    console.log('balance ckb', balanceCKB.toString())
    let balanceSUDT = await bridge.getBalance(ethereumAddress, tokenAddress)
    console.log('balance sudt', balanceSUDT.toString())

    await bridge.deposit(
      BigNumber.from(numberAmount).mul(BigNumber.from(10).pow(8)),
      ethereumAddress,
      tokenAddress,
    )

    balanceCKB = await bridge.getBalance(ethereumAddress)
    console.log('balance ckb', balanceCKB.toString())
    balanceSUDT = await bridge.getBalance(ethereumAddress, tokenAddress)
    console.log('balance sudt', balanceSUDT.toString())

    // const addressTranslator = new AddressTranslator(config?.addressTranslator)
    // const layer2depositAddress = await addressTranslator.getLayer2DepositAddress(
    //   web3provider,
    //   ethereumAddress,
    // )
    // const web3ModalProvider = new Web3ModalProvider(web3provider)

    // const collector = new IndexerCollector(this._config.INDEXER_URL)
    // const pwCore = await new PWCore(this._config.CKB_URL).init(
    //   web3ModalProvider,
    //   collector,
    // )

    // const tx = await addressTranslator.transferFromLayer1ToLayer2(
    //   web3,
    //   ethereumAddress,
    //   tokenAddress,
    //   amount,
    // )
    console.log('tx')
  } catch (error) {
    console.error(error)
  }
}
