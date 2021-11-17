import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(({ palette }) => ({
  hovered: {
    '&:hover': {
      background: palette.primary.main,
    },
    cursor: 'pointer',
  },
}))

export default useStyles
