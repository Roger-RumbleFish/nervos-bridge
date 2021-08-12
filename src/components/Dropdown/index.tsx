import React from 'react'

import { Popper } from '@material-ui/core'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

import useStyles from './dropdown-desktop.styles'
import { IDropdownDesktopProps } from './types'

const DropdownDesktop: React.FC<IDropdownDesktopProps> = ({
  id,
  width,
  isOpen,
  anchorEl,
  children,
  onClose,
}) => {
  const classes = useStyles({ width })

  if (!anchorEl) return null

  return (
    <Popper
      id={id}
      open={isOpen}
      modifiers={{
        flip: {
          enabled: false,
        },
        preventOverflow: {
          escapeWithReference: true,
        },
      }}
      placement="bottom-end"
      anchorEl={anchorEl}
      className={classes.popper}
    >
      <ClickAwayListener onClickAway={onClose}>{children}</ClickAwayListener>
    </Popper>
  )
}

export default DropdownDesktop
