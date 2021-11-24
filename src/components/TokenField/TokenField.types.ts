import { AccountBoundToken } from '@interfaces/data'

export interface ITokenFieldProps {
  tokens: AccountBoundToken[]
  isFetchingTokens?: boolean
  isFetchingAmount?: boolean
  selectedToken: AccountBoundToken
  disabled?: boolean
  readOnly?: boolean
  inputLabel?: string
  amount: string
  maxAmount?: string
  onAmountChange?: (amount: string) => void
  onTokenChange?: (token: AccountBoundToken) => void
}