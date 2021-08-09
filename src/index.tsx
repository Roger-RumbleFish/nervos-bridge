import React from 'react'

import BridgeContainer from './containers/BridgeContainer/BridgeContainer'
import { IBridgeContainerProps } from './containers/BridgeContainer/BridgeContainer.types'
import { ThemeProvider } from './styles/theme'

export const BridgeComponent: React.FC<IBridgeContainerProps> = ({
  blacklist,
}) => {
  return (
    <ThemeProvider>
      <BridgeContainer blacklist={blacklist} />
    </ThemeProvider>
  )
}

export default BridgeComponent
