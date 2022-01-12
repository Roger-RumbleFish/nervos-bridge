import React from 'react'

import TokenField from '@components/TokenField'
import { Theme, useMediaQuery } from '@material-ui/core'
import Box from '@material-ui/core/Box'

import { IBridgeProps } from './Bridge.types'

const Bridge: React.FC<IBridgeProps> = ({
  baseTokenAmount,
  baseTokens,
  selectedBaseToken,
  isFetchingTokens,
  onBaseTokenAmountChange,
  onBaseTokenChange,
}) => {
  const isMobile = !useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

  return (
    <Box width="100%">
      <TokenField
        inputLabel={!isMobile ? selectedBaseToken?.symbol : undefined}
        isFetchingTokens={isFetchingTokens}
        tokens={baseTokens}
        amount={baseTokenAmount}
        selectedToken={selectedBaseToken}
        onTokenChange={onBaseTokenChange}
        onAmountChange={onBaseTokenAmountChange}
      />
    </Box>
  )
}

export default Bridge
