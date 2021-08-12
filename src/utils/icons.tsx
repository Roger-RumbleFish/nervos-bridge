import React, { ReactElement } from 'react'

import DaiIcon from '@components/icons/tokens/Dai'
import UsdcIcon from '@components/icons/tokens/Usdc'
import UsdtIcon from '@components/icons/tokens/Usdt'

export const resolveTokenIcon = (
  symbol: string,
  size?: number,
): ReactElement | null => {
  switch (symbol.toUpperCase()) {
    case 'DAI':
    case 'CKDAI':
      return <DaiIcon size={size} />
    case 'USDC':
    case 'CKUSDC':
      return <UsdcIcon size={size} />
    case 'USDT':
    case 'CKUSDT':
      return <UsdtIcon size={size} />
    default:
      return null
  }
}
