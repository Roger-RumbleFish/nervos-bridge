import React from 'react'

import { ConfigContext } from '@utils/hooks'

import BridgeContainer from './containers/BridgeContainer/BridgeContainer'
import { IBridgeContainerProps } from './containers/BridgeContainer/BridgeContainer.types'
import { ThemeProvider } from './styles/theme'

export const BridgeComponent: React.FC<IBridgeContainerProps> = ({
  assetsBlacklist,
  provider,
  config,
}) => {
  return (
    <ThemeProvider>
      <ConfigContext.Provider
        value={{
          config: config,
          provider: provider,
          assetsBlacklist: assetsBlacklist,
        }}
      >
        <BridgeContainer />
      </ConfigContext.Provider>
    </ThemeProvider>
  )
}

export default BridgeComponent
