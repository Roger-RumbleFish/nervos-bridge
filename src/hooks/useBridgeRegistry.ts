import { useEffect, useState } from 'react'

import { AddressTranslator } from 'nervos-godwoken-integration'
import Web3 from 'web3'

import { IBridge, Environment, Network, Bridge } from '@interfaces/data'
import PWCore, { IndexerCollector, Web3ModalProvider } from '@lay2/pw-core'

import {
  createForceBridge,
  createForceBridgeBsc,
  createPwBridge,
} from './createBridge'
import { ForceBridge } from '@api/bridges/ethereum/bridge'
import { EthereumNetwork } from '@api/network/ethereumAdapter'
import { GodwokenNetwork } from '@api/network/godwokenAdapter'

export const useBridgeRegistry = ({
  environment,
  addressTranslator,
  config,
  defaultBridge: defaultBridgeId,
}: {
  environment: Environment
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
  const [bridgesState, setBridges] = useState<IBridge[]>([])
  const [selectedBridge, selectBridge] = useState<IBridge>(null)

  useEffect(() => {
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
        'Godwoken Bridge',
        environment,
        addressTranslator,
        {
          godwokenRpcUrl: config.godwokenRpcUrl,
          ckbRpcUrl: config.ckbRpcUrl,
          ckbIndexerUrl: config.ckbIndexerUrl,
        },
      )

      const godwokenNetwork = new GodwokenNetwork(
        Network.Godwoken,
        'Godwoken',
        addressTranslator,
        environment,
      )
      const ethereumNetwork = new EthereumNetwork(Network.Ethereum, 'Ethereum', environment)
      const bscNetwork = new EthereumNetwork(Network.BSC, 'Bsc', environment)
    
      const forceBridgeEthereum = new ForceBridge({
        id: Bridge.EthereumBridge,
        name: 'Force Bridge Ethereum',
        url: config.bridge.forceBridge.url,
        bridgeNetwork: ethereumNetwork,
        godwokenNetwork: godwokenNetwork,
      })

      const forceBridgeBsc = new ForceBridge({
        id: Bridge.BscBridge,
        name: 'Force Bridge BSC',
        url: 'https://testnet.forcebridge.com/bscapi/force-bridge/api/v1',
        bridgeNetwork: bscNetwork,
        godwokenNetwork: godwokenNetwork,
      })

      const bridges = [pwBridge, forceBridgeEthereum, forceBridgeBsc]
      const defaultBridge: IBridge = bridges.find(
        ({ id }) => id === defaultBridgeId,
      )

      setBridges(bridges)
      selectBridge(defaultBridge)
    }

    if (addressTranslator && Object.values(Environment).includes(environment)) {
      createBridges(environment, addressTranslator)
    }
  }, [addressTranslator, environment])

  return {
    bridges: bridgesState,
    selectedBridge,
    selectBridge,
  }
}
