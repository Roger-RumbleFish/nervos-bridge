import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(({ spacing, palette }) => ({
  error: {
    border: `1px solid ${palette.error.main}`,
    borderRadius: 8,
    padding: spacing(2),
  },
}))
