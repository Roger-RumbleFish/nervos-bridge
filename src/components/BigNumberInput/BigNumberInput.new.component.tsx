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

const BigNumberInput: React.FC<IBigNumberInputProps> = React.memo(
  ({
    decimals,
    displayDecimals,
    externalValue,
    onChange,
    inputComponent: Input = InputBase,
    ...rest
  }) => {
    console.log('[components][bignumber] rerender', externalValue.toString())
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
      console.log(
        '[components][bignumber] effect set value',
        externalValue.toString(),
      )
      const { displayValue } = getDisplayValue(
        externalValue,
        decimals,
        decimals,
      )

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
  },
  (
    {
      value: prevValue,
      externalValue: prevExternalValue,
      decimals: prevDecimals,
    },
    {
      value: nextValue,
      externalValue: nextExternalValue,
      decimals: nextDecimals,
    },
  ) => {
    console.log(
      '[components][bignumber] should update prev',
      prevValue.toString(),
      prevExternalValue.toString(),
    )
    console.log(
      '[components][bignumber] should update next',
      nextValue.toString(),
      nextExternalValue.toString(),
    )
    console.log(
      '[components][bignumber] prevExternalValue.eq(nextExternalValue)',
      prevExternalValue.eq(nextExternalValue),
    )
    console.log(
      '[components][bignumber] nextValue.eq(nextExternalValue)',
      nextValue.eq(nextExternalValue),
    )
    console.log(
      '[components][bignumber] not rerender',
      prevExternalValue.eq(nextExternalValue) &&
        nextValue.eq(nextExternalValue),
    )
    return (
      prevExternalValue.eq(nextExternalValue) &&
      nextValue.eq(nextExternalValue) &&
      prevDecimals === nextDecimals
    )
  },
)

export default BigNumberInput
