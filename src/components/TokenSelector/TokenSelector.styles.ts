import { makeStyles } from '@material-ui/core/styles'

const BORDER_RADIUS = 8
export const textDisabled = '#9AA5B0'
export const lightGray = '#E0E0E0'

export const useStyles = makeStyles(({ spacing, palette }) => ({
  inputContainer: {
    borderTopLeftRadius: BORDER_RADIUS,
    borderBottomLeftRadius: BORDER_RADIUS,
    borderRight: 'none',
    border: `1px solid ${lightGray}`,

    boxShadow: '0px 3px rgba(0, 0, 0, 0.05)',

    height: 114,
  },

  autocompleteContainer: {
    borderTopRightRadius: BORDER_RADIUS,
    borderBottomRightRadius: BORDER_RADIUS,
    borderLeft: 'none',
    border: `1px solid ${lightGray}`,

    boxShadow: '0px 3px rgba(0, 0, 0, 0.05)',

    height: 114,
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
    fontSize: '34px',
    height: '34px',
    lineHeight: '34px',
    fontWeight: 700,
    padding: 0,
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
