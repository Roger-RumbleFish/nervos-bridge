import { makeStyles } from '@material-ui/core/styles'
import { lightGray, textDisabled } from '@styles/theme'

const BORDER_RADIUS = 8

export const useStyles = makeStyles(({ spacing, palette, breakpoints }) => ({
  inputContainer: {
    borderTopLeftRadius: BORDER_RADIUS,
    borderBottomLeftRadius: BORDER_RADIUS,
    borderRight: 'none',
    border: `1px solid ${lightGray}`,
    justifyContent: 'center',
    boxShadow: '0px 3px rgba(0, 0, 0, 0.05)',

    height: 80,
    [breakpoints.up('sm')]: {
      height: 114,
    },
    // height: 114,
  },

  autocompleteContainer: {
    borderTopRightRadius: BORDER_RADIUS,
    borderBottomRightRadius: BORDER_RADIUS,
    borderLeft: 'none',
    border: `1px solid ${lightGray}`,

    boxShadow: '0px 3px rgba(0, 0, 0, 0.05)',

    height: 80,
    [breakpoints.up('sm')]: {
      height: 114,
    },
  },

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
  },

  availableButton: {
    color: textDisabled,
    cursor: 'pointer',
    fontSize: 12,
    border: `1px solid ${textDisabled}`,
    borderRadius: 8,
  },
}))
