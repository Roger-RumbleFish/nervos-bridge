import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(({ palette }) => ({
  tab: {
    border: `1px solid ${palette.background.default}`,
    height: 64,
  },
  selectedTab: {
    backgroundColor: palette.background.default,
  },
}))
