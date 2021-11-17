export type INetworkName = string

export interface IBridgeDescriptor {
  id: string
  name: string
  sides: [INetworkName, INetworkName]
}

export interface IBridgeSelectorProps {
  bridgeDescriptors: IBridgeDescriptor[]
  selectedBridgeId?: IBridgeDescriptor['id']
  onSelect?: (bridgeId: IBridgeDescriptor['id']) => void
}
