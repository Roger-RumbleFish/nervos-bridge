import { IDisplayValue } from '@interfaces/data'
import { Token } from '@state/types'

export interface IBridgeProps {
  title: string
  description: string
  baseTokenAmount: string
  quoteTokenAmount: string
  baseTokens: Token[]
  selectedBaseToken: Token
  quoteTokens: Token[]
  selectedQuoteToken: Token
  onBaseTokenChange?: (token: Token) => void
  onQuoteTokenChange?: (token: Token) => void
  onBaseTokenAmountChange?: (value: IDisplayValue) => void
  onBridgeRequest?: () => void
}
