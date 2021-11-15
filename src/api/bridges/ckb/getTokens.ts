import { providers } from 'ethers'
import Web3 from 'web3'

import { getDisplayValue } from '@components/BigNumberInput/BigNumberInput.utils'

import { registry as godwokenTokensRegistry } from '../../godwoken/registry'
import { CkbBridge } from './bridge'
import { BridgeToken } from '@interfaces/data'
import { Networks } from '@utils/constants'

export const getTokens = async (): Promise<BridgeToken[]> => {
  const web3 = new Web3(Web3.givenProvider)

  const bridge = await new CkbBridge(web3, {
    ckbUrl: 'https://testnet.ckb.dev',
    indexerUrl: 'https://testnet.ckb.dev/indexer',
  }).init(godwokenTokensRegistry)

  const bridgedPairs = bridge.getBridgedPairs()

  return bridgedPairs.map(bridgedPair => ({
    model: {
      address: bridgedPair.shadow.address,
      decimals: bridgedPair.decimals,
      id: bridgedPair.shadow.address,
      name: bridgedPair.name,
      symbol: bridgedPair.name,
    },
    network: Networks.NervosL2,
    shadow: {
      id: bridgedPair.shadow.address,
      network: Networks.NervosL1,
    }
  } as BridgeToken))
}
