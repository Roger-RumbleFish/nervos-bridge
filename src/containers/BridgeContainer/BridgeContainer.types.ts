import { ethers } from 'ethers'
import { IAddressTranslatorConfig } from 'nervos-godwoken-integration'

export interface IBridgeContainerProps {
  assetsBlacklist: string[]
  provider: ethers.providers.Web3Provider
  config?: {
    addressTranslator?: IAddressTranslatorConfig
    rpcFaucetUrl?: string
  }
}
