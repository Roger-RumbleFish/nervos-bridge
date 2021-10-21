import { ethers } from 'ethers'
import { IAddressTranslatorConfig } from 'nervos-godwoken-integration'

export interface IBridgeContainerProps {
  assetsWhitelist: string[]
  provider: ethers.providers.Web3Provider
  config?: {
    addressTranslator?: IAddressTranslatorConfig
    rpcBridgeUrl?: string
    supportedTokens?: string[]
  }
}
