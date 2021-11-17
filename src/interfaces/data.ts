import { BigNumber } from 'ethers'

import { TokensRegistry } from '@api/types'
import { Networks } from '@utils/constants'

export type BridgedPairShadow = {
  address?: string
  network: Networks
}

export type BridgedPair = {
  address?: string
  name?: string
  symbol?: string
  decimals?: number
  network?: Networks
  shadow: BridgedPairShadow
}

export interface IBridge {
  id: string
  init(registry: TokensRegistry): Promise<IBridge>
  deposit(amount: BigNumber, bridgedPair: BridgedPair): Promise<string>
  withdraw(amount: BigNumber, bridgedPair: BridgedPair): Promise<string>
  getBalance(
    accountAddress: string,
    bridgedPair: BridgedPair,
  ): Promise<BigNumber>
  getTokens(): Promise<BridgedToken[]>
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
