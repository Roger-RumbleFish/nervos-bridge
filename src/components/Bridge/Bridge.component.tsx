import React from 'react'

import { Button } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import TokenSelector from '../TokenSelector'
import { IBridgeProps } from './Bridge.types'

const Bridge: React.FC<IBridgeProps> = ({
  title,
  description,
  baseTokenAmount,
  quoteTokenAmount,
  baseTokens,
  selectedBaseToken,
  selectedQuoteToken,
  quoteTokens,
  onBridgeRequest,
  onBaseTokenAmountChange,
  onBaseTokenChange,
  onQuoteTokenChange,
}) => {
  return (
    <Box>
      <Box padding={10} bgcolor="white" borderRadius={8}>
        <Typography variant="h4">{title}</Typography>
        <Typography variant="body1">{description}</Typography>
        <Box
          display="flex"
          alignItems="center"
          marginY={2}
          justifyContent="space-between"
        >
          <TokenSelector
            tokens={baseTokens}
            amount={baseTokenAmount ?? '0.00'}
            selectedToken={selectedBaseToken}
            onTokenChange={onBaseTokenChange}
            onAmountChange={onBaseTokenAmountChange}
          />
        </Box>

        <Box>
          <TokenSelector
            tokens={quoteTokens}
            amount={quoteTokenAmount ?? '0.00'}
            selectedToken={selectedQuoteToken}
            onTokenChange={onQuoteTokenChange}
          />
        </Box>
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={onBridgeRequest}>
            Bridge
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default Bridge
