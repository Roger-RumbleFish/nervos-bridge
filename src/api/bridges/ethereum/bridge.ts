import { providers } from 'ethers'
import {
  BridgeRPCHandler as ForceBridgeRPCHandler,
  GenerateBridgeInTransactionPayload,
  GenerateBridgeOutNervosTransactionPayload,
} from 'nervos-godwoken-integration'

import { BigNumber } from '@ethersproject/bignumber'
import {
  IGodwokenBridge,
  IBridgeDescriptor,
  Token,
  BridgeFeature,
  Bridge,
  Network,
} from '@interfaces/data'

import { ERC20__factory } from '../../../contracts/ERC20__factory'
import { IGodwokenAdapter, INetworkAdapter } from '../../network/types'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export class ForceBridge implements IGodwokenBridge<providers.JsonRpcProvider> {
  private _id: Bridge
  public get id(): Bridge {
    return this._id
  }

  private _name: string
  public get name(): string {
    return this._name
  }

  public features = {
    [BridgeFeature.Deposit]: true,
    [BridgeFeature.Withdraw]: false,
  }

  public depositNetwork: INetworkAdapter<providers.JsonRpcProvider>
  public withdrawalNetwork: IGodwokenAdapter

  private _jsonRpcProvider: providers.JsonRpcProvider
  private forceBridgeClient: ForceBridgeRPCHandler
  private _forceBridgeAddress: string

  constructor({
    id,
    name,
    url,
    godwokenNetwork,
    bridgeNetwork,
  }: {
    id: Bridge
    name: string
    url: string
    bridgeNetwork: INetworkAdapter<providers.JsonRpcProvider>
    godwokenNetwork: IGodwokenAdapter
  }) {
    this._id = id
    this._name = name

    this.depositNetwork = bridgeNetwork
    this.withdrawalNetwork = godwokenNetwork

    const forceBridgeClient = new ForceBridgeRPCHandler(url)
    this.forceBridgeClient = forceBridgeClient

    this.init = this.init.bind(this)
    this.toDescriptor = this.toDescriptor.bind(this)
    this.getDepositNetwork = this.getDepositNetwork.bind(this)
    this.deposit = this.deposit.bind(this)
    this.withdraw = this.withdraw.bind(this)
  }

  async init(
    depositProvider: providers.JsonRpcProvider,
    withdrawalProvider: providers.JsonRpcProvider,
  ): Promise<IGodwokenBridge<providers.JsonRpcProvider>> {
    this.depositNetwork.init(depositProvider)
    this.withdrawalNetwork.init(withdrawalProvider)

    const bridgeConfig = await this.forceBridgeClient.getBridgeConfig()
    this._forceBridgeAddress = bridgeConfig.xchains.Ethereum.contractAddress
    this._jsonRpcProvider = depositProvider

    return this
  }

  toDescriptor(): IBridgeDescriptor {
    return {
      id: this.id,
      name: this.name,
      networks: [this.depositNetwork.name, this.withdrawalNetwork.name],
    }
  }

  getDepositNetwork(): INetworkAdapter<providers.JsonRpcProvider> {
    return this.depositNetwork
  }

  getWithdrawalNetwork(): IGodwokenAdapter {
    return this.withdrawalNetwork
  }

  async _depositNative(amount: BigNumber, token: Token): Promise<string> {
    const signer = this._jsonRpcProvider.getSigner()
    const ethereumAddress = await signer.getAddress()

    const depositAddress = await this.withdrawalNetwork.getDepositAddress(
      ethereumAddress,
    )

    const payload: GenerateBridgeInTransactionPayload = {
      asset: {
        network: Network.Ethereum,
        ident: token.address,
        amount: amount.toString(),
      },
      recipient: depositAddress,
      sender: ethereumAddress,
    }

    const result = await this.forceBridgeClient.generateBridgeInNervosTransaction(
      payload,
    )

    const transaction = await signer.sendTransaction(result.rawTransaction)

    return transaction.hash
  }

  async _depositERC20(amount: BigNumber, token: Token): Promise<string> {
    const signer = this._jsonRpcProvider.getSigner()
    const ethereumAddress = await signer.getAddress()

    const depositAddress = await this.withdrawalNetwork.getDepositAddress(
      ethereumAddress,
    )

    const tokenAddress = token.address
    const erc20Contract = ERC20__factory.connect(tokenAddress, signer)

    const allowedAmount = await erc20Contract.allowance(
      ethereumAddress,
      this._forceBridgeAddress,
    )

    if (!allowedAmount.gte(amount)) {
      const tx = await erc20Contract.approve(this._forceBridgeAddress, amount)

      await tx.wait()
    }

    const payload: GenerateBridgeInTransactionPayload = {
      asset: {
        network: Network.Ethereum,
        ident: tokenAddress,
        amount: amount.toString(),
      },
      recipient: depositAddress,
      sender: ethereumAddress,
    }
    const result = await this.forceBridgeClient.generateBridgeInNervosTransaction(
      payload,
    )

    const transaction = await signer.sendTransaction(result.rawTransaction)

    return transaction.hash
  }

  async deposit(amount: BigNumber, token: Token): Promise<string> {
    if (this.features[BridgeFeature.Deposit]) {
      if (token.address !== ZERO_ADDRESS) {
        return this._depositERC20(amount, token)
      }

      return this._depositNative(amount, token)
    }

    return 'deposit'
  }

  async withdraw(amount: BigNumber, token: Token): Promise<string> {
    if (this.features[BridgeFeature.Withdraw]) {
      // TODO: Move signer logic to network layer
      const signer = this._jsonRpcProvider.getSigner()
      const ethereumAddress = await signer.getAddress()
      const tokenAddress = token.address

      const depositAddress = await this.withdrawalNetwork.getDepositAddress(
        ethereumAddress,
      )

      const payload: GenerateBridgeOutNervosTransactionPayload = {
        network: 'Ethereum',
        asset: tokenAddress,
        recipient: ethereumAddress,
        sender: depositAddress,
        amount: amount.toString(),
      }

      const result = await this.forceBridgeClient.generateBridgeOutNervosTransaction(
        payload,
      )

      const transaction = await signer.sendTransaction(result.rawTransaction)

      return transaction.hash
    }

    return 'withdraw'
  }
}
