import { AddressTranslator } from 'nervos-godwoken-integration'
import Web3 from 'web3'

import { BigNumber } from '@ethersproject/bignumber'
import { IBridge, BridgedPair } from '@interfaces/data'
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

import { CanonicalTokenSymbol, TokensRegistry } from '@api/types'
import { registry } from './registry'
import { Networks } from '@utils/constants'
interface CkbBridgeConfig {
  ckbUrl: string
  indexerUrl: string
}

const ZERO_LOCK_HASH =
  '0x0000000000000000000000000000000000000000000000000000000000000000'
const IS_TESTNET = true

export class CkbBridge implements IBridge {
  private _web3: Web3
  private _pwCore: PWCore
  private _web3CKBProvider: Provider
  private _indexerCollector: IndexerCollector
  private _addressTranslator: AddressTranslator

  private _bridgePairRegistry: { [key in CanonicalTokenSymbol]?: BridgedPair } = {}

  constructor(web3: Web3, config: CkbBridgeConfig) {
    this._web3 = web3

    const web3CKBProvider = new Web3ModalProvider(web3)
    this._web3CKBProvider = web3CKBProvider

    const indexerCollector = new IndexerCollector(config.indexerUrl)
    this._indexerCollector = indexerCollector

    const pwCore = new PWCore(config.ckbUrl)
    this._pwCore = pwCore

    const addressTranslator = new AddressTranslator()
    this._addressTranslator = addressTranslator
  }

  async init(godwokenTokensRegistry: TokensRegistry): Promise<CkbBridge> {
    Object.keys(godwokenTokensRegistry.tokens).forEach((cTokenSymbol: CanonicalTokenSymbol) => {
      const bridgedNetwork = godwokenTokensRegistry.network
      const registeredToken = godwokenTokensRegistry.tokens[cTokenSymbol]
      this._registerToken(cTokenSymbol, registeredToken.address, bridgedNetwork)
    })

    await this._pwCore.init(this._web3CKBProvider, this._indexerCollector)

    return this
  }

  // TODO REFACTOR
  _registerToken(
    registeredToken: CanonicalTokenSymbol,
    tokenAddressGodwoken: string,
    bridgedNetwork: Networks,
  ) {
    if (Object.keys(registry.tokens).includes(registeredToken)) {
      const tokenShadow = registry.tokens[registeredToken]
      this._bridgePairRegistry[registeredToken] = {
        address: tokenAddressGodwoken,
        name: tokenShadow.name,
        symbol: tokenShadow.name,
        decimals: tokenShadow.decimals,
        network: bridgedNetwork,
        shadow: {
          address: tokenShadow.address,
          network: registry.network,
        },
      }

      return this
    }

    throw Error(`${registeredToken} doesn't registered in CKB - Godwoken Bridge`)
  }

  getBridgedPairs(): BridgedPair[] {
    return Object.values(this._bridgePairRegistry)
  }et
  getBridgedPairByCanonSymbol(canonSymbol: CanonicalTokenSymbol): BridgedPair | undefined {
    return this._bridgePairRegistry[canonSymbol]
  }

  getBridgedPairByAddress(address: string, network: Networks): BridgedPair | undefined {
    const anyRegisteredPair = this._bridgePairRegistry[
      Object.keys(this._bridgePairRegistry)[0] as CanonicalTokenSymbol
    ]
    const baseNetwork = anyRegisteredPair.network
    const shadowNetwork = anyRegisteredPair.shadow.network

    if (network === baseNetwork) {
      const bridgedPair = Object.values(this._bridgePairRegistry).find(
        ({ address: baseAddress }) => baseAddress === address
      )
      return bridgedPair
    } else if (network === shadowNetwork) {
      const bridgedPair = Object.values(this._bridgePairRegistry).find(
        ({ shadow: { address: shadowAddress } }) => shadowAddress === address
      )
      return bridgedPair
    }

    throw new Error(`Network ${network} is not correct`)
  }
  // END TODO REFACTOR

  _isNativeBridgePair(bridgedPair: BridgedPair): boolean {
    return bridgedPair.shadow.address === ZERO_LOCK_HASH
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
    bridgedPair: BridgedPair,
  ): Promise<BigNumber> {
    const ckbAddressString = this._addressTranslator.ethAddressToCkbAddress(
      ethereumAccountAddress,
      IS_TESTNET,
    )
    const ckbAddress = new Address(ckbAddressString, AddressType.ckb)

    const { address: sudtIssuerLockHash } = bridgedPair.shadow

    console.log('[bridge] get balance', bridgedPair)
    if (!this._isNativeBridgePair(bridgedPair)) {
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
    bridgedPair: BridgedPair,
  ): Promise<string> {
    const [ethereumAccountAddress] = await this._web3.eth.getAccounts()
    const { address: sudtIssuerLockHash } = bridgedPair.shadow

    console.log('[bridge][l1-l2] sudt issuer lock hash', sudtIssuerLockHash)

    const layer2depositAddress = await this._addressTranslator.getLayer2DepositAddress(
      this._web3CKBProvider,
      ethereumAccountAddress,
    )

    if (!this._isNativeBridgePair(bridgedPair)) {
      return this._depositSUDT(amount, layer2depositAddress, sudtIssuerLockHash)
    }

    return this._depositNative(amount, layer2depositAddress)
  }

  async withdraw(
    amount: BigNumber,
    bridgedPair: BridgedPair,
  ): Promise<string> {
    const [ethereumAccountAddress] = await this._web3.eth.getAccounts()
    const { address: sudtIssuerLockHash } = bridgedPair.shadow
    console.log('amount', amount)
    console.log('address', ethereumAccountAddress)
    console.log('sudt issuer lock hash', sudtIssuerLockHash)
    return 'withdraw'
  }
}
