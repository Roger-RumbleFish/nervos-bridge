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

      const godwokenWeb3Url = 'https://godwoken-testnet-web3-rpc.ckbapp.dev'
      const providerConfig = {
        rollupTypeHash:
          '0x4cc2e6526204ae6a2e8fcf12f7ad472f41a1606d5b9624beebd215d780809f6a',
        ethAccountLockCodeHash:
          '0xdeec13a7b8e100579541384ccaf4b5223733e4a5483c3aec95ddc4c1d5ea5b22',
        web3Url: godwokenWeb3Url,
      }

      const httpPolyjuiceProvider = new PolyjuiceHttpProvider(
        godwokenWeb3Url,
        providerConfig,
      )
      const web3PolyjuiceProvider = new providers.Web3Provider(
        httpPolyjuiceProvider,
      )

      const web3CKBProvider = new Web3ModalProvider(web3)

      const indexerCollector = new IndexerCollector(
        'https://testnet.ckb.dev/indexer',
      )
      const pwCoreClient = await new PWCore('https://testnet.ckb.dev').init(
        web3CKBProvider,
        indexerCollector,
      )

      const addressTranslator = new AddressTranslator()
      await addressTranslator.init(pwCoreClient, PWCore.config, PWCore.chainId)

      const forceBridgeClient = new ForceBridgeRPCHandler(
        'https://testnet.forcebridge.com/api/force-bridge/api/v1',
      )
      const godwokenRpcHandler = new GodwokenRpcHandler(
        'https://godwoken-testnet-web3-rpc.ckbapp.dev',
      )

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
