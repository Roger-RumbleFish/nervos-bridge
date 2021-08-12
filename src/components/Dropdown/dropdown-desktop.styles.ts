import { makeStyles } from '@material-ui/core/styles'

import { IDropdownStyles } from './types'

const useStyles = makeStyles(() => ({
  popper: {
    // border: `1px solid ${colors.solitude}`,
    width: ({ width }: IDropdownStyles) => width,
    // color: colors.veryDarkGrayishBlue,
    overflow: 'hidden',
    borderRadius: 12,
    zIndex: 1300,
    boxShadow: '0 2px 7px 6px rgba(0, 0, 0, 0.1)',
  },
}))

export default useStyles
