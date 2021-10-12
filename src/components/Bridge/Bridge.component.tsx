import React from 'react'

import NetworkSelector from '@components/network/NetworkSelector'
import {
  Button,
  CircularProgress,
  Theme,
  useMediaQuery,
} from '@material-ui/core'
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
  isFetchingTokens,
  isCalculating,
  disableButton,
  network,
  fee,
  onBridgeRequest,
  onBaseTokenAmountChange,
  onBaseTokenChange,
  onQuoteTokenChange,
  onQuoteTokenAmountChange,
  onNetworkChange,
}) => {
  const isMobile = !useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

  return (
    <Box>
      <Box padding={{ xs: 2, sm: 10 }} bgcolor="white" borderRadius={8}>
        <Box
          display={{ xs: 'block', sm: 'flex' }}
          justifyContent="space-between"
        >
          <Typography variant="h2">Bridge</Typography>
          <Box
            maxWidth={500}
            minWidth={{ xs: 250, sm: 320 }}
            py={{ xs: 2, sm: 0 }}
          >
            <NetworkSelector
              selectedNetwork={network}
              onChange={onNetworkChange}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="h4">{title}</Typography>
          <Typography variant="body1">{description}</Typography>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          marginY={2}
          justifyContent="space-between"
        >
          <TokenSelector
            isFetchingTokens={isFetchingTokens}
            tokens={baseTokens}
            amount={baseTokenAmount ?? '0.00'}
            selectedToken={selectedBaseToken}
            onTokenChange={onBaseTokenChange}
            onAmountChange={onBaseTokenAmountChange}
          />
        </Box>

        <Box display="flex" alignItems="center" marginY={2}>
          <Typography>Fee</Typography>
          {isCalculating ? (
            <CircularProgress style={{ marginLeft: 6 }} size={16} />
          ) : (
            <Typography style={{ marginLeft: 6 }}>{fee ?? '-'}</Typography>
          )}
        </Box>

        <Box>
          <TokenSelector
            disabled
            isFetchingTokens={isFetchingTokens}
            isFetchingAmount={isCalculating}
            tokens={quoteTokens}
            amount={quoteTokenAmount}
            selectedToken={selectedQuoteToken}
            onTokenChange={onQuoteTokenChange}
            onAmountChange={onQuoteTokenAmountChange}
          />
        </Box>
        <Box mt={2} width={{ xs: '100%', sm: 'auto' }}>
          <Button
            style={{ width: isMobile ? '100%' : 'auto' }}
            disabled={disableButton}
            variant="contained"
            color="primary"
            onClick={onBridgeRequest}
          >
            Bridge
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default Bridge
