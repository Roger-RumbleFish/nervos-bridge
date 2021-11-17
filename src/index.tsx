import React from 'react'

import Web3 from 'web3'

import BridgeSelector from '@components/network/BridgeSelector'
import { IBridgeDescriptor } from '@components/network/BridgeSelector/BridgeSelector.types'
import { IBridge } from '@interfaces/data'
import { Box } from '@material-ui/core'
import { ConfigContext as BridgeConfigContext } from '@utils/hooks'

import { CkbBridge } from './api/bridges/ckb/bridge'
import { EthereumForceBridge } from './api/bridges/ethereum/bridge'
import { registry as godwokenTokensRegistry } from './api/godwoken/registry'
import BridgeContainer from './containers/BridgeContainer/BridgeContainer'
import { IBridgeContainerProps } from './containers/BridgeContainer/BridgeContainer.types'
import { ThemeProvider } from './styles/theme'

export const BridgeComponent: React.FC<IBridgeContainerProps> = ({
  assetsWhitelist,
  provider,
  config,
}) => {
  const [bridges, setBridges] = React.useState<IBridge[]>([])
  const [selectedBridge, selectBridge] = React.useState<IBridge>(null)

  React.useEffect(() => {
    async function initBridges() {
      const web3 = new Web3(Web3.givenProvider)

      const ckbBridge = await new CkbBridge(web3, {
        ckbUrl: 'https://testnet.ckb.dev',
        indexerUrl: 'https://testnet.ckb.dev/indexer',
      }).init(godwokenTokensRegistry)

      const ethBridge = await new EthereumForceBridge(web3, provider, {
        forceBridgeUrl:
          'https://testnet.forcebridge.com/api/force-bridge/api/v1',
      }).init()

      setBridges([ckbBridge, ethBridge])
      selectBridge(ethBridge)
    }

    initBridges()
  }, [provider])

  const handleSelect = (bridgeId: IBridge['id']) => {
    const bridge = bridges.find((bridge) => bridge.id === bridgeId)
    selectBridge(bridge)
  }

  const bridgesDescriptors: IBridgeDescriptor[] = bridges.map((bridge) => ({
    id: bridge.id,
    name: bridge.id,
    sides: [bridge.id, 'godwoken'],
  }))
  console.log('[context][bridges] state', selectedBridge)
  return (
    <ThemeProvider>
      <BridgeConfigContext.Provider
        value={{
          config: config,
          getProvider: () => provider,
          assetsWhitelist,
          bridge: selectedBridge,
        }}
      >
        <Box display="flex" flexDirection="column" marginX={4} marginY={2}>
          <Box marginY={2}>
            <BridgeSelector
              bridgeDescriptors={bridgesDescriptors}
              onSelect={handleSelect}
              selectedBridgeId={selectedBridge?.id}
            />
          </Box>
          <Box marginY={2}>
            <BridgeContainer />
          </Box>
        </Box>
      </BridgeConfigContext.Provider>
    </ThemeProvider>
  )
}

export default BridgeComponent
