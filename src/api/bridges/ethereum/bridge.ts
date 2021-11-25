import { providers } from 'ethers'
import {
  AddressTranslator,
  ForceBridgeRPCHandler,
  GenerateBridgeInTransactionPayload,
  GenerateBridgeOutNervosTransactionPayload,
} from 'nervos-godwoken-integration'
import Web3 from 'web3'

// import {
// CanonicalTokenSymbol,
// TokenDescriptor,
// TokensRegistry,
// } from '@api/types'
import { BigNumber } from '@ethersproject/bignumber'
import {
  IBridge, // BridgedToken,
  NetworkName,
  IBridgeDescriptor,
  Token,
} from '@interfaces/data'
import { Networks } from '@utils/constants'

import { ERC20__factory } from '../../../factories/ERC20__factory'
import { INetworkAdapter } from '../../network/types'
import { IBridgeConfig } from '../types'

// import { mapForceBridgeNetwork } from './utils'

export class EthereumForceBridge implements IBridge {
  public id: string
  public name: string
  public networks: [NetworkName, NetworkName]

  public depositNetwork: INetworkAdapter
  public withdrawalNetwork: INetworkAdapter

  private web3: Web3
  private jsonRpcProvider: providers.JsonRpcProvider
  private forceBridgeClient: ForceBridgeRPCHandler
  private forceBridgeAddress: string
  private addressTranslator: AddressTranslator

  public config: IBridgeConfig

  constructor(
    id: string,
    name: string,
    depositNetwork: INetworkAdapter,
    withdrawalNetwork: INetworkAdapter,
    addressTranslator: AddressTranslator,
    forceBridgeClient: ForceBridgeRPCHandler,
    web3: Web3,
    provider: providers.JsonRpcProvider,
    config: IBridgeConfig,
  ) {
    this.id = id
    this.name = name

    this.depositNetwork = depositNetwork
    this.withdrawalNetwork = withdrawalNetwork
    this.networks = [depositNetwork.name, withdrawalNetwork.name]

    this.web3 = web3
    this.jsonRpcProvider = provider
    this.forceBridgeClient = forceBridgeClient
    this.addressTranslator = addressTranslator

    this.config = config
  }

  async init(): Promise<IBridge> {
    const bridgeConfig = await this.forceBridgeClient.getBridgeConfig()
    this.forceBridgeAddress = bridgeConfig.xchains.Ethereum.contractAddress

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
    if (this.config.deposit) {
      const signer = this.jsonRpcProvider.getSigner()
      const ethereumAccountAddress = await signer.getAddress()

      const tokenAddress = token.address
      const erc20Contract = ERC20__factory.connect(tokenAddress, signer)

      const allowedAmount = await erc20Contract.allowance(
        ethereumAccountAddress,
        this.forceBridgeAddress,
      )

      if (!allowedAmount.gte(amount)) {
        const tx = await erc20Contract.approve(this.forceBridgeAddress, amount)

        await tx.wait()
      }

      const depositAddress = await this.addressTranslator.getLayer2DepositAddress(
        this.web3,
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

    return 'not supported'
  }

  async withdraw(amount: BigNumber, token: Token): Promise<string> {
    if (this.config.withdraw) {
      const signer = this.jsonRpcProvider.getSigner()
      const ethereumAccountAddress = await signer.getAddress()
      const tokenAddress = token.address

      const depositAddress = await this.addressTranslator.getLayer2DepositAddress(
        this.web3,
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

    return 'not supported'
  }
}
