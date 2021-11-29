import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(({ palette }) => ({
  item: {
    cursor: 'pointer',
    '&:hover': {
      background: palette.primary.main,
      color: palette.primary.contrastText,
    },
  },
  selected: {
    boxSizing: 'border-box',
    border: `2px solid ${palette.primary.dark}`,
  },
}))

export default useStyles
