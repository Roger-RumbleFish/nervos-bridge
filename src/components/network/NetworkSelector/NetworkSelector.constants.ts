import { ITransferDirection } from '@components/network/NetworkItem/NetworkItem.types'
import { Networks } from '@utils/constants'

export const NETWORK_TRANSFER_ITEMS: ITransferDirection[] = [
  {
    id: Networks.Ethereum,
    from: Networks.Ethereum,
    to: Networks.NervosL2,
  },
  // {
  //   id: Networks.NervosL2,
  //   from: Networks.NervosL2,
  //   to: Networks.Ethereum,
  // },
  {
    id: Networks.NervosL1,
    from: Networks.NervosL1,
    to: Networks.NervosL2,
  },
]

export const GET_NETWORK_TRANSFER_ITEMS: {
  [key: string]: ITransferDirection
} = {
  [Networks.Ethereum]: {
    id: Networks.Ethereum,
    from: Networks.Ethereum,
    to: Networks.NervosL2,
  },
  [Networks.NervosL2]: {
    id: Networks.NervosL2,
    from: Networks.NervosL2,
    to: Networks.Ethereum,
  },
  [Networks.NervosL1]: {
    id: Networks.NervosL1,
    from: Networks.NervosL1,
    to: Networks.NervosL2,
  },
}
