export interface INetworkItemsProps extends ITransferDirection {
  handleClose: (id: string) => void
}

export interface ITransferDirection {
  id: string
  from: string
  to: string
}
