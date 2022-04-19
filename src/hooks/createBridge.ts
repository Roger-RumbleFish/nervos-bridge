import { AddressTranslator } from 'nervos-godwoken-integration'
import Web3 from 'web3'

import { CkbBridge } from '@api/bridges/ckb/bridge'
import { CkbNetwork } from '@api/network/ckbAdapter'
import { GodwokenNetwork } from '@api/network/godwokenAdapter'
import {  Environment, IBridge, Network } from '@interfaces/data'
import PWCore, { IndexerCollector, Web3ModalProvider } from '@lay2/pw-core'
import { Godwoken as GodwokenRpcHandler } from '@polyjuice-provider/godwoken'


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
