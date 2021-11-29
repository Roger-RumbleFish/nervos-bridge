import { IBridgeDescriptor } from '@interfaces/data'

export interface IBridgeSelectorProps {
  bridgeDescriptors: IBridgeDescriptor[]
  selectedBridgeId?: IBridgeDescriptor['id']
  onSelect?: (bridgeId: IBridgeDescriptor['id']) => void
}
