export interface IToggleProps {
  toggles: { id: string; name: string }[]
  onToggleChange?: (value: string) => void
}
