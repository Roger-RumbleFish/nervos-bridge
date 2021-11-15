import { CanonicalTokenSymbol, TokensRegistry } from '@api/types'
import { Networks } from '@utils/constants'
import { BigNumber } from 'ethers'

export type BridgedPairShadow = {
  address?: string
  network: string
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
  init(registry: TokensRegistry): Promise<IBridge>
  deposit(
    amount: BigNumber,
    bridgedPair: BridgedPair,
  ): Promise<string>
  withdraw(
    amount: BigNumber,
    bridgedPair: BridgedPair,
  ): Promise<string>
  getBalance(
    accountAddress: string,
    bridgedPair: BridgedPair,
  ): Promise<BigNumber>
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
export interface TokenModel {
  id: string
  address: string
  name: string
  symbol: string
  decimals: number
}

export type BridgedPairIdentifier = {
  id: string
  network: string
}

export type BridgeToken = {
  model: TokenModel
  network: string
  shadow: BridgedPairIdentifier
}
//END TO BE REMOVED
