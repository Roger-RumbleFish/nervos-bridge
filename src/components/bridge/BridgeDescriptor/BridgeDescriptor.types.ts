import { Bridge, IBridgeDescriptor } from '@interfaces/data'

export interface IBridgeDescriptorItemProps extends IBridgeDescriptor {
  selected?: boolean
  onClick: (id: Bridge) => void
}
