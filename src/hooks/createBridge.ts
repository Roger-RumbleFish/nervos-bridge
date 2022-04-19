import {
  AddressTranslator,
  BridgeRPCHandler as ForceBridgeRPCHandler,
} from 'nervos-godwoken-integration'
import Web3 from 'web3'

import { CkbBridge } from '@api/bridges/ckb/bridge'
import { ForceBridge } from '@api/bridges/ethereum/bridge'
import { BscNetwork } from '@api/network/bscAdapter'
import { CkbNetwork } from '@api/network/ckbAdapter'
import { EthereumNetwork } from '@api/network/ethereumAdapter'
import { GodwokenNetwork } from '@api/network/godwokenAdapter'
import { Bridge, Environment, IBridge, Network } from '@interfaces/data'
import PWCore, { IndexerCollector, Web3ModalProvider } from '@lay2/pw-core'
import { Godwoken as GodwokenRpcHandler } from '@polyjuice-provider/godwoken'
import { ForceBridgeBuilder } from '@api/bridges/ethereum/builder'

export async function createForceBridge(
  name: string,
  environment: Environment,
  addressTranslator: AddressTranslator,
  config: {
    forceBridgeUrl: string
  },
): Promise<IBridge> {
  const godwokenNetwork = new GodwokenNetwork(
    Network.Godwoken,
    'Godwoken',
    addressTranslator,
    environment,
  )
  const ethereumNetwork = new EthereumNetwork(Network.Ethereum, 'Ethereum', environment)

  const ethereumBridge = new ForceBridge({
    id: Bridge.EthereumBridge,
    name: name,
    url: config.forceBridgeUrl,
    bridgeNetwork: ethereumNetwork,
    godwokenNetwork: godwokenNetwork,
  })

  return ethereumBridge
}

export async function createForceBridgeBsc(
  name: string,
  environment: Environment,
  addressTranslator: AddressTranslator,
  config: {
    forceBridgeUrl: string
  },
): Promise<IBridge> {
  const godwokenNetwork = new GodwokenNetwork(
    Network.Godwoken,
    'Godwoken',
    addressTranslator,
    environment,
  )
  const bscNetwork = new EthereumNetwork(Network.BSC, 'Bsc', environment)

  const bscBridge = new ForceBridge({
    id: Bridge.BscBridge,
    name: name,
    url: config.forceBridgeUrl,
    bridgeNetwork: bscNetwork,
    godwokenNetwork: godwokenNetwork,
  })

  return bscBridge
}

export async function createPwBridge(
  name: string,
  environment: Environment,
  addressTranslator: AddressTranslator,
  config: {
    godwokenRpcUrl: string
    ckbRpcUrl: string
    ckbIndexerUrl: string
  },
): Promise<IBridge> {
  const godwokenRpcHandler = new GodwokenRpcHandler(config.godwokenRpcUrl)
  const web3 = new Web3(Web3.givenProvider)

  const web3CKBProvider = new Web3ModalProvider(web3)

  const indexerCollector = new IndexerCollector(config.ckbIndexerUrl)
  const pwCoreClient = await new PWCore(config.ckbRpcUrl).init(
    web3CKBProvider,
    indexerCollector,
  )

  const godwokenNetwork = new GodwokenNetwork(
    Network.Godwoken,
    'Godwoken',
    addressTranslator,
    environment,
  )

  const ckbNetwork = new CkbNetwork(
    Network.CKB,
    'CKB',
    indexerCollector,
    addressTranslator,
    environment,
  )

  const pwBridge = new CkbBridge(
    name,
    ckbNetwork,
    godwokenNetwork,
    addressTranslator,
    web3CKBProvider,
    pwCoreClient,
    godwokenRpcHandler,
  )

  return pwBridge
}
