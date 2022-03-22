import { ethers } from 'ethers'
import { AddressTranslator } from 'nervos-godwoken-integration'

import { Environment } from '@interfaces/data'

export interface IBridgeContainerProps {
  provider: ethers.providers.JsonRpcProvider
  polyjuiceProvider: ethers.providers.JsonRpcProvider
  addressTranslator: AddressTranslator
  environment: Environment
  config?: {
    godwokenRpcUrl: string
    ckbRpcUrl: string
    ckbIndexerUrl: string
    depositLockScriptTypeHash: string
    ethAccountLockCodeHash: string
    rollupTypeHash: string
    bridge: {
      forceBridge: { url: string }
    }
  }
}
