import { ethers } from 'ethers'
import {
  AddressTranslator,
  IAddressTranslatorConfig,
} from 'nervos-godwoken-integration'
import { Network } from '@interfaces/data'

export interface IBridgeContainerProps {
  provider: ethers.providers.JsonRpcProvider
  addressTranslator: AddressTranslator
  network?: Network
  config?: {
    godwokenRpcUrl: string,
    ckbRpcUrl:string,
    ckbIndexerUrl: string,
    depositLockScriptTypeHash: string,
    ethAccountLockCodeHash: string,
    rollupTypeHash: string,
    bridge: {
      forceBridge: { url: string },
    },
  }
}
