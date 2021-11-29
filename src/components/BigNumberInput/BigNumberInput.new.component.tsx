import React, { useEffect, useState } from 'react'

import { BigNumber } from 'ethers'

import { InputBase, InputBaseProps } from '@material-ui/core'
import {
  convertDecimalToIntegerDecimal,
  getInputValue,
} from '@utils/stringOperations'

import { getDisplayValue } from './BigNumberInput.utils'

export interface IBigNumberInputProps
  extends Omit<InputBaseProps, 'onChange' | 'inputComponent'> {
  externalValue: BigNumber
  value: BigNumber
  decimals: number
  displayDecimals: number
  onChange: (value: BigNumber) => void
  inputComponent?: React.ElementType<InputBaseProps>
}

const BigNumberInput: React.FC<IBigNumberInputProps> = ({
  decimals,
  displayDecimals,
  externalValue,
  onChange,
  inputComponent: Input = InputBase,
  ...rest
}) => {
  const { displayValue } = getDisplayValue(
    externalValue,
    displayDecimals,
    decimals,
  )
  const [valueString, setValueString] = useState(displayValue)

  useEffect(() => {
    onChange(
      BigNumber.from(convertDecimalToIntegerDecimal(valueString, decimals)),
    )
  }, [valueString, decimals, onChange])

  useEffect(() => {
    const { displayValue } = getDisplayValue(externalValue, decimals, decimals)

    setValueString(displayValue)
  }, [externalValue, decimals, displayDecimals, setValueString])

  const valueChangeHandler = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    const inputValue = getInputValue(
      event?.currentTarget?.value,
      displayDecimals,
    )

    if (inputValue || inputValue === '') {
      setValueString(inputValue)
    }
  }

  return (
    <Input
      {...rest}
      inputProps={{ inputMode: 'numeric' }}
      onChange={valueChangeHandler}
      value={getInputValue(valueString, displayDecimals)}
    />
  )
}

export default BigNumberInput
