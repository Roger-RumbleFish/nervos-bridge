import React from 'react'

import { useBridge } from 'src'

import BridgeSelector from '@components/bridge/BridgeSelector'
import { IBridgeDescriptor, Network } from '@interfaces/data'
import { Box } from '@material-ui/core'
import { ConfigContext as BridgeConfigContext } from '@utils/hooks'

import Config from './config'
import BridgeContainer from './containers/BridgeContainer/BridgeContainer'
import { IBridgeContainerProps } from './containers/BridgeContainer/BridgeContainer.types'
import { useBridgeRegistry } from './hooks/useBridgeRegistry'
import { ThemeProvider } from './styles/theme'

export const BridgeComponent: React.FC<IBridgeContainerProps> = ({
  provider,
  config,
  addressTranslator,
}) => {
  const { bridges, selectedBridge, selectBridge } = useBridgeRegistry({
    network: Network.Testnet,
    provider,
    addressTranslator,
    config: {
      godwokenRpcUrl: Config.nervos.godwoken.rpcUrl,
      ckbRpcUrl: Config.nervos.ckb.url,
      ckbIndexerUrl: Config.nervos.indexer.url,
      depositLockScriptTypeHash: Config.nervos.depositLockScriptTypeHash,
      ethAccountLockCodeHash: Config.nervos.ethAccountLockCodeHash,
      rollupTypeHash: Config.nervos.rollupTypeHash,
      bridge: {
        forceBridge: { url: Config.nervos.forceBridgeUrl },
      },
    },
  })

  const {
    tokens,
    token,
    setToken,
    setValue,
    value,
    deposit,
    withdraw,
    selectedFeature,
    setSelectedFeature,
  } = useBridge({ bridge: selectedBridge, provider })

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
            <BridgeContainer
              provider={provider}
              bridge={selectedBridge}
              tokens={tokens}
              token={token}
              setToken={setToken}
              setValue={setValue}
              value={value}
              deposit={deposit}
              withdraw={withdraw}
              selectedFeature={selectedFeature}
              setSelectedFeature={setSelectedFeature}
            />
          </Box>
        </Box>
      </BridgeConfigContext.Provider>
    </ThemeProvider>
  )
}

export default BridgeComponent
