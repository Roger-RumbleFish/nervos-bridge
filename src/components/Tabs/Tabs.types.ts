export interface ITabsProps<T> {
  items: { label: string; value: T }[]
  selectedValue: T
  onChange: (value: T) => void
}
