import { useEffect, useState } from 'react'

import { providers } from 'ethers'
import {
  AddressTranslator,
  BridgeRPCHandler as ForceBridgeRPCHandler,
} from 'nervos-godwoken-integration'
import Web3 from 'web3'

import Config from "../../config.json";

import { CkbBridge } from '@api/bridges/ckb/bridge'
import { EthereumForceBridge } from '@api/bridges/ethereum/bridge'
import { CkbNetwork } from '@api/network/ckbAdapter'
import { EthereumNetwork } from '@api/network/ethereumAdapter'
import { GodwokenNetwork } from '@api/network/godwokenAdapter'
import { IBridge } from '@interfaces/data'
import PWCore, { IndexerCollector, Web3ModalProvider } from '@lay2/pw-core'
import { Godwoken as GodwokenRpcHandler } from '@polyjuice-provider/godwoken'
import PolyjuiceHttpProvider from '@polyjuice-provider/web3'

export const useBridgeRegistry = ({
  provider,
}: {
  provider: providers.JsonRpcProvider
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
        rollupTypeHash: Config.nervos.rollupTypeHash,
        ethAccountLockCodeHash: Config.nervos.ethAccountLockCodeHash,
        web3Url: Config.nervos.godwoken.rpcUrl,
      }

      const httpPolyjuiceProvider = new PolyjuiceHttpProvider(
        Config.nervos.godwoken.rpcUrl,
        providerConfig,
      )
      const web3PolyjuiceProvider = new providers.Web3Provider(
        httpPolyjuiceProvider,
      )

      const web3CKBProvider = new Web3ModalProvider(web3)

      const indexerCollector = new IndexerCollector(
        Config.nervos.indexer.url,
      )
      const pwCoreClient = await new PWCore(Config.nervos.ckb.url).init(
        web3CKBProvider,
        indexerCollector,
      )

      const addressTranslator = new AddressTranslator({
        CKB_URL: Config.nervos.ckb.url,
        RPC_URL: Config.nervos.godwoken.rpcUrl,
        INDEXER_URL: Config.nervos.indexer.url,
        deposit_lock_script_type_hash: Config.nervos.depositLockScriptTypeHash,
        eth_account_lock_script_type_hash: Config.nervos.ethAccountLockCodeHash,
        rollup_type_script: {
          code_hash: Config.nervos.rollupTypeScript.codeHash,
          hash_type: Config.nervos.rollupTypeScript.hashType,
          args: Config.nervos.rollupTypeScript.args,
        },
        rollup_type_hash: Config.nervos.rollupTypeHash,
        portal_wallet_lock_hash: Config.nervos.portalWalletLockHash,
      })
      await addressTranslator.init(pwCoreClient, PWCore.config, PWCore.chainId)

      const forceBridgeClient = new ForceBridgeRPCHandler(
        Config.nervos.forceBridgeUrl,
      )
      const godwokenRpcHandler = new GodwokenRpcHandler(Config.nervos.godwoken.rpcUrl)

      const godwokenNetwork = new GodwokenNetwork(
        'godwoken',
        'Godwoken',
        web3PolyjuiceProvider,
        addressTranslator,
      )

      const ckbNetwork = new CkbNetwork(
        'ckb',
        'CKB',
        web3,
        indexerCollector,
        pwCoreClient,
        addressTranslator,
      )

      const ethereumNetwork = new EthereumNetwork(
        'ethereum',
        'Ethereum',
        provider,
      )

      const ckbBridge = await new CkbBridge(
        'pw-lock',
        'PwLock',
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

    if (provider) {
      initBridges()
    }
  }, [provider])

  return {
    bridges,
    selectedBridge,
    selectBridge,
  }
}
