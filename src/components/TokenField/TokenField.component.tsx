import React, { useState, useEffect } from 'react'

import clsx from 'clsx'
import { BigNumber } from 'ethers'

import BigNumberInput from '@components/BigNumberInput'
import { getDisplayValue } from '@components/BigNumberInput/BigNumberInput.utils'
import TokenSelector from '@components/TokenSelector'
import { IDisplayValue } from '@interfaces/data'
import { Box, Button, Paper, Typography } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import { lightGray } from '@styles/theme'

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
    <Paper variant="outlined">
      <Box
        display="flex"
        width="100%"
        flexDirection={{ xs: 'column-reverse', md: 'row' }}
      >
        <Box
          flexShrink={1}
          flexGrow={0}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          paddingX={{ xs: 1, sm: 2, md: 4 }}
          paddingY={0.5}
          width="100%"
        >
          {!inputLabel || isFetchingTokens ? (
            <Skeleton width={150} />
          ) : (
            <Typography color="textSecondary" variant="caption">
              {inputLabel}
            </Typography>
          )}

          <BigNumberInput
            decimals={selectedToken?.decimals ?? 8}
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
          flexBasis={{ sm: 188, md: 220 }}
          flexShrink={0}
          flexGrow={1}
          paddingY={0.5}
          borderLeft={{ md: `1px solid ${lightGray}` }}
          display="flex"
          flexDirection="column"
          justifyContent="space-around"
        >
          <Box
            width="100%"
            paddingY={0.5}
            borderBottom={{ md: `1px solid ${lightGray}` }}
            paddingX={1}
          >
            {isFetchingTokens ? (
              <Skeleton width="100%" height={22} />
            ) : (
              <Button
                disabled={isFetchingTokens}
                fullWidth
                onClick={() => {
                  onAmountChange?.(
                    getDisplayValue(
                      selectedToken?.balance ?? BigNumber.from(0),
                      2,
                      selectedToken?.decimals ?? 2,
                    ).displayValue,
                  )
                }}
              >
                <Box
                  width="100%"
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-start"
                >
                  <Typography
                    variant="caption"
                    color="textSecondary"
                  >{`${messages.BALANCE}:`}</Typography>

                  <Typography color="textSecondary">
                    <b>
                      {
                        getDisplayValue(
                          selectedToken?.balance ?? BigNumber.from(0),
                          2,
                          selectedToken?.decimals ?? 2,
                        ).displayValue
                      }
                    </b>
                  </Typography>
                </Box>
              </Button>
            )}
          </Box>
          <Box width="100%" paddingY={0.5} paddingX={1}>
            {isFetchingTokens ? (
              <Skeleton width="100%" height={32} />
            ) : (
              <TokenSelector
                loading={isFetchingAmount}
                tokens={tokens}
                selectedToken={selectedToken}
                onTokenChange={onTokenChange}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}

export default TokenField
