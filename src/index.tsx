import React from 'react'

import Web3 from 'web3'

import { CkbNetwork } from '@api/bridges/network-adapter/ckbAdapter'
import { EthereumNetwork } from '@api/bridges/network-adapter/ethereumAdapter'
import { GodwokenNetwork } from '@api/bridges/network-adapter/godwokenAdapter'
import BridgeSelector from '@components/network/BridgeSelector'
import { IBridge, IBridgeDescriptor } from '@interfaces/data'
import { Box } from '@material-ui/core'
import PolyjuiceHttpProvider from '@polyjuice-provider/web3'
import { ConfigContext as BridgeConfigContext } from '@utils/hooks'

import { CkbBridge } from './api/bridges/ckb/bridge'
import { EthereumForceBridge } from './api/bridges/ethereum/bridge'
import { registry as godwokenTokensRegistry } from './api/godwoken/registry'
import BridgeContainer from './containers/BridgeContainer/BridgeContainer'
import { IBridgeContainerProps } from './containers/BridgeContainer/BridgeContainer.types'
import { ThemeProvider } from './styles/theme'

export const BridgeComponent: React.FC<IBridgeContainerProps> = ({
  provider,
  config,
}) => {
  const [bridges, setBridges] = React.useState<IBridge[]>([])
  const [selectedBridge, selectBridge] = React.useState<IBridge>(null)

  React.useEffect(() => {
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
      const godwokenNetwork = new GodwokenNetwork(
        'godwoken',
        'Godwoken',
        httpPolyjuiceProvider,
      )

      const ckbNetwork = new CkbNetwork('ckb', 'CKB', {
        ckbUrl: 'https://testnet.ckb.dev',
        indexerUrl: 'https://testnet.ckb.dev/indexer',
      })

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
        web3,
        {
          ckbUrl: 'https://testnet.ckb.dev',
          indexerUrl: 'https://testnet.ckb.dev/indexer',
        },
      ).init(godwokenTokensRegistry)

      const ethBridge = await new EthereumForceBridge(
        'force-bridge',
        'Force Bridge',
        ethereumNetwork,
        godwokenNetwork,
        web3,
        provider,
        {
          forceBridgeUrl:
            'https://testnet.forcebridge.com/api/force-bridge/api/v1',
        },
      ).init()

      setBridges([ckbBridge, ethBridge])
      selectBridge(ethBridge)
    }

    initBridges()
  }, [provider])

  const handleSelect = (bridgeId: IBridgeDescriptor['id']) => {
    const bridge = bridges.find(
      (bridge) => bridge.toDescriptor().id === bridgeId,
    )
    selectBridge(bridge)
  }

  return (
    <ThemeProvider>
      <BridgeConfigContext.Provider
        value={{
          config: config,
          provider: provider,
          bridge: selectedBridge,
        }}
      >
        <Box display="flex" flexDirection="column" marginX={4} marginY={2}>
          <Box marginY={2}>
            <BridgeSelector
              bridgeDescriptors={bridges.map((bridge) => bridge.toDescriptor())}
              onSelect={handleSelect}
              selectedBridgeId={selectedBridge?.toDescriptor().id}
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
