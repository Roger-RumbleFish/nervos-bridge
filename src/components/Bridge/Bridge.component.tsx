import React from 'react'

import TokenField from '@components/TokenField'
import NetworkSelector from '@components/network/BridgeSelector'
import {
  Button,
  CircularProgress,
  Theme,
  useMediaQuery,
} from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

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
  onDepositRequest,
  onBaseTokenAmountChange,
  onBaseTokenChange,
  onQuoteTokenChange,
  onQuoteTokenAmountChange,
  onNetworkChange,
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
    /* <Box display="flex" alignItems="center" marginY={2}>
        <Typography>Fee</Typography>
        {isCalculating ? (
          <CircularProgress style={{ marginLeft: 6 }} size={16} />
        ) : (
          <Typography style={{ marginLeft: 6 }}>{fee ?? '-'}</Typography>
        )}
      </Box>

      <Box>
        <TokenField
          disabled
          isFetchingTokens={isFetchingTokens}
          isFetchingAmount={isCalculating}
          tokens={quoteTokens}
          amount={quoteTokenAmount}
          selectedToken={selectedQuoteToken}
          onTokenChange={onQuoteTokenChange}
          onAmountChange={onQuoteTokenAmountChange}
        />
      </Box> */
  )
}

export default Bridge
