import React, { useState, useEffect } from 'react'

import clsx from 'clsx'

import BigNumberInput from '@components/BigNumberInput'
import TokenSelector from '@components/TokenSelector'
import { IDisplayValue } from '@interfaces/data'
import { Box, Button, Typography } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'

import messages from './TokenField.messages'
import { useStyles } from './TokenField.styles'
import { ITokenFieldProps } from './TokenField.types'

const TokenField: React.FC<ITokenFieldProps> = ({
  tokens,
  amount,
  selectedToken,
  disabled,
  readOnly,
  onAmountChange,
  onTokenChange,
  inputLabel,
  maxAmount,
  isFetchingTokens,
  isFetchingAmount,
}) => {
  const classes = useStyles()
  const [stateValue, setStateValue] = useState(amount)

  const valueChangeHandler = (value: IDisplayValue) => {
    onAmountChange?.(value.displayValue)
  }

  useEffect(() => {
    if (amount !== stateValue) {
      setStateValue(amount)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount])

  return (
    <Box display="flex" width="100%">
      <Box
        flexShrink={1}
        flexGrow={0}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        paddingX={{ xs: 2, sm: 2, md: 4 }}
        paddingY={2}
        className={classes.inputContainer}
        width="100%"
      >
        {inputLabel && (
          <Typography
            variant="subtitle1"
            classes={{
              subtitle1: clsx({
                [classes.disabledText]: disabled,
                [classes.disabledText]: readOnly,
              }),
            }}
          >
            {inputLabel}
          </Typography>
        )}

        <BigNumberInput
          decimals={selectedToken.decimals}
          displayDecimals={2}
          onChange={valueChangeHandler}
          value={stateValue}
          classes={{
            input: clsx(classes.inputText),
            disabled: clsx({
              [classes.disabledText]: disabled,
              [classes.disabledText]: readOnly,
            }),
          }}
          isFetching={isFetchingAmount}
          disabled={disabled || readOnly}
        />
      </Box>
      <Box
        flexBasis={{ xs: 150, sm: 188, md: 220 }}
        flexShrink={0}
        flexGrow={1}
        paddingX={{ xs: 1, sm: 2, md: 4 }}
        paddingY={2}
        className={classes.autocompleteContainer}
        width="100%"
        display="flex"
        flexDirection="column"
      >
        <Typography variant="caption" color="textSecondary">{`${
          messages.TOKEN_MAX_VALUE
        }: ${selectedToken.balance ?? 0}`}</Typography>
        <Box display="flex" height="100%">
          {isFetchingTokens ? (
            <CircularProgress disableShrink />
          ) : (
            <TokenSelector
              tokens={tokens}
              selectedToken={selectedToken}
              onTokenChange={onTokenChange}
            />
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default TokenField
