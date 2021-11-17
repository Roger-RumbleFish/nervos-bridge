// import { providers } from 'ethers'
import Web3 from 'web3'

// import { getDisplayValue } from '@components/BigNumberInput/BigNumberInput.utils'
import { BridgedToken } from '@interfaces/data'
import { Networks } from '@utils/constants'

import { registry as godwokenTokensRegistry } from '../../godwoken/registry'
import { CkbBridge } from './bridge'

export const getTokens = async (): Promise<BridgedToken[]> => {
  const web3 = new Web3(Web3.givenProvider)

  const bridge = await new CkbBridge(web3, {
    ckbUrl: 'https://testnet.ckb.dev',
    indexerUrl: 'https://testnet.ckb.dev/indexer',
  }).init(godwokenTokensRegistry)

  const bridgedPairs = bridge.getBridgedPairs()

  return bridgedPairs.map(
    (bridgedPair) =>
      ({
        address: bridgedPair.shadow.address,
        decimals: bridgedPair.decimals,
        id: bridgedPair.shadow.address,
        name: bridgedPair.name,
        symbol: bridgedPair.name,
        network: Networks.NervosL2,
        shadow: {
          address: bridgedPair.shadow.address,
          network: Networks.NervosL1,
        },
      } as BridgedToken),
  )
}
