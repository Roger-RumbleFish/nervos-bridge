export interface ISummaryCardProps {
  label: string
  additionalLabel?: string
  tokens: {
    id: string
    symbol: string
    displayValue: string
  }[]
  isFetching?: boolean
  error?: string
}
