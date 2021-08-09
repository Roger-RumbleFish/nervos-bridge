import React from 'react'

import clsx from 'clsx'

import BigNumberInput from '@components/BigNumberInput'
import DaiIcon from '@components/icons/Dai'
// import BigNumberInput from '@components/inputs/BigNumberInput'
// import { IDisplayValue } from '@interfaces/data'
import { Box, InputAdornment, InputBase, Typography } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import { Autocomplete } from '@material-ui/lab'
import { resolveTokenIcon } from '@utils/icons'

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
  // inputProps,
  maxAmount,
}) => {
  const { palette } = useTheme()
  const classes = useStyles()
  const BALANCE = 'balance'
  const handleChange = (value: any) => {
    onAmountChange?.(value)
  }

  // const SelectedTokenIcon = getTokenIconComponent(selectedToken?.symbol)

  const emptyInput = Number(amount) === 0

  return (
    <Box display="flex" width="100%">
      <Box
        flexShrink={1}
        flexGrow={0}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        paddingX={{ xs: 2, md: 4 }}
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
          disabled={disabled || readOnly}
          decimals={selectedToken?.decimals}
          displayDecimals={2}
          // displayDecimals={inputProps?.displayDecimals}
          classes={{
            input: clsx(classes.inputText),
            disabled: clsx({
              [classes.disabledText]: disabled,
              [classes.disabledText]: readOnly,
            }),
          }}
          inputProps={{
            inputMode: 'numeric',
          }}
          onChange={handleChange}
          value={amount ?? '0.00'}
        />
      </Box>
      <Box
        flexBasis={{ xs: 188, md: 220 }}
        flexShrink={0}
        flexGrow={1}
        paddingX={{ xs: 2, md: 4 }}
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
          <Autocomplete
            disableClearable
            value={selectedToken}
            options={tokens}
            getOptionLabel={(option) => option.symbol}
            onChange={(_event, token, reason) => {
              if (token && reason === 'select-option') {
                onTokenChange?.(token as any)
              }
            }}
            renderOption={(option) => {
              return (
                <React.Fragment>
                  <span className={classes.tokenIcon}>
                    <Box>{resolveTokenIcon(option.symbol)}</Box>
                  </span>
                  {option.symbol?.toUpperCase()}
                </React.Fragment>
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
                style={{ cursor: 'pointer' }}
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
                      {/* <SelectedTokenIcon
                        fill={!emptyInput ? palette.primary.main : undefined}
                        width={31}
                        height={31}
                      /> */}
                    </Box>
                  </InputAdornment>
                }
              />
            )}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default TokenSelector
