export interface IBridgeDescriptorItemProps {
  id: string
  sides: INetworksPair
  onClick: (id: string) => void
}

export type INetworksPair = [string, string]
