import React, { useState, useEffect } from 'react'

import clsx from 'clsx'

import { Box, InputAdornment, InputBase, Typography } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Autocomplete } from '@material-ui/lab'
import { resolveTokenIcon } from '@utils/icons'
import { getInputValue } from '@utils/stringOperations'

import { useStyles } from './TokenSelector.styles'
import { ITokenSelectorProps } from './TokenSelector.types'

const TokenSelector: React.FC<ITokenSelectorProps> = ({
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

  const DISPLAY_DECIMALS = 6
  const BALANCE = 'balance'

  const valueChangeHandler = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const value = getInputValue(event?.currentTarget?.value, DISPLAY_DECIMALS)
    if (value || value === '') {
      setStateValue(value)

      onAmountChange?.(value)
    }
  }

  useEffect(() => {
    if (amount !== stateValue) {
      setStateValue(amount)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount])

  const emptyInput = Number(amount) === 0

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
        {isFetchingAmount ? (
          <CircularProgress />
        ) : (
          <InputBase
            disabled={disabled || readOnly}
            classes={{
              input: clsx(classes.inputText),
              disabled: clsx({
                [classes.disabledText]: disabled,
                [classes.disabledText]: readOnly,
              }),
            }}
            inputProps={{ inputMode: 'numeric' }}
            onChange={valueChangeHandler}
            value={stateValue}
          />
        )}
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
        {maxAmount && (
          <Box>
            <Typography>{`${BALANCE}: ${maxAmount}`}</Typography>
          </Box>
        )}
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
          height="100%"
        >
          {isFetchingTokens ? (
            <CircularProgress disableShrink />
          ) : (
            <Autocomplete
              disableClearable
              value={selectedToken}
              options={tokens}
              getOptionLabel={(option) => option.symbol}
              disabled={disabled}
              onChange={(_event, token, reason) => {
                if (token && reason === 'select-option') {
                  onTokenChange?.(token as any)
                }
              }}
              renderOption={(option) => {
                return (
                  <Box display="flex" alignItems="center">
                    <Box display="flex" mr={3}>
                      {resolveTokenIcon(option.symbol, 24)}
                    </Box>
                    <Typography> {option.symbol?.toUpperCase()}</Typography>
                  </Box>
                )
              }}
              renderInput={({
                InputProps,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                InputLabelProps: _inputLabelProps,
                ...params
              }) => (
                <InputBase
                  {...params}
                  {...InputProps}
                  style={{ cursor: disabled ? 'default' : 'pointer' }}
                  classes={{
                    input: classes.autocompleteText,
                    adornedEnd: clsx({ [classes.arrowIcon]: !emptyInput }),
                  }}
                  inputProps={{
                    ...params.inputProps,
                    style: {
                      fontSize: 16,
                    },
                    value: (params.inputProps as {
                      value: string
                    }).value?.toUpperCase(),
                  }}
                  startAdornment={
                    <InputAdornment position="start">
                      <Box>
                        {selectedToken &&
                          selectedToken.symbol &&
                          resolveTokenIcon(selectedToken.symbol, 24)}
                      </Box>
                    </InputAdornment>
                  }
                />
              )}
            />
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default TokenSelector
