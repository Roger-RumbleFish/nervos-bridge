import React from 'react'

import {
  Box,
  InputAdornment,
  InputBase,
  Paper,
  Typography,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { resolveTokenIcon } from '@utils/icons'

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
    <Box display="flex" width="100%">
      <Autocomplete
        disableClearable
        value={selectedToken}
        options={tokens}
        getOptionLabel={(option) => option.symbol}
        disabled={disabled}
        fullWidth
        onChange={(_event, token, reason) => {
          if (
            token &&
            typeof token !== 'string' &&
            reason === 'select-option'
          ) {
            onTokenChange?.(token)
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
          <Paper variant="outlined">
            <Box margin={1}>
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
            </Box>
          </Paper>
        )}
      />
    </Box>
  )
}

export default TokenSelector
