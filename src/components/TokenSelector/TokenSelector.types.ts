import { AccountBoundToken } from '@interfaces/data'

export interface ITokenSelectorProps {
  tokens: AccountBoundToken[]
  selectedToken: AccountBoundToken
  loading?: boolean
  disabled?: boolean
  readOnly?: boolean
  onTokenChange?: (token: AccountBoundToken) => void
}
