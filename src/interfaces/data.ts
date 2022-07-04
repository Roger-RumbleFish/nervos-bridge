import { BigNumber, providers } from 'ethers'

import { IGodwokenAdapter, INetworkAdapter } from '@api/network/types'
import { Provider } from '@lay2/pw-core'

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
  OmniBridge = 'ckb',
  EthereumBridge = 'ethereum',
  BscBridge = 'bsc',
}

export enum BridgeFeature {
  Deposit = 'Deposit',
  Withdraw = 'Withdraw',
}

export interface IGodwokenBridge<T = providers.JsonRpcProvider | Provider> {
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

export interface AccountBoundToken extends Token {
  balance: BigNumber
}
