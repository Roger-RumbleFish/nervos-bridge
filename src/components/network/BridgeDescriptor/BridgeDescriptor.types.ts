export interface IBridgeDescriptorItemProps {
  id: string
  sides: INetworksPair
  handleClose: (id: string) => void
}

export type INetworksPair = [string, string]
