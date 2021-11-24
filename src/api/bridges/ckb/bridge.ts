import { AddressTranslator } from 'nervos-godwoken-integration'
import Web3 from 'web3'

import { CanonicalTokenSymbol, TokensRegistry } from '@api/types'
import { BigNumber } from '@ethersproject/bignumber'
import {
  IBridge,
  BridgedPair,
  BridgedToken,
  IBridgeDescriptor,
  Token,
} from '@interfaces/data'
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
import { Networks } from '@utils/constants'

import { INetworkAdapter } from '../../network/types'

/**
 * TODO: Change
 */
import { registry } from '../../registry/ckbRegistry'

interface CkbBridgeConfig {
  ckbUrl: string
  indexerUrl: string
}

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

  private _bridgePairRegistry: {
    [key in CanonicalTokenSymbol]?: BridgedPair
  } = {}

  constructor(
    id: string,
    name: string,
    fromNetwork: INetworkAdapter,
    toNetwork: INetworkAdapter,
    web3: Web3,
    config: CkbBridgeConfig,
  ) {
    this.id = id
    this.name = name

    this.fromNetwork = fromNetwork
    this.toNetwork = toNetwork

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
    Object.keys(godwokenTokensRegistry.tokens).forEach(
      (cTokenSymbol: CanonicalTokenSymbol) => {
        const bridgedNetwork = godwokenTokensRegistry.network
        const registeredToken = godwokenTokensRegistry.tokens[cTokenSymbol]
        this._registerToken(
          cTokenSymbol,
          registeredToken.address,
          bridgedNetwork,
        )
      },
    )

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
      feeRate: 1000,
      // autoCalculateCapacity: true,
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
    const depositAmount = new Amount(
      amount.toString(),
      token.decimals ?? AmountUnit.ckb,
    )
    // TODO: Did user address should be in scope of bridge instance???
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
  
  async signMessageEthereum(message: Hash, address: string): Promise<HexString> {
    const result = await (window.ethereum as any).request({ method: 'eth_sign',
      params: [address, message]
    })
  
    let v = Number.parseInt(result.slice(-2), 16);
    
    if (v >= 27)
      v -= 27;
  
    return `0x${result.slice(2, -2)}${v.toString(16).padStart(2, '0')}`;
  }

  async withdraw(amount: BigNumber, token: Token): Promise<string> {
    const [accountAddress] = await this._web3.eth.getAccounts()

    const sudtIssuerLockHash = token.address
    const sudt = new SUDT(sudtIssuerLockHash)

    export async function signMessageEthereum(message: Hash, address: string): Promise<HexString> {
  const result = await (window.ethereum as any).request({ method: 'eth_sign',
    params: [address, message]
  })

  let v = Number.parseInt(result.slice(-2), 16);
  
  if (v >= 27)
    v -= 27;

  return `0x${result.slice(2, -2)}${v.toString(16).padStart(2, '0')}`;
}
    console.log('[bridge][ckb][withdraw] props', amount, sudtIssuerLockHash)
    console.log('[bridge][ckb][withdraw] address', accountAddress)
    console.log('[bridge][ckb][withdraw] NOT IMPLEMENTED')

    return 'withdraw'
  }

  async getTokens(): Promise<BridgedToken[]> {
    const bridgedPairs = this.getBridgedPairs()

    return bridgedPairs.map(
      (bridgedPair) =>
        ({
          address: bridgedPair.shadow.address,
          decimals: bridgedPair.decimals,
          id: bridgedPair.shadow.address,
          name: bridgedPair.name,
          symbol: bridgedPair.name,
          network: Networks.NervosL2,
          shadow: {
            address: bridgedPair.shadow.address,
            network: Networks.NervosL1,
          },
        } as BridgedToken),
    )
  }

  async getShadowTokens(): Promise<BridgedToken[]> {
    const bridgedPairs = this.getBridgedPairs()

    return bridgedPairs.map(
      (bridgedPair) =>
        ({
          address: bridgedPair.address,
          decimals: bridgedPair.decimals,
          id: bridgedPair.address,
          name: bridgedPair.name,
          symbol: bridgedPair.name,
          network: Networks.NervosL2,
          shadow: {
            address: bridgedPair.address,
            network: Networks.NervosL1,
          },
        } as BridgedToken),
    )
  }

  // TODO REFACTOR
  _registerToken(
    registeredToken: CanonicalTokenSymbol,
    tokenAddressGodwoken: string,
    bridgedNetwork: Networks,
  ): void {
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

      return
    }

    throw Error(
      `${registeredToken} doesn't registered in CKB - Godwoken Bridge`,
    )
  }

  getBridgedPairs(): BridgedPair[] {
    return Object.values(this._bridgePairRegistry)
  }

  getBridgedPairByCanonSymbol(
    canonSymbol: CanonicalTokenSymbol,
  ): BridgedPair | undefined {
    return this._bridgePairRegistry[canonSymbol]
  }

  getBridgedPairByAddress(
    address: string,
    network: Networks,
  ): BridgedPair | undefined {
    const anyRegisteredPair = this._bridgePairRegistry[
      Object.keys(this._bridgePairRegistry)[0] as CanonicalTokenSymbol
    ]
    const baseNetwork = anyRegisteredPair.network
    const shadowNetwork = anyRegisteredPair.shadow.network

    if (network === baseNetwork) {
      const bridgedPair = Object.values(this._bridgePairRegistry).find(
        ({ address: baseAddress }) => baseAddress === address,
      )
      return bridgedPair
    } else if (network === shadowNetwork) {
      const bridgedPair = Object.values(this._bridgePairRegistry).find(
        ({ shadow: { address: shadowAddress } }) => shadowAddress === address,
      )
      return bridgedPair
    }

    throw new Error(`Network ${network} is not correct`)
  }
}
