import { providers } from 'ethers'
import {
  AddressTranslator,
  BridgeRPCHandler as ForceBridgeRPCHandler,
  GenerateBridgeOutNervosTransactionPayload, //   GetConfigResponse,
} from 'nervos-godwoken-integration'
import Web3 from 'web3'

import { BigNumber } from '@ethersproject/bignumber'
import { IBridge, BridgedPair, BridgedToken } from '@interfaces/data'
import { Networks } from '@utils/constants'

import { ERC20__factory } from '../../../factories/ERC20__factory'
import { mapForceBridgeNetwork } from './utils'

interface EthereumBridgeConfig {
  forceBridgeUrl: string
}

const ETHEREUM_ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const BRIDGE_ID = 'ethereum'
export class EthereumForceBridge implements IBridge {
  public id: string
  private _web3: Web3
  private _jsonRpcProvider: providers.JsonRpcProvider
  private _forceBridgeClient: ForceBridgeRPCHandler
  private _forceBridgeAddress: string
  private _addressTranslator: AddressTranslator

  constructor(
    web3: Web3,
    provider: providers.JsonRpcProvider,
    config: EthereumBridgeConfig,
  ) {
    this.id = BRIDGE_ID

    this._web3 = web3

    this._jsonRpcProvider = provider

    const forceBridgeClient = new ForceBridgeRPCHandler(config.forceBridgeUrl)
    this._forceBridgeClient = forceBridgeClient

    const addressTranslator = new AddressTranslator()
    this._addressTranslator = addressTranslator
  }

  async init(): Promise<IBridge> {
    const bridgeConfig = await this._forceBridgeClient.getBridgeConfig()
    this._forceBridgeAddress = bridgeConfig.xchains.Ethereum.contractAddress

    return this as IBridge
  }

  _isNativeBridgePair(bridgedPair: BridgedPair): boolean {
    return bridgedPair.shadow.address === ETHEREUM_ZERO_ADDRESS
  }

  async _getBalanceNative(ethereumAddress: string): Promise<BigNumber> {
    console.log('[bridge][eth][rpc] json rpc provider', this._jsonRpcProvider)
    const balance = await this._jsonRpcProvider.getBalance(ethereumAddress)

    const balanceString: string = balance.toBigInt().toString()

    console.log('balance string', balanceString)
    return BigNumber.from(balanceString)
  }

  async _getBalanceERC20(
    ethereumAccountAddress: string,
    bridgedPair: BridgedPair,
  ): Promise<BigNumber> {
    const {
      shadow: { address: erc20Address },
    } = bridgedPair

    const signer = this._jsonRpcProvider.getSigner()

    const erc20Contract = ERC20__factory.connect(erc20Address, signer)

    const balance = await erc20Contract.balanceOf(ethereumAccountAddress)

    return balance
  }

  async getBalance(
    ethereumAccountAddress: string,
    bridgedPair: BridgedPair,
  ): Promise<BigNumber> {
    if (!this._isNativeBridgePair(bridgedPair)) {
      return this._getBalanceERC20(ethereumAccountAddress, bridgedPair)
    }

    return this._getBalanceNative(ethereumAccountAddress)
  }

  // TODO: Implement deposit in native currency ETH?
  async _depositNative(amount: BigNumber): Promise<string> {
    const signer = this._jsonRpcProvider.getSigner()

    console.log('deposit native signer', signer, amount.toString())
    return 'no tx for now'
  }

  async _depositERC20(
    amount: BigNumber,
    bridgePair: BridgedPair,
  ): Promise<string> {
    const {
      shadow: { address: erc20Address },
    } = bridgePair

    const signer = this._jsonRpcProvider.getSigner()
    const ethereumAccountAddress = signer._address

    const erc20Contract = ERC20__factory.connect(erc20Address, signer)

    const allowedAmount = await erc20Contract.allowance(
      ethereumAccountAddress,
      this._forceBridgeAddress,
    )

    if (!allowedAmount.gte(amount)) {
      const tx = await erc20Contract.approve(this._forceBridgeAddress, amount)

      await tx.wait()
    }

    const recipient = await this._addressTranslator.getLayer2DepositAddress(
      this._web3,
      ethereumAccountAddress,
    )

    const payload = {
      asset: {
        network: 'Nervos',
        ident: erc20Address,
        amount: amount.toString(),
      },
      recipient: recipient.addressString,
      sender: ethereumAccountAddress,
    }
    const result = await this._forceBridgeClient.generateBridgeInNervosTransaction(
      payload,
    )

    const transaction = await signer.sendTransaction(result.rawTransaction)

    return transaction.hash
  }

  async deposit(amount: BigNumber, bridgedPair: BridgedPair): Promise<string> {
    if (!this._isNativeBridgePair(bridgedPair)) {
      return this._depositERC20(amount, bridgedPair)
    }

    return this._depositNative(amount)
  }

  async withdraw(amount: BigNumber, bridgedPair: BridgedPair): Promise<string> {
    const { address: ethereumErc20Address } = bridgedPair.shadow
    console.log('[withdraw][token pair]', bridgedPair)

    const signer = this._jsonRpcProvider.getSigner()
    const ethereumAccountAddress = signer._address

    const depositAddress = await this._addressTranslator.getLayer2DepositAddress(
      this._web3,
      ethereumAccountAddress,
    )
    const payload: GenerateBridgeOutNervosTransactionPayload = {
      network: 'Ethereum',
      asset: ethereumErc20Address,
      recipient: ethereumAccountAddress,
      sender: depositAddress.addressString,
      amount: amount.toString(),
    }

    const result = await this._forceBridgeClient.generateBridgeOutNervosTransaction(
      payload,
    )

    const transaction = await signer.sendTransaction(result.rawTransaction)

    return transaction.hash
  }

  async getTokens(): Promise<BridgedToken[]> {
    const tokens = await this._forceBridgeClient.getAssetList()
    const ethTokens = tokens.filter(
      (token) => token.info.shadow.network === Networks.Ethereum,
    )

    return ethTokens.map((token) => ({
      id: token.ident,
      address: token.ident,
      name: token.info.symbol,
      decimals: token.info.decimals,
      symbol: token.info.symbol,
      network: mapForceBridgeNetwork(token.network),
      shadow: {
        address: token.info.shadow.ident,
        network: mapForceBridgeNetwork(token.info.shadow.network),
      },
    }))
  }
}
