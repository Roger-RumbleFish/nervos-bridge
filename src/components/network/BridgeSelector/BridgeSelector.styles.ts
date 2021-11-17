import { makeStyles } from '@material-ui/core/styles'
import { lightGray } from '@styles/theme'

const useStyles = makeStyles(({ palette, spacing }) => ({
  root: {
    display: 'flex',
    padding: spacing(2),
    backgroundColor: palette.common.white,
    justifyContent: 'space-between',
    border: `1px solid ${lightGray}`,
    borderRadius: spacing(0.75),
  },
}))

export default useStyles
