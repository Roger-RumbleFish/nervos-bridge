import { IDisplayValue } from '@interfaces/data'

export interface ITokenSelectorProps {
  tokens: any[]
  selectedToken: any
  amount: string
  disabled?: boolean
  readOnly?: boolean
  inputLabel?: string
  maxAmount?: string
  // inputProps?: Pick<IBigNumberInputProps, 'displayDecimals'>
  onAmountChange?: (amount: IDisplayValue) => void
  onTokenChange?: (token: any) => void
}
