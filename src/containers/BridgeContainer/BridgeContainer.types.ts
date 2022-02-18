import { ethers } from 'ethers'
import {
  AddressTranslator,
  IAddressTranslatorConfig,
} from 'nervos-godwoken-integration'

export interface IBridgeContainerProps {
  provider: ethers.providers.JsonRpcProvider
  addressTranslator: AddressTranslator
  config?: {
    addressTranslator?: IAddressTranslatorConfig
    rpcBridgeUrl?: string
    supportedTokens?: string[]
  }
}
