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
  BuilderOption,
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
  withdraw(
    amount: BigNumber,
    accountAddress: string,
    tokenAddress: string,
  ): Promise<string>
  getBalance(accountAddress: string, tokenAddress?: string): Promise<BigNumber>
}

interface L1L2BridgeConfig {
  ckbUrl: string
  indexerUrl: string
  godwokenUrl: string
}

const IS_TESTNET = true

export class L1L2Bridge implements Bridge {
  private _web3Provider: Web3
  private _pwCore: PWCore
  private _web3CKBProvider: Provider
  private _indexerCollector: IndexerCollector
  private _addressTranslator: AddressTranslator
  private _godwoken: Godwoken

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

    const godwoken = new Godwoken(config.godwokenUrl)
  }

  async init(): Promise<Bridge> {
    await this._pwCore.init(this._web3CKBProvider, this._indexerCollector)

    return this as Bridge
  }

  async _getBalanceNative(ckbAddress: Address): Promise<BigNumber> {
    const balance = await this._indexerCollector.getBalance(ckbAddress)

    const balanceString: string = balance.toBigInt().toString()

    console.log('balance string', balanceString)
    return BigNumber.from(balanceString)
  }

  async _getBalanceSUDT(
    ckbAddress: Address,
    sudtIssuerLockHash: string,
  ): Promise<BigNumber> {
    const sudt = new SUDT(sudtIssuerLockHash)

    const balance = await this._indexerCollector.getSUDTBalance(
      sudt,
      ckbAddress,
    )
    const balanceString: string = balance.toBigInt().toString()

    return BigNumber.from(balanceString)
  }

  async getBalance(
    ethereumAccountAddress: string,
    sudtIssuerLockHash?: string,
  ): Promise<BigNumber> {
    const ckbAddressString = this._addressTranslator.ethAddressToCkbAddress(
      ethereumAccountAddress,
      IS_TESTNET,
    )
    const ckbAddress = new Address(ckbAddressString, AddressType.ckb)

    if (sudtIssuerLockHash) {
      return this._getBalanceSUDT(ckbAddress, sudtIssuerLockHash)
    }

    return this._getBalanceNative(ckbAddress)
  }

  async _depositNative(
    amount: BigNumber,
    depositAdress: Address,
  ): Promise<string> {
    const ckbAmount = new Amount(
      amount.div(BigNumber.from(10).pow(AmountUnit.ckb)).toString(),
      AmountUnit.ckb,
    )

    const options: BuilderOption = {
      feeRate: 2000,
    }

    const depositNativeTx = await this._pwCore.send(
      depositAdress,
      ckbAmount,
      options,
    )
    return depositNativeTx
  }

  async _depositSUDT(
    amount: BigNumber,
    depositAdress: Address,
    sudtIssuerLockHash: string,
  ): Promise<string> {
    const sudt = new SUDT(sudtIssuerLockHash)
    const sudtAmount = new Amount(
      amount
        .div(BigNumber.from(10).pow(sudt.info?.decimals ?? AmountUnit.ckb))
        .toString(),
      sudt.info?.decimals,
    )

    const options: SimpleSUDTBuilderOptions = {
      feeRate: 2000,
      autoCalculateCapacity: true,
      minimumOutputCellCapacity: new Amount('400', AmountUnit.ckb),
    }

    const depositSUDTTxHash = await this._pwCore.sendSUDT(
      sudt,
      depositAdress,
      sudtAmount,
      true,
      undefined,
      options,
    )
    return depositSUDTTxHash
  }

  async deposit(
    amount: BigNumber,
    ethereumAccountAddress: string,
    sudtIssuerLockHash: string,
  ): Promise<string> {
    const layer2depositAddress = await this._addressTranslator.getLayer2DepositAddress(
      this._web3CKBProvider,
      ethereumAccountAddress,
    )

    if (
      sudtIssuerLockHash &&
      sudtIssuerLockHash !==
        '0x0000000000000000000000000000000000000000000000000000000000000000'
    ) {
      return this._depositSUDT(amount, layer2depositAddress, sudtIssuerLockHash)
    }

    return this._depositNative(amount, layer2depositAddress)
  }

  async _withdrawNative(
    amount: BigNumber,
    ethereumAccountAddress: string,
  ): Promise<string> {

  }

  async withdraw(
    amount: BigNumber,
    ethereumAccountAddress: string,
    sudtIssuerLockHash: string,
  ): Promise<string> {
    console.log('amount', amount)
    console.log('address', ethereumAccountAddress)
    console.log('sudt issuer lock hash', sudtIssuerLockHash)
    return 'withdraw'
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
      godwokenUrl: 'https://godwoken-testnet-web3-rpc.ckbapp.dev',
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

    console.log('tx')
  } catch (error) {
    console.error(error)
  }
}
