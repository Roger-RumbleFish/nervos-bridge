import { alpha, makeStyles } from '@material-ui/core/styles'
import { textDisabled } from '@styles/theme'

export const useStyles = makeStyles(({ spacing, palette, breakpoints }) => ({
  root: {
    padding: spacing(0, 1),
    '&:hover': {
      background: alpha(palette.text.primary, 0.04),
      borderRadius: spacing(0.5),
    },
  },
  tokenIcon: {
    marginRight: spacing(3),
  },
  popupIcon: {
    '&:hover': {
      background: 'none',
    },
  },
  inputText: {
    fontWeight: 700,
    textOverflow: 'ellipsis',
    padding: 0,
    fontSize: '20px',
    height: '20px',
    lineHeight: '20px',

    [breakpoints.up('sm')]: {
      fontSize: '34px',
      height: '34px',
      lineHeight: '34px',
    },
  },
  disabledText: {
    color: textDisabled,
  },
  autocompleteText: {
    color: palette.text.secondary,
    width: 300,
  },
}))
