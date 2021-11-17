import React, { useRef, useState } from 'react'

import DropdownDesktop from '@components/Dropdown'
import DropdownArrowIcon from '@components/icons/DropdownArrow'
import BridgeDescriptor from '@components/network/BridgeDescriptor'
import { Box, Button, Paper, Typography } from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import SyncAltIcon from '@material-ui/icons/SyncAlt'
import { Skeleton } from '@material-ui/lab'

import useStyles from './BridgeSelector.styles'
import { IBridgeSelectorProps } from './BridgeSelector.types'

const BridgeSelector: React.FC<IBridgeSelectorProps> = ({
  bridgeDescriptors,
  onSelect,
  selectedBridgeId,
}) => {
  const selectedBridge =
    selectedBridgeId &&
    bridgeDescriptors.find(
      (bridgeDescriptor) => bridgeDescriptor.id === selectedBridgeId,
    )
  const classes = useStyles()

  const [open, setOpen] = React.useState(false)
  const [age, setAge] = React.useState('')

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  const [anchorEl, setAnchorEl] = useState(null)
  const inputEl = useRef(null)

  const handleDropdownOpen = () => {
    setAnchorEl(inputEl?.current)
  }

  const handleCloseDropdown = () => {
    setAnchorEl(null)
  }

  const handleItemSelection = (id: string) => {
    onSelect?.(id)
    handleClose()
  }

  const isOpen = Boolean(anchorEl)

  console.log('[bridge][selector] selected bridge', selectedBridge)
  return (
    <>
      <Paper variant="outlined" onClick={handleDropdownOpen}>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Button
            fullWidth
            disabled={!selectedBridge}
            onClick={handleClickOpen}
          >
            {!selectedBridge ? (
              'Select Bridge'
            ) : (
              <Box display="flex" justifyContent="center">
                <Box display="flex" alignItems="center" marginRight={1}>
                  <Typography variant="body2">
                    {selectedBridge.sides[0]}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" marginX={1}>
                  <SyncAltIcon />
                </Box>
                <Box display="flex" alignItems="center" marginLeft={1}>
                  <Typography variant="body2">
                    {selectedBridge.sides[1]}
                  </Typography>
                </Box>
              </Box>
            )}
          </Button>
        </Box>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Select Bridge</DialogTitle>
          <DialogContent>
            {bridgeDescriptors?.map((bridgeDescriptor) => (
              <BridgeDescriptor
                key={bridgeDescriptor.id}
                id={bridgeDescriptor.id}
                sides={bridgeDescriptor.sides}
                handleClose={handleItemSelection}
              />
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleClose} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </>
  )
}

export default BridgeSelector
