import React from 'react'

import { ConfigContext } from '@utils/hooks'

import BridgeContainer from './containers/BridgeContainer/BridgeContainer'
import { IBridgeContainerProps } from './containers/BridgeContainer/BridgeContainer.types'
import { ThemeProvider } from './styles/theme'

export const BridgeComponent: React.FC<IBridgeContainerProps> = ({
  assetsWhitelist,
  provider,
  config,
}) => {
  return (
    <ThemeProvider>
      <ConfigContext.Provider
        value={{
          config: config,
          getProvider: () => provider,
          assetsWhitelist,
        }}
      >
        <BridgeContainer />
      </ConfigContext.Provider>
    </ThemeProvider>
  )
}

export default BridgeComponent
