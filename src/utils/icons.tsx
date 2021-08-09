import React, { ReactElement } from 'react'

import DaiIcon from '@components/icons/Dai'
import UsdcIcon from '@components/icons/Usdc'
import UsdtIcon from '@components/icons/Usdt'

export const resolveTokenIcon = (symbol: string): ReactElement | null => {
  switch (symbol.toUpperCase()) {
    case 'DAI':
      return <DaiIcon />
    case 'USDC':
      return <UsdcIcon />
    case 'USDT':
      return <UsdtIcon />
    default:
      return null
  }
}
