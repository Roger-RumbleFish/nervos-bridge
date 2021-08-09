import React, { useEffect, useState } from 'react'

import { BigNumber } from 'ethers'

import { InputBase } from '@material-ui/core'
import {
  convertDecimalToIntegerDecimal,
  getInputValue,
  truncateDecimals,
} from '@utils/stringOperations'

import { IBigNumberInputProps } from './BigNumberInput.types'

const BigNumberInput: React.FC<IBigNumberInputProps> = ({
  decimals,
  displayDecimals,
  value,
  onChange,
  inputComponent: Input = InputBase,
  ...rest
}) => {
  const [stateValue, setStateValue] = useState(value)

  useEffect(() => {
    if (stateValue !== value) {
      const displayValue = truncateDecimals(value, displayDecimals)
      setStateValue(displayValue)

      onChange({
        value: BigNumber.from(
          convertDecimalToIntegerDecimal(displayValue, decimals),
        ),
        displayValue: displayValue,
        decimals,
      })
    }
  }, [value])

  useEffect(() => {
    onChange({
      value: BigNumber.from(convertDecimalToIntegerDecimal(value, decimals)),
      displayValue: value,
      decimals,
    })
  }, [decimals])

  const valueChangeHandler = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    const value = getInputValue(event?.currentTarget?.value, displayDecimals)
    if (value || value === '') {
      setStateValue(value)

      onChange({
        value: BigNumber.from(convertDecimalToIntegerDecimal(value, decimals)),
        displayValue: value,
        decimals,
      })
    }
  }

  return (
    <Input
      {...rest}
      inputProps={{ inputMode: 'numeric' }}
      onChange={valueChangeHandler}
      value={value}
    />
  )
}

export default BigNumberInput
