import { useEffect, useState } from 'react'

import { AddressTranslator } from 'nervos-godwoken-integration'

import { ForceBridge } from '@api/bridges/ethereum/bridge'
import { CkbNetwork } from '@api/network/ckbAdapter'
import { EthereumNetwork } from '@api/network/ethereumAdapter'
import { GodwokenNetwork } from '@api/network/godwokenAdapter'
import { registry as bscTokensRegistry } from '@api/registry/bsc'
import { registry as ethereumTokensRegistry } from '@api/registry/ethereum'
import { IGodwokenBridge, Environment, Network, Bridge } from '@interfaces/data'
import { OmniBridge } from '@api/bridges/ckb/omni-bridge'

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
      ethereum: {
        forceBridge: {
          url: string
        }
      }
      bsc: {
        forceBridge: {
          url: string
        }
      }
    }
  }
  defaultBridge: IGodwokenBridge['id']
}): {
  bridges: IGodwokenBridge[]
  selectedBridge: IGodwokenBridge | null
  selectBridge: (bridge: IGodwokenBridge) => void
} => {
  const [bridgesState, setBridges] = useState<IGodwokenBridge[]>([])
  const [selectedBridge, selectBridge] = useState<IGodwokenBridge>(null)

  useEffect(() => {
    async function createBridges(
      environment: Environment,
      addressTranslator: AddressTranslator,
    ) {
      await addressTranslator.init('testnet')

      const godwokenNetwork = new GodwokenNetwork(
        Network.Godwoken,
        'Godwoken',
        addressTranslator,
        environment,
      )
      const ethereumNetwork = new EthereumNetwork(
        Network.Ethereum,
        'Ethereum',
        ethereumTokensRegistry(environment),
      )
      const bscNetwork = new EthereumNetwork(
        Network.BSC,
        'Bsc',
        bscTokensRegistry(environment),
      )

      const ckbNetwork = new CkbNetwork(
        Network.CKB,
        'CKB',
        addressTranslator,
        environment,
      )

      const forceBridgeEthereum = new ForceBridge({
        id: Bridge.EthereumBridge,
        name: 'Force Bridge Ethereum',
        url: config.bridge.ethereum.forceBridge.url,
        bridgeNetwork: ethereumNetwork,
        godwokenNetwork: godwokenNetwork,
      })
      const forceBridgeBsc = new ForceBridge({
        id: Bridge.BscBridge,
        name: 'Force Bridge BSC',
        url: config.bridge.bsc.forceBridge.url,
        bridgeNetwork: bscNetwork,
        godwokenNetwork: godwokenNetwork,
      })
      const omniBridge = new OmniBridge({
        name: 'Omni Bridge',
        bridgeNetwork: ckbNetwork,
        godwokenNetwork: godwokenNetwork,
        addressTranslator,
      })

      const bridges = [forceBridgeEthereum, forceBridgeBsc, omniBridge]
      const defaultBridge: IGodwokenBridge = bridges.find(
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
