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
  toDescriptor(): IBridgeDescriptor
  deposit(amount: BigNumber, token: Token): Promise<string>
  withdraw(amount: BigNumber, token: Token): Promise<string>
  getDepositNetwork(): INetworkAdapter
  getWithdrawalNetwork(): INetworkAdapter
  getTokens(): Promise<BridgedToken[]>
  getShadowTokens(): Promise<BridgedToken[]>
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

// TO BE REMOVED
export interface Token {
  address: string
  symbol: string
  network: string
  decimals: number
}

export type BridgedTokenShadow = {
  address: string
  network: Networks
}

export interface BridgedToken extends Token {
  id: string
  network: Networks
  shadow: BridgedTokenShadow
}

export interface TokenAmount {
  address: Token['address']
  decimals: Token['decimals']
  amount: BigNumber
}

export interface AccountBoundToken extends BridgedToken {
  balance: BigNumber
}

//END TO BE REMOVED
