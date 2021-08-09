import { BigNumber } from 'ethers'

import { IDisplayValue } from '@interfaces/data'
import {
  convertIntegerDecimalToDecimal,
  truncateDecimals,
} from '@utils/stringOperations'

// Change decimals to required, displayDecimals to optional
export const getDisplayValue = (
  value: BigNumber,
  displayDecimals: number,
  _decimals?: number,
): IDisplayValue => {
  const decimals = _decimals ? _decimals : 0

  const displayValue = truncateDecimals(
    convertIntegerDecimalToDecimal(value, decimals),
    displayDecimals,
  )

  return {
    value,
    displayValue,
    decimals,
  }
}
