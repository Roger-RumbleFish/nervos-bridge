import { AccountBoundToken } from '@interfaces/data'

export interface IBridgeProps {
  title: string
  description: string
  baseTokenAmount: string
  quoteTokenAmount: string
  baseTokens: AccountBoundToken[]
  selectedBaseToken: AccountBoundToken
  quoteTokens: AccountBoundToken[]
  selectedQuoteToken: AccountBoundToken
  isFetchingTokens?: boolean
  isCalculating?: boolean
  disableButton?: boolean
  network: string
  fee?: string
  onBaseTokenChange?: (token: AccountBoundToken) => void
  onQuoteTokenChange?: (token: AccountBoundToken) => void
  onBaseTokenAmountChange?: (value: string) => void
  onQuoteTokenAmountChange?: (value: string) => void
  onDepositRequest?: () => void
  onNetworkChange?: (network: string) => void
}
