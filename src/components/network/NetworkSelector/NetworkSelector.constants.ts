import { ITransferDirection } from '@components/network/NetworkItem/NetworkItem.types'
import { Networks } from '@utils/constants'

export const NETWORK_TRANSFER_ITEMS: ITransferDirection[] = [
  {
    id: Networks.Ethereum,
    from: Networks.Ethereum,
    to: Networks.Nervos,
  },
  {
    id: Networks.Nervos,
    from: Networks.Nervos,
    to: Networks.Ethereum,
  },
]

export const GET_NETWORK_TRANSFER_ITEMS: {
  [key: string]: ITransferDirection
} = {
  [Networks.Ethereum]: {
    id: Networks.Ethereum,
    from: Networks.Ethereum,
    to: Networks.Nervos,
  },
  [Networks.Nervos]: {
    id: Networks.Nervos,
    from: Networks.Nervos,
    to: Networks.Ethereum,
  },
}
