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
import { IBridge, Bridge, Environment } from '@interfaces/data'
import PWCore, { IndexerCollector, Web3ModalProvider } from '@lay2/pw-core'
import { Godwoken as GodwokenRpcHandler } from '@polyjuice-provider/godwoken'

export const useBridgeRegistry = ({
  environment,
  addressTranslator,
  config,
  defaultBridge,
}: {
  environment: Environment
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
  defaultBridge: IBridge['id']
}): {
  bridges: IBridge[]
  selectedBridge: IBridge | null
  selectBridge: (bridge: IBridge) => void
} => {
  const [bridges, setBridges] = useState<IBridge[]>([])
  const [selectedBridge, selectBridge] = useState<IBridge>(null)

  useEffect(() => {
    async function createForceBridge(
      environment: Environment,
      addressTranslator: AddressTranslator,
    ) {
      const forceBridgeClient = new ForceBridgeRPCHandler(
        config.bridge.forceBridge.url,
      )

      const godwokenNetwork = new GodwokenNetwork(
        environment,
        'Godwoken',
        addressTranslator,
      )

      const ethereumNetwork = new EthereumNetwork(environment, 'Ethereum')

      const ethBridge = new EthereumForceBridge(
        'Force Bridge',
        ethereumNetwork,
        godwokenNetwork,
        addressTranslator,
        forceBridgeClient,
      )

      return ethBridge
    }

    async function createPwBridge(
      environment: Environment,
      pwCoreClient: PWCore,
      addressTranslator: AddressTranslator,
      indexerCollector: IndexerCollector,
      web3CKBProvider: Web3ModalProvider,
    ) {
      const godwokenRpcHandler = new GodwokenRpcHandler(config.godwokenRpcUrl)

      const godwokenNetwork = new GodwokenNetwork(
        environment,
        'Godwoken',
        addressTranslator,
      )

      const ckbNetwork = new CkbNetwork(
        environment,
        'CKB',
        indexerCollector,
        pwCoreClient,
        addressTranslator,
      )

      const pwBridge = new CkbBridge(
        'Godwoken Bridge',
        ckbNetwork,
        godwokenNetwork,
        addressTranslator,
        web3CKBProvider,
        pwCoreClient,
        godwokenRpcHandler,
      )

      return pwBridge
    }

    async function createBridges(
      environment: Environment,
      addressTranslator: AddressTranslator,
    ) {
      const web3 = new Web3(Web3.givenProvider)

      const web3CKBProvider = new Web3ModalProvider(web3)

      const indexerCollector = new IndexerCollector(config.ckbIndexerUrl)
      const pwCoreClient = await new PWCore(config.ckbRpcUrl).init(
        web3CKBProvider,
        indexerCollector,
      )

      await addressTranslator.init({
        pwCore: pwCoreClient,
        pwConfig: PWCore.config,
        pwChainId: PWCore.chainId,
      })

      const pwBridge = await createPwBridge(
        environment,
        pwCoreClient,
        addressTranslator,
        indexerCollector,
        web3CKBProvider,
      )
      const forceBridge = await createForceBridge(
        environment,
        addressTranslator,
      )

      setBridges([pwBridge, forceBridge])
      selectBridge(defaultBridge === Bridge.CkbBridge ? pwBridge : forceBridge)
    }

    if (addressTranslator && Object.values(Environment).includes(environment)) {
      createBridges(environment, addressTranslator)
    }
  }, [addressTranslator, environment])

  return {
    bridges,
    selectedBridge,
    selectBridge,
  }
}
