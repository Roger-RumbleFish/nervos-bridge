import { providers } from 'ethers'
import {
  AddressTranslator,
  BridgeRPCHandler as ForceBridgeRPCHandler,
  GenerateBridgeInTransactionPayload,
  GenerateBridgeOutNervosTransactionPayload,
} from 'nervos-godwoken-integration'

import { BigNumber } from '@ethersproject/bignumber'
import {
  IBridge,
  IBridgeDescriptor,
  Token,
  BridgeFeature,
  Bridge,
} from '@interfaces/data'
import { Networks } from '@utils/constants'

import { ERC20__factory } from '../../../contracts/ERC20__factory'
import { INetworkAdapter } from '../../network/types'

export class BscForceBridge implements IBridge {
  private _id: Bridge
  public get id(): Bridge {
    return this._id
  }

  public name: string

  public features = {
    [BridgeFeature.Deposit]: true,
    [BridgeFeature.Withdraw]: false,
  }

  public depositNetwork: INetworkAdapter
  public withdrawalNetwork: INetworkAdapter

  private _jsonRpcProvider: providers.JsonRpcProvider
  private forceBridgeClient: ForceBridgeRPCHandler
  private _forceBridgeAddress: string
  private _addressTranslator: AddressTranslator

  constructor(
    id: Bridge,
    name: string,
    depositNetwork: INetworkAdapter,
    withdrawalNetwork: INetworkAdapter,
    addressTranslator: AddressTranslator,
    forceBridgeClient: ForceBridgeRPCHandler,
  ) {
    this._id = id
    this.name = name

    this.depositNetwork = depositNetwork
    this.withdrawalNetwork = withdrawalNetwork

    this.forceBridgeClient = forceBridgeClient
    this._addressTranslator = addressTranslator
  }

  async init(
    depositProvider: providers.JsonRpcProvider,
    withdrawalProvider: providers.JsonRpcProvider,
  ): Promise<IBridge> {
    const bridgeConfig = await this.forceBridgeClient.getBridgeConfig()
    this._forceBridgeAddress = bridgeConfig.xchains.Ethereum.contractAddress
    this._jsonRpcProvider = depositProvider

    this.depositNetwork.init(depositProvider)
    this.withdrawalNetwork.init(withdrawalProvider)

    return this as IBridge
  }

  toDescriptor(): IBridgeDescriptor {
    return {
      id: this.id,
      name: this.name,
      networks: [this.depositNetwork.name, this.withdrawalNetwork.name],
    }
  }

  getDepositNetwork(): INetworkAdapter {
    return this.depositNetwork
  }

  getWithdrawalNetwork(): INetworkAdapter {
    return this.withdrawalNetwork
  }

  async deposit(amount: BigNumber, token: Token): Promise<string> {
    if (this.features[BridgeFeature.Deposit]) {
      // TODO: Move signer logic to network layer
      const signer = this._jsonRpcProvider.getSigner()
      const ethereumAccountAddress = await signer.getAddress()

      const tokenAddress = token.address
      console.log('[bridge][deposit] token address', tokenAddress)
      if (tokenAddress !== '0x0000000000000000000000000000000000000000') {
        const erc20Contract = ERC20__factory.connect(tokenAddress, signer)

        const allowedAmount = await erc20Contract.allowance(
          ethereumAccountAddress,
          this._forceBridgeAddress,
        )

        if (!allowedAmount.gte(amount)) {
          const tx = await erc20Contract.approve(
            this._forceBridgeAddress,
            amount,
          )

          await tx.wait()
        }
      }

      const depositAddress = await this._addressTranslator.getLayer2DepositAddress(
        ethereumAccountAddress,
      )

      const payload: GenerateBridgeInTransactionPayload = {
        asset: {
          network: Networks.Ethereum,
          ident: tokenAddress,
          amount: amount.toString(),
        },
        recipient: depositAddress.addressString,
        sender: ethereumAccountAddress,
      }
      const result = await this.forceBridgeClient.generateBridgeInNervosTransaction(
        payload,
      )

      const transaction = await signer.sendTransaction(result.rawTransaction)

      return transaction.hash
    }

    return 'deposit'
  }

  async withdraw(amount: BigNumber, token: Token): Promise<string> {
    if (this.features[BridgeFeature.Withdraw]) {
      // TODO: Move signer logic to network layer
      const signer = this._jsonRpcProvider.getSigner()
      const ethereumAccountAddress = await signer.getAddress()
      const tokenAddress = token.address

      const depositAddress = await this._addressTranslator.getLayer2DepositAddress(
        ethereumAccountAddress,
      )

      const payload: GenerateBridgeOutNervosTransactionPayload = {
        network: 'Ethereum',
        asset: tokenAddress,
        recipient: ethereumAccountAddress,
        sender: depositAddress.addressString,
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
