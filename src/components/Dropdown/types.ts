import { PopperProps } from '@material-ui/core'

export interface IDropdownStyles {
  width?: number
}

export interface IDropdownDesktopProps {
  isOpen: boolean
  width?: number
  id?: string
  anchorEl: PopperProps['anchorEl']
  onClose: (event: React.MouseEvent<Document, MouseEvent>) => void
}
