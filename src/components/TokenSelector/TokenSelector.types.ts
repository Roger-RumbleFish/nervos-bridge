import { Token } from '@interfaces/data'

export interface ITokenSelectorProps {
  tokens: Token[]
  selectedToken: Token
  disabled?: boolean
  readOnly?: boolean
  onTokenChange?: (token: Token) => void
}
