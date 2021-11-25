import React from 'react'

import TokenField from '@components/TokenField'
import { Theme, useMediaQuery } from '@material-ui/core'

import { IBridgeProps } from './Bridge.types'

const Bridge: React.FC<IBridgeProps> = ({
  value,
  externalValue,
  baseTokens,
  selectedBaseToken,
  isFetchingTokens,
  onBaseTokenAmountChange,
  onBaseTokenChange,
  onExternalTokenAmountChange,
}) => {
  const isMobile = !useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

  console.log(
    '[compoenets][bridge] token value',
    externalValue.toString(),
    selectedBaseToken?.symbol,
  )
  const inputLabel = !isMobile ? selectedBaseToken?.symbol : undefined

  return (
    <TokenField
      inputLabel={inputLabel}
      isFetchingTokens={isFetchingTokens}
      tokens={baseTokens}
      value={value}
      externalValue={externalValue}
      selectedToken={selectedBaseToken}
      onTokenChange={onBaseTokenChange}
      onAmountChange={onBaseTokenAmountChange}
      onExternalAmountChange={onExternalTokenAmountChange}
    />
  )
}

export default Bridge
