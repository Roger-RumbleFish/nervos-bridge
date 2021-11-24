import { providers } from 'ethers'
import {
  AddressTranslator,
  BridgeRPCHandler as ForceBridgeRPCHandler,
  GenerateBridgeInTransactionPayload,
  GenerateBridgeOutNervosTransactionPayload, //   GetConfigResponse,
} from 'nervos-godwoken-integration'
import Web3 from 'web3'

import {
  CanonicalTokenSymbol,
  TokenDescriptor,
  TokensRegistry,
} from '@api/types'
import { BigNumber } from '@ethersproject/bignumber'
import {
  IBridge,
  BridgedToken,
  NetworkName,
  IBridgeDescriptor,
  Token,
} from '@interfaces/data'
import { Networks } from '@utils/constants'

import { ERC20__factory } from '../../../factories/ERC20__factory'
import { INetworkAdapter } from '../../network/types'
import { mapForceBridgeNetwork } from './utils'

interface EthereumBridgeConfig {
  forceBridgeUrl: string
}

export class EthereumForceBridge implements IBridge {
  public id: string
  public name: string
  public networks: [NetworkName, NetworkName]

  public depositNetwork: INetworkAdapter
  public withdrawalNetwork: INetworkAdapter

  private _web3: Web3
  private _jsonRpcProvider: providers.JsonRpcProvider
  private _forceBridgeClient: ForceBridgeRPCHandler
  private _forceBridgeAddress: string
  private _addressTranslator: AddressTranslator

  private godwokenTokensRegistry: TokensRegistry

  constructor(
    id: string,
    name: string,
    depositNetwork: INetworkAdapter,
    withdrawalNetwork: INetworkAdapter,
    web3: Web3,
    provider: providers.JsonRpcProvider,
    config: EthereumBridgeConfig,
  ) {
    this.id = id
    this.name = name

    this.depositNetwork = depositNetwork
    this.withdrawalNetwork = withdrawalNetwork
    this.networks = [depositNetwork.name, withdrawalNetwork.name]

    this._web3 = web3

    this._jsonRpcProvider = provider

    const forceBridgeClient = new ForceBridgeRPCHandler(config.forceBridgeUrl)
    this._forceBridgeClient = forceBridgeClient

    const addressTranslator = new AddressTranslator()
    this._addressTranslator = addressTranslator
  }

  async init(godwokenTokensRegistry: TokensRegistry): Promise<IBridge> {
    console.log(godwokenTokensRegistry)
    this.godwokenTokensRegistry = godwokenTokensRegistry
    const bridgeConfig = await this._forceBridgeClient.getBridgeConfig()
    this._forceBridgeAddress = bridgeConfig.xchains.Ethereum.contractAddress

    return this as IBridge
  }

  toDescriptor(): IBridgeDescriptor {
    return {
      id: this.id,
      name: this.name,
      networks: this.networks,
    }
  }

  getDepositNetwork(): INetworkAdapter {
    return this.depositNetwork
  }

  getWithdrawalNetwork(): INetworkAdapter {
    return this.withdrawalNetwork
  }

  async deposit(amount: BigNumber, token: Token): Promise<string> {
    const signer = this._jsonRpcProvider.getSigner()
    const ethereumAccountAddress = await signer.getAddress()

    const tokenAddress = token.address
    const erc20Contract = ERC20__factory.connect(tokenAddress, signer)

    const allowedAmount = await erc20Contract.allowance(
      ethereumAccountAddress,
      this._forceBridgeAddress,
    )

    if (!allowedAmount.gte(amount)) {
      const tx = await erc20Contract.approve(this._forceBridgeAddress, amount)

      await tx.wait()
    }

    const depositAddress = await this._addressTranslator.getLayer2DepositAddress(
      this._web3,
      ethereumAccountAddress,
    )

    const ckbAddress = await this._addressTranslator.ethAddressToCkbAddress(
      ethereumAccountAddress,
    )
    console.log(
      '[bridge][ethereum][deposit] ethereum address',
      ethereumAccountAddress,
    )
    console.log(
      '[bridge][ethereum][deposit] deposit lock address',
      depositAddress.addressString,
    )
    console.log('[bridge][ethereum][deposit] ckb address', ckbAddress)

    const payload: GenerateBridgeInTransactionPayload = {
      asset: {
        network: Networks.Ethereum,
        ident: tokenAddress,
        amount: amount.toString(),
      },
      recipient: depositAddress.addressString,
      sender: ethereumAccountAddress,
    }
    const result = await this._forceBridgeClient.generateBridgeInNervosTransaction(
      payload,
    )

    const transaction = await signer.sendTransaction(result.rawTransaction)

    return transaction.hash
  }

  async withdraw(amount: BigNumber, token: Token): Promise<string> {
    const signer = this._jsonRpcProvider.getSigner()
    const ethereumAccountAddress = await signer.getAddress()
    const tokenAddress = token.address

    const depositAddress = await this._addressTranslator.getLayer2DepositAddress(
      this._web3,
      ethereumAccountAddress,
    )

    const payload: GenerateBridgeOutNervosTransactionPayload = {
      network: 'Ethereum',
      asset: tokenAddress,
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
      (token) => token.network === Networks.Ethereum,
    )

    console.log('[bridge][ethereum] tokens', tokens)
    console.log('[bridge][ethereum] tokens ethereum', ethTokens)

    return ethTokens.map((token) => ({
      id: token.ident,
      address: token.ident,
      name: token.info.symbol,
      symbol: token.info.symbol,
      decimals: token.info.decimals,
      network: mapForceBridgeNetwork(token.info.shadow.network),
      shadow: {
        address: token.ident,
        network: mapForceBridgeNetwork(token.network),
      },
    }))
  }

  async getShadowTokens(): Promise<BridgedToken[]> {
    const tokens = await this._forceBridgeClient.getAssetList()
    const godwokenTokens = this.godwokenTokensRegistry.tokens

    const ethTokens = tokens.filter(
      (token) => token.network === Networks.Ethereum,
    )

    const shadowTokens = Object.keys(godwokenTokens)
      .map((tokenSymbol) => tokenSymbol as CanonicalTokenSymbol)
      .filter((tokenSymbol) =>
        ethTokens.map((ethToken) => ethToken.info.symbol).includes(tokenSymbol),
      )
      .map((tokenSymbol) => {
        const token: TokenDescriptor = godwokenTokens[tokenSymbol]

        const shadowToken = ethTokens.find(
          (shadowToken) => shadowToken.info.symbol === tokenSymbol,
        )

        return {
          id: token.address,
          address: token.address,
          name: token.name,
          symbol: token.name,
          decimals: token.decimals,
          network: this.depositNetwork.name as Networks,
          shadow: {
            address: shadowToken.ident,
            network: this.withdrawalNetwork.name as Networks,
          },
        }
      })

    console.log('[bridge][ethereum] shadow tokens', shadowTokens)

    return shadowTokens
  }
}
