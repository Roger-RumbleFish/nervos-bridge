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
  BSC = 'Bsc',
}

export type NetworkName = string

export interface IBridgeDescriptor {
  id: Bridge
  name: string
  networks: [NetworkName, NetworkName]
}

export enum Bridge {
  CkbBridge = 'ckb',
  EthereumBridge = 'ethereum',
  BscBridge = 'bsc',
}

export enum BridgeFeature {
  Deposit = 'Deposit',
  Withdraw = 'Withdraw',
}

export type Provider = any

export interface IGodwokenBridge<T = Provider> {
  id: Bridge
  name: string
  features: IBridgeFeaturesToggle
  init(
    depositProvider: providers.JsonRpcProvider,
    withdrawalProvider: providers.JsonRpcProvider,
  ): Promise<IGodwokenBridge<T>>
  toDescriptor(): IBridgeDescriptor
  deposit(amount: BigNumber, token: Token): Promise<string>
  withdraw(amount: BigNumber, token: Token): Promise<string>
  getDepositNetwork(): INetworkAdapter<T>
  getWithdrawalNetwork(): IGodwokenAdapter
}

export interface IBridgeFeaturesToggle {
  [BridgeFeature.Deposit]: boolean
  [BridgeFeature.Withdraw]: boolean
}

// REDEFINE
export interface IDisplayValue {
  value: BigNumber
  displayValue: string
  decimals?: number
}

export interface IIcon {
  size?: number
}
// END REDEFINE

export interface Token {
  address: string
  symbol: string
  network: string
  decimals: number
}

export interface BridgedToken extends Token {
  id: string
  network: Network
  shadow: Token
}

export interface TokenAmount {
  address: Token['address']
  decimals: Token['decimals']
  amount: BigNumber
}

export interface AccountBoundToken extends Token {
  balance: BigNumber
}

//END TO BE REMOVED
