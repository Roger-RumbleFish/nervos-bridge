import React from 'react'

import { AddressTranslator } from 'nervos-godwoken-integration'

import BridgeSelector from '@components/bridge/BridgeSelector'
import { IBridgeDescriptor, Bridge, Environment } from '@interfaces/data'
import { Box } from '@material-ui/core'
import { ConfigContext as BridgeConfigContext } from '@utils/hooks'

import Config from './config'
import BridgeContainer from './containers/BridgeContainer/BridgeContainer'
import { IBridgeContainerProps } from './containers/BridgeContainer/BridgeContainer.types'
import { useBridgeRegistry } from './hooks/useBridgeRegistry'
import { ThemeProvider } from './styles/theme'

export const BridgeComponent: React.FC<IBridgeContainerProps> = ({
  provider,
  polyjuiceProvider,
  config,
}) => {
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
  const { bridges, selectedBridge, selectBridge } = useBridgeRegistry({
    environment: Environment.Testnet,
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
    defaultBridge: Bridge.CkbBridge,
  })

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
          polyjuiceProvider: polyjuiceProvider,
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
