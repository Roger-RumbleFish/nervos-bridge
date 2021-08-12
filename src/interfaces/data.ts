import { BigNumber } from 'ethers'

export interface IDisplayValue {
  value: BigNumber
  displayValue: string
  decimals?: number
}

export interface IIcon {
  size?: number
}

export interface TokenModel {
  id: string
  address: string
  name: string
  symbol: string
  decimals: number
}

export type BridgeTokenIdentifier = {
  id: string
  network: string
}

export type BridgeToken = {
  model: TokenModel
  network: string
  shadow: BridgeTokenIdentifier
}
