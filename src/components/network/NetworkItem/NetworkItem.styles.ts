import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(({ palette, spacing }) => ({
  item: {
    '&:hover': {
      background: palette.primary.main,
    },
    padding: spacing(2, 3),
    display: 'flex',
    justifyContent: 'space-between',
    cursor: 'pointer',
  },
}))

export default useStyles
