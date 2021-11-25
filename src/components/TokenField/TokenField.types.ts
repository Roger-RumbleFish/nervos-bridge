import { BigNumber } from '@ethersproject/bignumber'
import { AccountBoundToken } from '@interfaces/data'

export interface ITokenFieldProps {
  tokens: AccountBoundToken[]
  isFetchingTokens?: boolean
  isFetchingAmount?: boolean
  selectedToken: AccountBoundToken
  disabled?: boolean
  readOnly?: boolean
  inputLabel?: string
  value: BigNumber
  externalValue: BigNumber
  maxAmount?: string
  onAmountChange?: (amount: BigNumber) => void
  onExternalAmountChange?: (amount: BigNumber) => void
  onTokenChange?: (token: AccountBoundToken) => void
}
