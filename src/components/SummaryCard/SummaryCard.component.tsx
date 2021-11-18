import React from 'react'

import clsx from 'clsx'

import { Box, Typography } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import { resolveTokenIcon } from '@utils/icons'

import { useStyles } from './SummaryCard.styles'
import { ISummaryCardProps } from './SummaryCard.types'
import { getRepresentativeValue } from './SummaryCard.utils'

const SummaryCard: React.FC<ISummaryCardProps> = ({
  label,
  tokens,
  additionalLabel,
  isFetching,
  error,
}) => {
  const { palette } = useTheme()
  const classes = useStyles()
  return (
    <Box
      display="flex"
      borderRadius={8}
      minHeight={140}
      color={error ? 'white' : undefined}
      bgcolor={error ? palette.error.main : palette.background.default}
      height="100%"
      width="100%"
    >
      <Box
        paddingY={2}
        paddingX={{ xs: 2, md: 6 }}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box className={clsx({ [classes.error]: error })}>
          <Typography variant="h4">{label}</Typography>
          {!isFetching && (
            <>
              <Box mt={2} ml={2}>
                {tokens.map((token) => {
                  return (
                    <Box
                      key={token?.id}
                      display="flex"
                      alignItems="center"
                      mb={2}
                    >
                      <Box display="flex" marginRight={1}>
                        {resolveTokenIcon(token?.symbol, 24)}
                      </Box>

                      <Typography variant="subtitle1">
                        {getRepresentativeValue(token?.displayValue)}
                        &nbsp;
                        {token?.symbol?.toUpperCase()}
                      </Typography>
                    </Box>
                  )
                })}
              </Box>
            </>
          )}
        </Box>
        {error && (
          <Typography variant="caption" color="error">
            {error}
          </Typography>
        )}
        <Box>
          <Typography variant="caption">{additionalLabel}</Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default SummaryCard
