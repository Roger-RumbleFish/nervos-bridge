import { Token } from '@state/types'

export interface ITokenSelectorProps {
  tokens: Token[]
  selectedToken: Token
  disabled?: boolean
  readOnly?: boolean
  onTokenChange?: (token: Token) => void
}
