import { BigNumber, providers } from 'ethers'

import { IGodwokenAdapter, INetworkAdapter } from '@api/network/types'

export enum Environment {
  Mainnet,
  Testnet,
}
export enum Network {
  Ethereum = 'Ethereum',
  CKB = 'CKB',
  Godwoken = 'Godwoken',
  BSC = 'BNB Chain',
}

export type NetworkName = string

export interface IBridgeDescriptor {
  id: Bridge
  name: string
  networks: [NetworkName, NetworkName]
}

export enum Bridge {
  OmniBridge = 'ckb',
  EthereumBridge = 'ethereum',
  BscBridge = 'bsc',
}

export enum BridgeFeature {
  Deposit = 'Deposit',
  Withdraw = 'Withdraw',
}

export type BridgeTransactionResponse =
  | {
      result: string
      error?: string
    }
  | {
      result?: string
      error: string
    }

export interface IGodwokenBridge<T = providers.JsonRpcProvider> {
  id: Bridge
  name: string
  features: IBridgeFeaturesToggle
  init(
    depositProvider: providers.JsonRpcProvider,
    withdrawalProvider: providers.JsonRpcProvider,
  ): Promise<IGodwokenBridge<T>>
  toDescriptor(): IBridgeDescriptor
  deposit(
    amount: BigNumber,
    token: BridgedToken,
  ): Promise<BridgeTransactionResponse>
  withdraw(
    amount: BigNumber,
    token: BridgedToken,
  ): Promise<BridgeTransactionResponse>
  getDepositNetwork(): INetworkAdapter<T>
  getWithdrawalNetwork(): IGodwokenAdapter
}

export interface IBridgeFeaturesToggle {
  [BridgeFeature.Deposit]: boolean
  [BridgeFeature.Withdraw]: boolean
}

export interface IDisplayValue {
  value: BigNumber
  displayValue: string
  decimals?: number
}

export interface Token {
  address: string
  symbol: string
  network: string
  decimals: number
}

export interface BridgedToken extends Token {
  minimalBridgeAmount?: BigNumber
  bridgeFee?: {
    in: BigNumber
    out: BigNumber
  }
}

export interface AccountBoundToken extends BridgedToken {
  balance: BigNumber
}
