import React, { useEffect, useRef, useState } from 'react'

import DropdownDesktop from '@components/Dropdown'
import DropdownArrowIcon from '@components/icons/DropdownArrow'
import NetworkItem from '@components/network/NetworkItem'
import { Box, Typography } from '@material-ui/core'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'

import {
  GET_NETWORK_TRANSFER_ITEMS,
  NETWORK_TRANSFER_ITEMS,
} from './NetworkSelector.constants'
import useStyles from './NetworkSelector.styles'
import { INetworkSelectorProps } from './NetworkSelector.types'

const NetworkSelector: React.FC<INetworkSelectorProps> = ({
  onChange,
  selectedNetwork,
}) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)
  const [currentItem, setCurrentItem] = useState(
    GET_NETWORK_TRANSFER_ITEMS[selectedNetwork] ?? NETWORK_TRANSFER_ITEMS[0],
  )
  const inputEl = useRef(null)

  useEffect(() => {
    onChange?.(currentItem.id)
  }, [currentItem, onChange])

  useEffect(() => {
    if (selectedNetwork) {
      onChange?.(
        GET_NETWORK_TRANSFER_ITEMS[selectedNetwork].id ??
          NETWORK_TRANSFER_ITEMS[0].id,
      )
    }
  }, [selectedNetwork, onChange])

  const handleDropdownOpen = () => {
    setAnchorEl(inputEl?.current)
  }

  const handleCloseDropdown = () => {
    setAnchorEl(null)
  }

  const handleItemSelection = (id: string) => {
    setCurrentItem(NETWORK_TRANSFER_ITEMS.find((item) => item.id === id))
    handleCloseDropdown()
  }

  const isOpen = Boolean(anchorEl)

  return (
    <>
      <div className={classes.root} ref={inputEl} onClick={handleDropdownOpen}>
        <Box display="flex" width="80%" justifyContent="space-between">
          <Typography variant="body2">{currentItem.from}</Typography>
          <ArrowForwardIcon />
          <Typography variant="body2">{currentItem.to}</Typography>
        </Box>
        <Box>
          <DropdownArrowIcon size={24} />
        </Box>
      </div>

      <DropdownDesktop
        anchorEl={anchorEl}
        isOpen={isOpen}
        onClose={handleCloseDropdown}
        width={inputEl?.current?.offsetWidth}
      >
        <div className={classes.itemsContainer}>
          {NETWORK_TRANSFER_ITEMS.map((item) => (
            <NetworkItem
              handleClose={handleItemSelection}
              key={item.id}
              id={item.id}
              from={item.from}
              to={item.to}
            />
          ))}
        </div>
      </DropdownDesktop>
    </>
  )
}

export default NetworkSelector
