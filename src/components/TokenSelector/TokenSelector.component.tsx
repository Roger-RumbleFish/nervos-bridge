import React from 'react'

import { BigNumber } from 'ethers'

import { getDisplayValue } from '@components/BigNumberInput/BigNumberInput.utils'
import { Box, InputBase, Typography } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'

import { useStyles } from './TokenSelector.styles'
import { ITokenSelectorProps } from './TokenSelector.types'

const TokenSelector: React.FC<ITokenSelectorProps> = ({
  tokens,
  selectedToken,
  disabled,
  onTokenChange,
}) => {
  const classes = useStyles()

  return (
    <Autocomplete
      fullWidth
      disableClearable
      value={selectedToken}
      options={tokens}
      getOptionLabel={(option) => option.symbol}
      classes={{
        root: classes.root,
        popupIndicator: classes.popupIcon,
      }}
      disabled={disabled}
      onChange={(_event, token, reason) => {
        if (token && typeof token !== 'string' && reason === 'select-option') {
          onTokenChange?.(token)
        }
      }}
      renderOption={(option) => {
        return (
          <Box
            width="100%"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography component="div">
              {option.symbol?.toUpperCase()}
            </Typography>
            <Typography variant="caption" component="div">
              <b>
                {
                  getDisplayValue(
                    option.balance ?? BigNumber.from(0),
                    2,
                    option.decimals ?? 2,
                  ).displayValue
                }
              </b>
            </Typography>
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
          }}
          fullWidth
          inputProps={{
            ...params.inputProps,
            style: {
              fontSize: 16,
            },
            value: (params.inputProps as {
              value: string
            }).value,
          }}
        />
      )}
    />
  )
}

export default TokenSelector
