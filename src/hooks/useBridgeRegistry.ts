import { useEffect, useState } from 'react'

import { AddressTranslator } from 'nervos-godwoken-integration'
import Web3 from 'web3'

import { CkbBridge } from '@api/bridges/ckb/bridge'
import { ForceBridge } from '@api/bridges/ethereum/bridge'
import { CkbNetwork } from '@api/network/ckbAdapter'
import { EthereumNetwork } from '@api/network/ethereumAdapter'
import { GodwokenNetwork } from '@api/network/godwokenAdapter'
import { registry as bscTokensRegistry } from '@api/registry/bsc'
import { registry as ethereumTokensRegistry } from '@api/registry/ethereum'
import {
  IGodwokenBridge,
  Environment,
  Network,
  Bridge,
  GodwokenEvironmentMap,
} from '@interfaces/data'
import PWCore, { IndexerCollector, Web3ModalProvider } from '@lay2/pw-core'
import { mapGodwokenEnvironment } from '@utils/mapGodwokenNetwork'
import { getConfig } from 'src/config/config'

export const useBridgeRegistry = ({
  environment,
  addressTranslator,
  defaultBridge: defaultBridgeId,
}: {
  environment: Environment
  addressTranslator: AddressTranslator
  defaultBridge: IGodwokenBridge['id']
}): {
  bridges: IGodwokenBridge[]
  selectedBridge: IGodwokenBridge | null
  selectBridge: (bridge: IGodwokenBridge) => void
} => {
  const [bridgesState, setBridges] = useState<IGodwokenBridge[]>([])
  const [selectedBridge, selectBridge] = useState<IGodwokenBridge>(null)

  const config = getConfig(environment)

  useEffect(() => {
    async function createBridges(environment: Environment) {
      const web3 = new Web3(Web3.givenProvider)
      const web3CKBProvider = new Web3ModalProvider(web3)

      const indexerCollector = new IndexerCollector(config.ckb.indexer.url)
      const pwCoreClient = await new PWCore(config.ckb.url).init(
        web3CKBProvider,
        indexerCollector,
      )

      const addressTranslator = new AddressTranslator({
        CKB_URL: config.ckb.url,
        RPC_URL: config.godwoken.rpcUrl,
        INDEXER_URL: config.ckb.indexer.url,
        deposit_lock_script_type_hash: config.ckb.depositLockScriptTypeHash,
        eth_account_lock_script_type_hash: config.ckb.ethAccountLockHash,
        rollup_type_script: {
          code_hash: config.ckb.rollupTypeScript.codeHash,
          hash_type: config.ckb.rollupTypeScript.hashType,
          args: config.ckb.rollupTypeScript.args,
        },
        rollup_type_hash: config.ckb.rollupTypeHash,
        rc_lock_script_type_hash: config.ckb.rcLockScriptTypeHash,
      })

      await addressTranslator.init(mapGodwokenEnvironment(environment))

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
        indexerCollector,
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
      const pwBridge = new CkbBridge({
        name: 'PwCore Bridge',
        pwCore: pwCoreClient,
        bridgeNetwork: ckbNetwork,
        godwokenNetwork: godwokenNetwork,
        web3CKBProvider,
      })

      const bridges = [pwBridge, forceBridgeEthereum, forceBridgeBsc]
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
