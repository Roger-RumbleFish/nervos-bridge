import React from 'react'

import { ethers } from 'ethers'

import BridgeContainer from './containers/BridgeContainer/BridgeContainer'
import { IBridgeContainerProps } from './containers/BridgeContainer/BridgeContainer.types'
import { ThemeProvider } from './styles/theme'

export const BridgeComponent: React.FC<IBridgeContainerProps> = ({
  blacklist,
  provider,
  accountAddress,
}) => {
  return (
    <ThemeProvider>
      <BridgeContainer
        blacklist={blacklist}
        provider={provider}
        accountAddress={accountAddress}
      />
    </ThemeProvider>
  )
}

export default BridgeComponent
