import React from 'react'

import { getDisplayValue } from '@components/BigNumberInput/BigNumberInput.utils'
import SummaryCard from '@components/SummaryCard'
import TokenField from '@components/TokenField'
import NetworkSelector from '@components/bridge/BridgeSelector'
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
  onDepositRequest,
  onBaseTokenAmountChange,
  onBaseTokenChange,
  onQuoteTokenChange,
  onQuoteTokenAmountChange,
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
      {/* {selectedBaseToken && (
        <Box display="flex" justifyContent="space-between" marginTop={4}>
          <Box flexBasis="45%" width="100%">
            <SummaryCard
              label={selectedBaseToken.shadow.network}
              tokens={[
                {
                  id: selectedBaseToken?.id,
                  symbol: selectedBaseToken?.symbol,
                  displayValue: baseTokenAmount,
                },
              ]}
              isFetching={isFetchingTokens && !selectedBaseToken}
            />
          </Box>
          <Box flexBasis="45%" width="100%">
            <SummaryCard
              label={selectedBaseToken.network}
              tokens={[
                {
                  id: selectedBaseToken?.id,
                  symbol: selectedBaseToken?.symbol,
                  displayValue: baseTokenAmount,
                },
              ]}
              isFetching={isFetchingTokens && !selectedBaseToken}
            />
          </Box>
        </Box>
      )} */}
    </Box>
    /* <Box display="flex" alignItems="center" marginY={2}>
        <Typography>Fee</Typography>
        {isCalculating ? (
          <CircularProgress style={{ marginLeft: 6 }} size={16} />
        ) : (
          <Typography style={{ marginLeft: 6 }}>{fee ?? '-'}</Typography>
        )}
      </Box>*/
  )
}

export default Bridge
