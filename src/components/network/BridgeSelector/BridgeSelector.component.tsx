import React from 'react'

import BridgeDescriptor from '@components/network/BridgeDescriptor'
import { Box, Button, Paper, Typography } from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import SyncAltIcon from '@material-ui/icons/SyncAlt'

import { messages } from './BridgeSelector.message'
import useStyles from './BridgeSelector.styles'
import { IBridgeSelectorProps } from './BridgeSelector.types'

const BridgeSelector: React.FC<IBridgeSelectorProps> = ({
  bridgeDescriptors,
  onSelect,
  selectedBridgeId,
}) => {
  const classes = useStyles()

  const selectedBridge =
    selectedBridgeId &&
    bridgeDescriptors.find(
      (bridgeDescriptor) => bridgeDescriptor.id === selectedBridgeId,
    )
  const [fromNetwork, toNetwork] = selectedBridge?.networks ?? []

  const [open, setOpen] = React.useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleBridgeSelect = (id: string) => {
    if (id !== selectedBridgeId) {
      onSelect?.(id)
    }
    handleClose()
  }

  return (
    <Paper variant="outlined">
      <Box display="flex" alignItems="center" justifyContent="center">
        <Button fullWidth disabled={!selectedBridge} onClick={handleOpen}>
          {!selectedBridge || bridgeDescriptors.length === 0 ? (
            messages.ACTION_NAME
          ) : (
            <Box display="flex" justifyContent="center">
              <Box display="flex" alignItems="center" marginRight={1}>
                <Typography variant="body2">{fromNetwork}</Typography>
              </Box>
              <Box display="flex" alignItems="center" marginX={1}>
                <SyncAltIcon />
              </Box>
              <Box display="flex" alignItems="center" marginLeft={1}>
                <Typography variant="body2">{toNetwork}</Typography>
              </Box>
            </Box>
          )}
        </Button>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{messages.ACTION_NAME}</DialogTitle>
        <DialogContent>
          <List className={classes.list}>
            {bridgeDescriptors?.map(({ id, name, networks }) => (
              <ListItem key={id}>
                <BridgeDescriptor
                  key={id}
                  id={id}
                  name={name}
                  networks={networks}
                  selected={id === selectedBridgeId}
                  onClick={handleBridgeSelect}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Paper>
  )
}

export default BridgeSelector
