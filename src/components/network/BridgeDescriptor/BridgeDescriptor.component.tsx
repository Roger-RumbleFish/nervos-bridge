import React from 'react'

import { Box, Typography } from '@material-ui/core'
import SyncAltIcon from '@material-ui/icons/SyncAlt'

import useStyles from './BridgeDescriptor.styles'
import { IBridgeDescriptorItemProps } from './BridgeDescriptor.types'

const BridgeDescriptor: React.FC<IBridgeDescriptorItemProps> = ({
  id,
  handleClose,
  sides,
}) => {
  const classes = useStyles()

  return (
    <Box
      className={classes.hovered}
      onClick={() => handleClose(id)}
      display="flex"
      justifyContent="center"
      paddingX={2}
      paddingY={3}
    >
      <Box flexBasis="40%" display="flex" alignItems="center" marginRight={1}>
        <Typography variant="body2">{sides[0].toUpperCase()}</Typography>
      </Box>
      <Box display="flex" alignItems="center" marginX={1}>
        <SyncAltIcon />
      </Box>
      <Box flexBasis="40%" display="flex" alignItems="center" marginLeft={1}>
        <Typography variant="body2">{sides[1].toUpperCase()}</Typography>
      </Box>
    </Box>
  )
}

export default BridgeDescriptor
