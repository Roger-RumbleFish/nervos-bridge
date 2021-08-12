export interface ITokenSelectorProps {
  tokens: any[]
  isFetchingTokens?: boolean
  isFetchingAmount?: boolean
  selectedToken: any
  disabled?: boolean
  readOnly?: boolean
  inputLabel?: string
  amount: string
  maxAmount?: string
  onAmountChange?: (amount: string) => void
  // inputProps?: Pick<IBigNumberInputProps, 'displayDecimals'>
  onTokenChange?: (token: any) => void
}
