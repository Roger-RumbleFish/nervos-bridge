import { useEffect, useState } from 'react'

import { providers } from 'ethers'
import {
  AddressTranslator,
  BridgeRPCHandler as ForceBridgeRPCHandler,
} from 'nervos-godwoken-integration'
import Web3 from 'web3'

import { CkbBridge } from '@api/bridges/ckb/bridge'
import { EthereumForceBridge } from '@api/bridges/ethereum/bridge'
import { CkbNetwork } from '@api/network/ckbAdapter'
import { EthereumNetwork } from '@api/network/ethereumAdapter'
import { GodwokenNetwork } from '@api/network/godwokenAdapter'
import { Network, IBridge } from '@interfaces/data'
import PWCore, { IndexerCollector, Web3ModalProvider } from '@lay2/pw-core'
import { Godwoken as GodwokenRpcHandler } from '@polyjuice-provider/godwoken'
import PolyjuiceHttpProvider from '@polyjuice-provider/web3'

export const useBridgeRegistry = ({
  network,
  provider,
  addressTranslator,
  config,
}: {
  network: Network
  provider: providers.JsonRpcProvider
  addressTranslator: AddressTranslator
  config: {
    godwokenRpcUrl: string
    ethAccountLockCodeHash: string
    depositLockScriptTypeHash: string
    rollupTypeHash: string
    ckbRpcUrl: string
    ckbIndexerUrl: string
    bridge: {
      forceBridge: {
        url: string
      }
    }
  }
}): {
  bridges: IBridge[]
  selectedBridge: IBridge | null
  selectBridge: (bridge: IBridge) => void
} => {
  const [bridges, setBridges] = useState<IBridge[]>([])
  const [selectedBridge, selectBridge] = useState<IBridge>(null)

  useEffect(() => {
    async function initBridges() {
      const web3 = new Web3(Web3.givenProvider)

      const providerConfig = {
        rollupTypeHash: config.rollupTypeHash,
        ethAccountLockCodeHash: config.ethAccountLockCodeHash,
        web3Url: config.godwokenRpcUrl,
      }

      const httpPolyjuiceProvider = new PolyjuiceHttpProvider(
        config.godwokenRpcUrl,
        providerConfig,
      )
      const web3PolyjuiceProvider = new providers.Web3Provider(
        httpPolyjuiceProvider,
      )

      const web3CKBProvider = new Web3ModalProvider(web3)

      const indexerCollector = new IndexerCollector(config.ckbIndexerUrl)
      const pwCoreClient = await new PWCore(config.ckbRpcUrl).init(
        web3CKBProvider,
        indexerCollector,
      )

      const forceBridgeClient = new ForceBridgeRPCHandler(
        config.bridge.forceBridge.url,
      )
      const godwokenRpcHandler = new GodwokenRpcHandler(config.godwokenRpcUrl)

      await addressTranslator.init({
        pwCore: pwCoreClient,
        pwConfig: PWCore.config,
        pwChainId: PWCore.chainId,
      })

      const godwokenNetwork = new GodwokenNetwork(
        network,
        'godwoken',
        'Godwoken',
        web3PolyjuiceProvider,
        addressTranslator,
      )

      const ckbNetwork = new CkbNetwork(
        network,
        'ckb',
        'CKB',
        web3,
        indexerCollector,
        pwCoreClient,
        addressTranslator,
      )

      const ethereumNetwork = new EthereumNetwork(
        network,
        'ethereum',
        'Ethereum',
        provider,
      )

      const ckbBridge = await new CkbBridge(
        'pw-lock',
        'Godwoken Bridge',
        ckbNetwork,
        godwokenNetwork,
        addressTranslator,
        web3CKBProvider,
        pwCoreClient,
        godwokenRpcHandler,
      )

      const ethBridge = await new EthereumForceBridge(
        'force-bridge',
        'Force Bridge',
        ethereumNetwork,
        godwokenNetwork,
        addressTranslator,
        forceBridgeClient,
        web3,
        provider,
      ).init()

      setBridges([ckbBridge, ethBridge])
      selectBridge(ethBridge)
    }

    if (provider && addressTranslator) {
      initBridges()
    }
  }, [provider, addressTranslator])

  return {
    bridges,
    selectedBridge,
    selectBridge,
  }
}
