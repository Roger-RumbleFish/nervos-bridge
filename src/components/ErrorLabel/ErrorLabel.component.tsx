import React from 'react'

import { Box, Typography } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import ErrorIcon from '@material-ui/icons/Error'

import { IErrorLabelProps } from './ErrorLabel.types'

const ErrorLabel: React.FC<IErrorLabelProps> = ({ message }) => {
  const { spacing, palette } = useTheme()
  return (
    <Box
      mt={2}
      p={2}
      display="flex"
      alignItems="center"
      borderRadius={8}
      bgcolor={palette.error.main}
      color={palette.common.white}
    >
      <ErrorIcon fill={palette.common.white} />
      <Typography
        style={{ marginLeft: spacing(1) }}
        variant="body2"
        color="inherit"
      >
        {message}
      </Typography>
    </Box>
  )
}

export default ErrorLabel
