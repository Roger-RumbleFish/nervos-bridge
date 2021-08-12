import React from 'react'

import { Box, Typography } from '@material-ui/core'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'

import useStyles from './NetworkItem.styles'
import { INetworkItemsProps } from './NetworkItem.types'

const NetworkItem: React.FC<INetworkItemsProps> = ({
  handleClose,
  id,
  from,
  to,
}) => {
  const classes = useStyles()

  return (
    <div className={classes.item} onClick={() => handleClose(id)}>
      <Box width="40%">
        <Typography variant="body2">{from}</Typography>
      </Box>

      <Box width="20%">
        <ArrowForwardIcon />
      </Box>
      <Box width="40%">
        <Typography variant="body2">{to}</Typography>
      </Box>
    </div>
  )
}

export default NetworkItem
