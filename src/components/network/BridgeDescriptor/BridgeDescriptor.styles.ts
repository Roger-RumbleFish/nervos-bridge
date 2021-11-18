import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(({ palette }) => ({
  hovered: {
    '&:hover': {
      background: palette.primary.main,
      color: palette.primary.contrastText,
    },
    cursor: 'pointer',
  },
}))

export default useStyles
