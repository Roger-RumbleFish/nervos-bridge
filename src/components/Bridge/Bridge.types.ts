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
  isFetchingTokens?: boolean
  isCalculating?: boolean
  disableButton?: boolean
  network: string
  fee?: string
  onBaseTokenChange?: (token: Token) => void
  onQuoteTokenChange?: (token: Token) => void
  onBaseTokenAmountChange?: (value: string) => void
  onBridgeRequest?: () => void
  onNetworkChange?: (network: string) => void
}
