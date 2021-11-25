import { ethers } from 'ethers'
import { IAddressTranslatorConfig } from 'nervos-godwoken-integration'

export interface IBridgeContainerProps {
  provider: ethers.providers.JsonRpcProvider
  config?: {
    addressTranslator?: IAddressTranslatorConfig
    rpcBridgeUrl?: string
    supportedTokens?: string[]
  }
}

export enum BridgeAction {
  Deposit = 'Deposit',
  Withdraw = 'Withdraw',
}
