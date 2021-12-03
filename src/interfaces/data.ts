import { BigNumber } from 'ethers'

import { INetworkAdapter } from '@api/network/types'
import { Networks } from '@utils/constants'

export type BridgedPairShadow = {
  address?: string
  network: Networks
  name?: string
  symbol?: string
}

export type BridgedPair = {
  address?: string
  name?: string
  symbol?: string
  decimals?: number
  network?: Networks
  shadow: BridgedPairShadow
}

export type NetworkName = string

export interface IBridgeDescriptor {
  id: string
  name: string
  networks: [INetworkAdapter['name'], INetworkAdapter['name']]
}

export interface IBridge {
  id: string
  name: string
  features: IBridgeFeaturesToggle
  toDescriptor(): IBridgeDescriptor
  deposit(amount: BigNumber, token: Token): Promise<string>
  withdraw(amount: BigNumber, token: Token): Promise<string>
  getDepositNetwork(): INetworkAdapter
  getWithdrawalNetwork(): INetworkAdapter
}

export enum BridgeFeature {
  Deposit = 'Deposit',
  Withdraw = 'Withdraw',
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
  network: Networks
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
