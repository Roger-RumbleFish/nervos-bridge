import { IDisplayValue } from '@interfaces/data'
import { InputBaseProps } from '@material-ui/core'

export interface IBigNumberInputProps
  extends Omit<InputBaseProps, 'onChange' | 'inputComponent'> {
  value: string
  decimals: number
  displayDecimals: number
  isFetching?: boolean
  onChange: (value: IDisplayValue) => void
  inputComponent?: React.ElementType<InputBaseProps>
}
