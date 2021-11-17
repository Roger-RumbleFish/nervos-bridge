import { makeStyles } from '@material-ui/core/styles'
import { textDisabled } from '@styles/theme'

export const useStyles = makeStyles(({ spacing, palette, breakpoints }) => ({
  tokenIcon: {
    marginRight: spacing(3),
  },

  arrowIcon: {
    '& .MuiSvgIcon-root': {
      fill: palette.primary.main,
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

  availableButton: {
    color: textDisabled,
    cursor: 'pointer',
    fontSize: 12,
    border: `1px solid ${textDisabled}`,
    borderRadius: 8,
  },
}))
